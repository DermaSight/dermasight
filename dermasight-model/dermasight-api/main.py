"""
DermaSight v3 — REST API
FastAPI + GradCAM visualization (3-panel image output)
"""

import io, json, os, time, base64
import numpy as np
from pathlib import Path
from typing import Optional, List, Dict, Any

import tensorflow as tf
from tensorflow import keras
from PIL import Image, ImageDraw, ImageFilter

from fastapi import FastAPI, File, UploadFile, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent / ".env")
except ImportError:
    pass

# ── Groq ──────────────────────────────────────────────────────────────────────
try:
    from groq import Groq as GroqClient
    _GROQ_SDK = True
except ImportError:
    _GROQ_SDK = False

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL   = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
groq_client  = None

if _GROQ_SDK and GROQ_API_KEY:
    groq_client = GroqClient(api_key=GROQ_API_KEY)
    print(f"✅ Groq → {GROQ_MODEL}")
else:
    print("⚠️  GROQ_API_KEY tidak ditemukan")

# ── Config ────────────────────────────────────────────────────────────────────
EXPORT_DIR = Path(__file__).parent / "exports"
IMG_SIZE   = 224

MALIGNANCY_SCORE = {
    "Basal_Cell_Carcinoma": 0.7,
    "Melanocytic_Nevi"    : 0.1,
    "Melanoma"            : 0.9,
}
SEVERITY_THRESHOLDS = {
    "Mild"    : (0.00, 0.15),
    "Moderate": (0.15, 0.40),
    "Severe"  : (0.40, 1.00),
}
SITE_RISK_SCORE = {
    "head/neck":0.8,"torso":0.7,"anterior torso":0.7,"posterior torso":0.7,
    "lateral torso":0.6,"upper extremity":0.5,"lower extremity":0.5,
    "palms/soles":0.9,"oral/genital":0.85,
}

# Warna (R,G,B) per kelas
CLASS_COLORS = {
    "Melanoma"            : (239, 68,  68),
    "Basal_Cell_Carcinoma": (249, 115, 22),
    "Melanocytic_Nevi"    : ( 34, 197, 94),
}
CLASS_SHORT = {
    "Melanoma"            : "MEL",
    "Basal_Cell_Carcinoma": "BCC",
    "Melanocytic_Nevi"    : "NV",
}
CLASS_DISPLAY_NAME = {
    "Melanocytic_Nevi"    : "Nevus Melanositik",
    "Basal_Cell_Carcinoma": "Karsinoma Sel Basal",
    "Melanoma"            : "Melanoma",
}
CLASS_BRIEF = {
    "Melanocytic_Nevi"    : "sejenis tahi lalat jinak yang sangat umum ditemukan pada kulit.",
    "Basal_Cell_Carcinoma": "jenis kanker kulit yang tumbuh lambat dan jarang menyebar.",
    "Melanoma"            : "jenis kanker kulit yang serius dan perlu ditangani segera.",
}
SEV_COLORS = {
    "Mild"    : ( 34, 197, 94),
    "Moderate": (245, 158, 11),
    "Severe"  : (239,  68, 68),
}

# ── Load configs ──────────────────────────────────────────────────────────────
with open(EXPORT_DIR / "class_names.json") as f:
    CLASS_NAMES = json.load(f)
with open(EXPORT_DIR / "label2idx.json") as f:
    label2idx = json.load(f)
idx2label = {v: k for k, v in label2idx.items()}

# ── Load models ───────────────────────────────────────────────────────────────
print("Loading models...")
ensemble_model = keras.models.load_model(str(EXPORT_DIR / "dermasight_v3_ensemble.keras"))
ensemble_model.compile(optimizer="adam", metrics=["accuracy"])
print(f"  ✅ {ensemble_model.name}")

effnet_model = keras.models.load_model(str(EXPORT_DIR / "dermasight_v3_efficientnetv2s.keras"))
effnet_model.compile(optimizer="adam", metrics=["accuracy"])
print(f"  ✅ {effnet_model.name}")
print("Models ready.\n")

# ── GradCAM ───────────────────────────────────────────────────────────────────
class GradCAM:
    CONV_LAYER = "top_conv"
    def __init__(self, model):
        conv_layer = base_model = None
        for layer in model.layers:
            if layer.name == self.CONV_LAYER:
                conv_layer = layer; break
            if isinstance(layer, keras.Model):
                for sub in layer.layers:
                    if sub.name == self.CONV_LAYER:
                        conv_layer = sub; base_model = layer; break
            if conv_layer: break
        if not conv_layer:
            raise ValueError(f"Layer '{self.CONV_LAYER}' tidak ditemukan")
        self.grad_model = keras.Model(
            inputs=base_model.inputs,
            outputs=[conv_layer.output, base_model.output])
        head_inp = keras.Input(shape=base_model.output_shape[1:])
        x = head_inp; found = False
        for layer in model.layers:
            if layer == base_model: found = True; continue
            if found:
                if layer.name == "output":
                    x = keras.layers.Dense(len(CLASS_NAMES), name="output_logit")(x)
                    tmp = keras.Model(head_inp, x)
                    tmp.get_layer("output_logit").set_weights(
                        model.get_layer("output").get_weights())
                    x = tmp(head_inp); break
                else: x = layer(x)
        self.head_model = keras.Model(head_inp, x)

    def compute(self, img_batch, class_idx):
        img = tf.cast(img_batch, tf.float32)
        with tf.GradientTape(persistent=True) as tape:
            conv_out, base_out = self.grad_model(img, training=False)
            tape.watch(conv_out)
            loss = self.head_model(base_out, training=False)[:, class_idx]
        grads = tape.gradient(loss, conv_out); del tape
        if grads is None: return np.zeros((7,7), dtype=np.float32)
        weights = tf.reduce_mean(grads, axis=(0,1,2))
        cam = tf.nn.relu(
            tf.reduce_sum(weights * conv_out[0], axis=-1)
        ).numpy().astype(np.float32)
        if cam.max() > 0:
            cam = (cam - cam.min()) / (cam.max() - cam.min() + 1e-8)
        return cam

gradcam = GradCAM(effnet_model)
print("✅ GradCAM initialized")


# ══════════════════════════════════════════════════════════════════════════════
#  IMAGE GENERATION HELPERS
# ══════════════════════════════════════════════════════════════════════════════

def _jet_colormap(t: np.ndarray) -> np.ndarray:
    """Pure-numpy jet colormap. t: float32 (H,W) in [0,1] → (H,W,3) uint8."""
    r = np.clip(1.5 - np.abs(4*t - 3), 0, 1)
    g = np.clip(1.5 - np.abs(4*t - 2), 0, 1)
    b = np.clip(1.5 - np.abs(4*t - 1), 0, 1)
    return (np.stack([r, g, b], axis=-1) * 255).astype(np.uint8)


def _pil_to_b64(img: Image.Image, quality: int = 90) -> str:
    buf = io.BytesIO()
    img.convert("RGB").save(buf, format="JPEG", quality=quality)
    return base64.b64encode(buf.getvalue()).decode()


def _get_font(size: int):
    """Try to load Arial, fallback to PIL default."""
    from PIL import ImageFont
    for name in ("arialbd.ttf", "arial.ttf", "DejaVuSans-Bold.ttf",
                 "DejaVuSans.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"):
        try:
            return ImageFont.truetype(name, size)
        except Exception:
            pass
    return ImageFont.load_default()


def make_heatmap_overlay(orig_np: np.ndarray, heatmap_np: np.ndarray) -> Image.Image:
    """
    Panel 2 — GradCAM jet overlay blended over the original image.
    Includes a subtle legend bar at the bottom.
    """
    W = H = IMG_SIZE
    orig_pil  = Image.fromarray(orig_np.astype(np.uint8)).convert("RGB")
    jet_np    = _jet_colormap(heatmap_np)          # (224,224,3) uint8
    jet_pil   = Image.fromarray(jet_np)

    # Blend: 52% original + 48% heatmap for vivid but readable result
    blended = Image.blend(orig_pil, jet_pil, alpha=0.48)

    # ── colorbar strip at bottom (12px) ──────────────────────────────────────
    bar_h = 12
    bar_np = _jet_colormap(
        np.linspace(0, 1, W, dtype=np.float32)[np.newaxis, :]
        .repeat(bar_h, axis=0)
    )                                               # (bar_h, W, 3)
    bar_pil = Image.fromarray(bar_np)

    # Dark band behind colorbar
    band = Image.new("RGB", (W, bar_h + 6), (8, 14, 26))
    band.paste(bar_pil, (0, 3))

    # Assemble: shrink blended by bar_h+6, paste bar below
    content_h = H - (bar_h + 6)
    result = Image.new("RGB", (W, H))
    result.paste(blended.crop((0, 0, W, content_h)), (0, 0))
    result.paste(band, (0, content_h))

    # Label "Low" / "High" inside bar
    draw = ImageDraw.Draw(result)
    font = _get_font(8)
    draw.text((3, content_h + 2), "Low", fill=(255,255,255), font=font)
    lbl = "High"
    try:
        bb = draw.textbbox((0,0), lbl, font=font)
        tw = bb[2] - bb[0]
    except Exception:
        tw = 20
    draw.text((W - tw - 3, content_h + 2), lbl, fill=(255,255,255), font=font)

    return result


def make_result_card(
    orig_np   : np.ndarray,
    pred_class: str,
    confidence: float,
    severity  : str,
) -> Image.Image:
    """
    Panel 3 — original image with:
      • slight dark vignette
      • glowing circle badge centered with class code + confidence
      • severity dot (top-right corner)
    """
    W = H = IMG_SIZE
    img = Image.fromarray(orig_np.astype(np.uint8)).convert("RGBA")

    cls_rgb = CLASS_COLORS.get(pred_class, (100, 116, 139))
    sev_rgb = SEV_COLORS.get(severity, (100, 116, 139))
    short   = CLASS_SHORT.get(pred_class, "?")
    conf_s  = f"{confidence:.0f}%"

    # ── vignette overlay ─────────────────────────────────────────────────────
    vig = Image.new("RGBA", (W, H), (0,0,0,0))
    vig_draw = ImageDraw.Draw(vig)
    # radial vignette via concentric ellipses
    steps = 18
    for i in range(steps, 0, -1):
        r_x = int(W * 0.5 * i / steps)
        r_y = int(H * 0.5 * i / steps)
        alpha = int(90 * (1 - i / steps) ** 2)
        vig_draw.ellipse(
            [W//2 - r_x, H//2 - r_y, W//2 + r_x, H//2 + r_y],
            fill=(0, 0, 0, alpha)
        )
    img = Image.alpha_composite(img, vig)

    # ── circle badge ─────────────────────────────────────────────────────────
    cx, cy, R = W//2, H//2, 52
    badge = Image.new("RGBA", (W, H), (0,0,0,0))
    bd    = ImageDraw.Draw(badge)

    # Outer glow rings
    for offset, a in [(14, 15), (10, 28), (6, 50), (3, 70)]:
        bd.ellipse(
            [cx-R-offset, cy-R-offset, cx+R+offset, cy+R+offset],
            outline=(*cls_rgb, a), width=2
        )

    # Circle fill (semi-transparent dark + class tint)
    fill_clr = tuple(int(c * 0.35) for c in cls_rgb)  # darker tint
    bd.ellipse(
        [cx-R, cy-R, cx+R, cy+R],
        fill=(*fill_clr, 210),
        outline=(*cls_rgb, 255), width=3
    )

    img = Image.alpha_composite(img, badge)
    img = img.convert("RGB")

    # ── text inside badge ─────────────────────────────────────────────────────
    draw = ImageDraw.Draw(img)
    font_lg = _get_font(26)
    font_sm = _get_font(12)

    # Class short name
    try:
        bb = draw.textbbox((0,0), short, font=font_lg)
        tw, th = bb[2]-bb[0], bb[3]-bb[1]
    except Exception:
        tw, th = len(short)*14, 20
    draw.text((cx - tw//2, cy - th//2 - 7), short,
              fill=(255, 255, 255), font=font_lg)

    # Divider line
    lw = R - 10
    draw.line([(cx - lw, cy + th//2 - 3), (cx + lw, cy + th//2 - 3)],
              fill=(*cls_rgb, 160), width=1)

    # Confidence
    try:
        bb2 = draw.textbbox((0,0), conf_s, font=font_sm)
        tw2 = bb2[2]-bb2[0]
    except Exception:
        tw2 = len(conf_s)*7
    draw.text((cx - tw2//2, cy + th//2 + 1), conf_s,
              fill=(220, 220, 220), font=font_sm)

    # ── severity dot — top-right ──────────────────────────────────────────────
    dot_r = 9
    dx, dy = W - 18, 12
    draw.ellipse(
        [dx - dot_r, dy - dot_r, dx + dot_r, dy + dot_r],
        fill=sev_rgb, outline=(255,255,255), width=2
    )

    # ── thin colored frame ────────────────────────────────────────────────────
    frame = ImageDraw.Draw(img)
    frame.rectangle([0, 0, W-1, H-1], outline=cls_rgb, width=3)

    return img


def generate_visualizations(
    orig_np   : np.ndarray,
    heatmap_np: np.ndarray,
    pred_class: str,
    confidence: float,
    severity  : str,
) -> dict:
    """Generate all 3 panels, return as base64 JPEG dict."""
    raw_pil    = Image.fromarray(orig_np.astype(np.uint8)).convert("RGB")
    hm_pil     = make_heatmap_overlay(orig_np, heatmap_np)
    result_pil = make_result_card(orig_np, pred_class, confidence, severity)
    return {
        "raw"            : _pil_to_b64(raw_pil),
        "heatmap_overlay": _pil_to_b64(hm_pil),
        "result_card"    : _pil_to_b64(result_pil),
    }


# ── Inference ─────────────────────────────────────────────────────────────────
def preprocess_image(image_bytes: bytes) -> tf.Tensor:
    img = tf.image.decode_image(image_bytes, channels=3, expand_animations=False)
    img = tf.image.resize(img, [IMG_SIZE, IMG_SIZE])
    return tf.cast(img, tf.float32)


def compute_severity(heatmap, pred_class, site=None, threshold=0.5):
    area_pct   = float((heatmap >= threshold).sum()) / float(heatmap.size)
    mal_score  = MALIGNANCY_SCORE.get(pred_class, 0.5)
    site_score = float(np.clip(
        SITE_RISK_SCORE.get(site.lower(), 0.5) if site else 0.5, 0, 1))
    combined   = 0.50*area_pct + 0.30*mal_score + 0.20*site_score
    area_label = next(
        (l for l,(lo,hi) in SEVERITY_THRESHOLDS.items() if lo<=area_pct<hi), "Severe")
    return {
        "area_pct": round(area_pct*100, 2), "area_label": area_label,
        "malignancy": round(mal_score, 2),  "site_risk": round(site_score, 2),
        "combined_score": round(combined, 3),
        "severity_label": "Severe" if combined>0.50 else
                          "Moderate" if combined>0.25 else "Mild",
    }


def run_inference(image_bytes: bytes, anatomical_site=None, top_k=3) -> dict:
    img      = preprocess_image(image_bytes)
    inp      = tf.expand_dims(img, 0)
    probs    = ensemble_model(inp, training=False).numpy()[0]
    top_idxs = np.argsort(probs)[::-1][:top_k]
    pred_idx = int(top_idxs[0])
    pred_nm  = idx2label[pred_idx]

    # GradCAM
    hm   = gradcam.compute(inp, pred_idx)
    hm_r = np.array(
        tf.image.resize(hm[..., np.newaxis], [IMG_SIZE, IMG_SIZE])
    )[..., 0].astype(np.float32)

    sev      = compute_severity(hm_r, pred_nm, site=anatomical_site)
    orig_np  = img.numpy()                          # (224,224,3) float32

    # Generate visualizations
    vis = generate_visualizations(
        orig_np, hm_r, pred_nm,
        float(probs[pred_idx]) * 100,
        sev["severity_label"]
    )

    return {
        "predicted_class" : pred_nm,
        "confidence"      : round(float(probs[pred_idx])*100, 2),
        "severity_label"  : sev["severity_label"],
        "combined_score"  : sev["combined_score"],
        "area_pct"        : sev["area_pct"],
        "malignancy_score": sev["malignancy"],
        "site_risk_score" : sev["site_risk"],
        "top_predictions" : [
            {"rank": i+1, "class": idx2label[int(idx)],
             "probability": round(float(probs[idx])*100, 2)}
            for i, idx in enumerate(top_idxs)
        ],
        "severity_detail" : {
            "label"   : sev["severity_label"],
            "score"   : sev["combined_score"],
            "formula" : "50% GradCAM area + 30% malignancy + 20% site risk",
            "breakdown": {
                "gradcam_area_pct": sev["area_pct"],
                "malignancy"      : sev["malignancy"],
                "site_risk"       : sev["site_risk"],
            },
        },
        "images": vis,   # ← base64 dict: raw / heatmap_overlay / result_card
    }


# ══════════════════════════════════════════════════════════════════════════════
#  GROQ
# ══════════════════════════════════════════════════════════════════════════════
def generate_groq_analysis(inference_result, anatomical_site=None):
    if groq_client is None:
        return {"available": False,
                "text": "Fitur analisis AI belum aktif. Set GROQ_API_KEY di .env",
                "model": None}

    pred_class   = inference_result["predicted_class"]
    confidence   = inference_result["confidence"]
    severity     = inference_result["severity_label"]
    top_preds    = inference_result["top_predictions"]
    display_name = CLASS_DISPLAY_NAME.get(pred_class, pred_class)
    brief        = CLASS_BRIEF.get(pred_class, "")
    site_info    = anatomical_site or "tidak disebutkan"

    top2 = top_preds[1] if len(top_preds) > 1 else None
    uncertainty_note = ""
    if confidence < 60 and top2:
        top2_name = CLASS_DISPLAY_NAME.get(top2["class"], top2["class"])
        uncertainty_note = (
            f"PENTING: Selisih prediksi sangat tipis antara {display_name} "
            f"({confidence:.0f}%) dan {top2_name} ({top2['probability']:.0f}%). "
            f"Ini artinya gambar cukup ambigu — wajib periksa ke dokter."
        )

    severity_indo = {"Mild":"Ringan","Moderate":"Sedang","Severe":"Berat"}.get(severity, severity)

    prompt = f"""Kamu adalah asisten kesehatan digital DermaSight. Tugasmu menjelaskan hasil analisis gambar kulit kepada pengguna awam yang tidak punya latar belakang medis. Gunakan bahasa sehari-hari yang hangat, mudah dimengerti, dan tidak menakut-nakuti.

DATA:
- Terdeteksi sebagai: {display_name} — {brief}
- Keyakinan AI: {confidence:.0f}%
- Tingkat keparahan: {severity_indo}
- Lokasi di tubuh: {site_info}
{uncertainty_note}

ATURAN PENULISAN (wajib diikuti):
- Maksimal 3 kalimat per bagian
- Bahasa sehari-hari, hangat, seperti teman yang menjelaskan
- JANGAN pakai simbol * atau # atau markdown apapun
- JANGAN pakai istilah latin tanpa penjelasan langsung
- Singkat, padat, jelas

Tulis tepat 3 bagian berikut:

Ini apa?
[Jelaskan kondisi ini dalam 2-3 kalimat sederhana.]

Apa artinya buat saya?
[Jelaskan apa yang perlu diketahui. Sebutkan jika ada yang perlu diwaspadai atau tidak perlu khawatir berlebihan.]

Apa yang harus saya lakukan?
[2-3 langkah konkret dan praktis. Sebutkan kapan perlu ke dokter dan dokter apa.]

Tutup dengan 1 kalimat pengingat singkat bahwa ini alat bantu AI, bukan pengganti dokter."""

    try:
        resp = groq_client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.45,
            max_tokens=550,
        )
        return {"available": True, "text": resp.choices[0].message.content, "model": GROQ_MODEL}
    except Exception as e:
        return {"available": False, "text": f"Gagal: {str(e)}", "model": GROQ_MODEL}


# ── FastAPI ───────────────────────────────────────────────────────────────────
app = FastAPI(
    title="DermaSight API",
    description="Skin lesion classification — EfficientNetV2S + DenseNet201 + GradCAM",
    version="3.1.0",
    docs_url="/docs", redoc_url="/redoc",
)
app.add_middleware(CORSMiddleware, allow_origins=["*"],
                   allow_credentials=True, allow_methods=["*"], allow_headers=["*"])


class HealthResponse(BaseModel):
    status: str; version: str; models: List[str]
    groq_enabled: bool; groq_model: Optional[str]

class GroqAnalysis(BaseModel):
    available: bool; text: str; model: Optional[str]

class PredictionResponse(BaseModel):
    predicted_class: str; confidence: float
    severity_label: str; combined_score: float
    area_pct: float; malignancy_score: float; site_risk_score: float
    top_predictions: List[Dict[str, Any]]
    severity_detail: Dict[str, Any]
    inference_time_ms: float
    images: Optional[Dict[str, str]] = None
    groq_analysis: Optional[GroqAnalysis] = None


@app.get("/", response_model=HealthResponse, tags=["Health"])
def health_check():
    return {"status":"ok","version":"3.1.0",
            "models":[ensemble_model.name, effnet_model.name],
            "groq_enabled": groq_client is not None,
            "groq_model": GROQ_MODEL if groq_client else None}


@app.get("/info", tags=["Info"])
def model_info():
    return {"model_name":"DermaSight Ensemble","version":"3.1.0",
            "accuracy":"85.49%","classes":CLASS_NAMES,
            "groq_enabled": groq_client is not None,
            "groq_model": GROQ_MODEL if groq_client else None}


@app.post("/predict", response_model=PredictionResponse, tags=["Inference"])
async def predict(
    file            : UploadFile = File(...),
    anatomical_site : Optional[str] = None,
    include_analysis: bool = Query(default=False),
):
    if file.content_type not in ["image/jpeg","image/png","image/jpg"]:
        raise HTTPException(422, f"Format tidak didukung: {file.content_type}.")
    image_bytes = await file.read()
    if len(image_bytes) > 10*1024*1024:
        raise HTTPException(413, "Maks 10MB.")
    try:
        t0     = time.perf_counter()
        result = run_inference(image_bytes, anatomical_site=anatomical_site)
        result["inference_time_ms"] = round((time.perf_counter()-t0)*1000, 1)
        if include_analysis:
            result["groq_analysis"] = generate_groq_analysis(result, anatomical_site)
        return result
    except Exception as e:
        raise HTTPException(500, f"Inference error: {str(e)}")


@app.post("/analyze", response_model=PredictionResponse, tags=["AI Analysis"])
async def analyze(
    file           : UploadFile = File(...),
    anatomical_site: Optional[str] = None,
):
    if file.content_type not in ["image/jpeg","image/png","image/jpg"]:
        raise HTTPException(422, f"Format tidak didukung: {file.content_type}.")
    image_bytes = await file.read()
    if len(image_bytes) > 10*1024*1024:
        raise HTTPException(413, "Maks 10MB.")
    try:
        t0     = time.perf_counter()
        result = run_inference(image_bytes, anatomical_site=anatomical_site)
        result["inference_time_ms"] = round((time.perf_counter()-t0)*1000, 1)
        result["groq_analysis"]     = generate_groq_analysis(result, anatomical_site)
        return result
    except Exception as e:
        raise HTTPException(500, f"Analyze error: {str(e)}")


@app.post("/predict/batch", tags=["Inference"])
async def predict_batch(
    files          : list[UploadFile] = File(...),
    anatomical_site: Optional[str]    = None,
):
    if len(files) > 10:
        raise HTTPException(422, "Maks 10 gambar.")
    results = []
    for i, file in enumerate(files):
        if file.content_type not in ["image/jpeg","image/png","image/jpg"]:
            results.append({"index":i,"file":file.filename,"error":"Format tidak didukung"}); continue
        try:
            image_bytes = await file.read()
            t0 = time.perf_counter()
            result = run_inference(image_bytes, anatomical_site=anatomical_site)
            result["inference_time_ms"] = round((time.perf_counter()-t0)*1000, 1)
            results.append({"index":i,"file":file.filename,**result})
        except Exception as e:
            results.append({"index":i,"file":file.filename,"error":str(e)})
    return {"total":len(files),"results":results}
