
# 🔬 DermaSight

> **Sistem Klasifikasi & Penilaian Keparahan Lesi Kulit Dermoskopik**
> Menggunakan Transfer Learning (EfficientNetV2S + DenseNet201 Ensemble) + GradCAM Severity Scoring

---

## 📊 Performa Model

| Model                      | Test Accuracy    | Keterangan                           |
| -------------------------- | ---------------- | ------------------------------------ |
| EfficientNetV2S            | 82.58%           | Best individual model                |
| DenseNet201                | 78.78%           | Secondary model                      |
| **Ensemble (60/40)** | **85.49%** | **Model yang digunakan**       |
| MAE Severity               | 0.29             | Mean Absolute Error severity scoring |

---

## 📁 Struktur File

```
dermasight-api/
├── .env                      
├── .env.example          
├── Dockerfile
├── main.py             
├── requirements.txt
└── exports/
    ├── saved_model/
    │   ├── assets/
    │   ├── variables/
    │   ├── keras_metadata.pb
    │   └── saved_model.pb
    ├── dermasight_v3_efficientnetv2s.keras
    ├── dermasight_v3_ensemble.keras
    ├── class_names.json
    ├── label2idx.json
    └── malignancy_config.json
DermaSight.ipynb
```

[File Exports (Google Drive)](https://drive.google.com/drive/folders/1azi6Va4QpMxBksO-p6PyGZ7WklGqT78Y?usp=sharing)

[API ZIP](https://drive.google.com/file/d/1DyL--8U1WHRO9qdIvkFGRaH7qaGb7chm/view?usp=sharing)

---

## 🐳 Docker Deployment (Recommended)

### Pull & Run via GHCR

```bash
docker pull ghcr.io/dermasight/dermasight:latest
docker run -p 8000:8000 --env GROQ_API_KEY=your_key ghcr.io/dermasight/dermasight:latest
```

### Environment Variables

Buat file `.env` di root project (lihat `.env.example`):

```
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

> 🔑 Dapatkan Groq API key di: https://console.groq.com/keys

### API Endpoints

| Method | Endpoint           | Fungsi               |
| ------ | ------------------ | -------------------- |
| GET    | `/`              | Health Check         |
| GET    | `/info`          | Model Info           |
| POST   | `/predict`       | Single Image Predict |
| POST   | `/predict/batch` | Batch Predict        |
| POST   | `/analyze`       | AI Analysis (Groq)   |

Dokumentasi lengkap (Swagger UI): `http://localhost:8000/docs`

### Build dari Source (Alternatif)

```bash
git clone https://github.com/DermaSight/dermasight-research-model-2.git
cd dermasight-research-model-2
cp dermasight-api/.env.example dermasight-api/.env   # isi GROQ_API_KEY
docker build -f dermasight-api/Dockerfile -t dermasight .
docker run -p 8000:8000 --env-file dermasight-api/.env dermasight
```

---

## 📄 Penjelasan Per File

### `saved_model/`

**Digunakan oleh:** Backend Python (FastAPI, Flask, Streamlit)
**Fungsi:** Format SavedModel TensorFlow standar untuk deployment server-side. Berisi arsitektur + weights + computation graph dalam satu folder.
**Cara pakai:**

```python
import tensorflow as tf
model = tf.saved_model.load('exports/saved_model')
# atau
model = tf.keras.models.load_model('exports/saved_model')
```

**Isi folder:**

* `saved_model.pb` — computation graph
* `variables/` — weights model
* `assets/` — file aset tambahan (kosong)
* `keras_metadata.pb` — metadata Keras

---

### `dermasight_v3_efficientnetv2s.keras`

**Digunakan oleh:** Backend Python
**Fungsi:** Model EfficientNetV2S individual dengan akurasi 82.58%. Digunakan sebagai salah satu komponen ensemble.
**Cara pakai:**

```python
import tensorflow as tf
model = tf.keras.models.load_model('exports/dermasight_v3_efficientnetv2s.keras')
```

---

### `dermasight_v3_ensemble.keras`

**Digunakan oleh:** Backend Python
**Fungsi:** Model Ensemble (EfficientNetV2S 60% + DenseNet201 40%) dengan akurasi 85.49%. **Model utama yang digunakan untuk inference.**
**Cara pakai:**

```python
import tensorflow as tf
model = tf.keras.models.load_model('exports/dermasight_v3_ensemble.keras')
```

---

### `class_names.json`

**Digunakan oleh:** Backend + Frontend
**Fungsi:** Daftar nama kelas output model beserta urutannya. **Wajib digunakan** untuk menginterpretasi output model — jangan hardcode nama kelas di kode.
**Isi:**

```json
["Basal_Cell_Carcinoma", "Melanocytic_Nevi", "Melanoma"]
```

**Urutan index:**

| Index | Kelas                | Keterangan                     |
| ----- | -------------------- | ------------------------------ |
| 0     | Basal_Cell_Carcinoma | BCC — Karsinoma Sel Basal     |
| 1     | Melanocytic_Nevi     | NV — Tahi Lalat (Jinak)       |
| 2     | Melanoma             | MEL — Melanoma (Sangat Ganas) |

---

### `label2idx.json`

**Digunakan oleh:** Backend + Frontend
**Fungsi:** Mapping dari nama kelas ke index angka. Kebalikan dari `class_names.json`. Berguna untuk encoding label saat validasi atau logging.
**Isi:**

```json
{
  "Basal_Cell_Carcinoma": 0,
  "Melanocytic_Nevi": 1,
  "Melanoma": 2
}
```

---

### `malignancy_config.json`

**Digunakan oleh:** Backend (untuk severity scoring)
**Fungsi:** Konfigurasi lengkap sistem penilaian keparahan lesi. Berisi:

* `malignancy_score` — skor keganasan per kelas (0.0–1.0)
* `severity_thresholds` — batas kategori severity
* `gradcam_layers` — nama conv layer untuk GradCAM per model
* `img_size` — ukuran input gambar (224)
* `severity_formula` — bobot formula severity scoring

**Isi:**

```json
{
  "malignancy_score": {
    "Basal_Cell_Carcinoma": 0.7,
    "Melanocytic_Nevi": 0.1,
    "Melanoma": 0.9
  },
  "severity_thresholds": {
    "Mild":     [0.00, 0.15],
    "Moderate": [0.15, 0.40],
    "Severe":   [0.40, 1.00]
  },
  "severity_formula": {
    "gradcam_area": 0.50,
    "malignancy":   0.30,
    "site_risk":    0.20
  },
  "img_size": 224
}
```

---

## ⚡ Panduan Integrasi Cepat

### Input Model

```
Format    : JPG / PNG / JPEG
Ukuran    : Resize ke 224 × 224 pixels
Range     : [0, 255] — JANGAN dinormalisasi ke [0,1]
Channels  : RGB (3 channel)
```

> ⚠️ **Penting:** Model sudah memiliki preprocessing layer internal (`include_preprocessing=True`). Tim frontend/backend **tidak perlu** melakukan normalisasi manual. Cukup resize gambar ke 224×224 dan kirim langsung.

### Output Model

```
Shape  : (1, 3) — array 3 nilai probabilitas
Sum    : selalu = 1.0 (softmax)
Index  : [BCC, NV, MEL] — sesuai class_names.json
```

**Contoh output:**

```python
[0.05, 0.12, 0.83]
#  BCC   NV   MEL  ← Melanoma dengan confidence 83%
```

### Cara Interpret Output

```python
import json, numpy as np

with open('exports/class_names.json') as f:
    class_names = json.load(f)

# output dari model.predict()
probs      = [0.05, 0.12, 0.83]
pred_idx   = np.argmax(probs)          # → 2
pred_class = class_names[pred_idx]     # → "Melanoma"
confidence = probs[pred_idx] * 100     # → 83.0%
```

---

## 🎯 Severity Scoring

Severity dihitung di backend (bukan dari model langsung) menggunakan formula:

```
Combined Score = (0.50 × GradCAM_area)
               + (0.30 × malignancy_score[predicted_class])
               + (0.20 × site_risk_score)

Mild     : Combined Score ≤ 0.25  → warna hijau
Moderate : 0.25 < score ≤ 0.50   → warna oranye
Severe   : Combined Score > 0.50  → warna merah
```

**Nilai malignancy per kelas** (dari `malignancy_config.json`):

* `Melanocytic_Nevi` → 0.1 (jinak)
* `Basal_Cell_Carcinoma` → 0.7 (ganas)
* `Melanoma` → 0.9 (sangat ganas)

---

## 🔧 Rekomendasi Stack

| Use Case                 | Format yang Digunakan                    |
| ------------------------ | ---------------------------------------- |
| FastAPI / Flask (server) | `saved_model/`atau `.keras`          |
| Streamlit                | `saved_model/`atau `.keras`          |
| Docker (semua platform)  | `ghcr.io/dermasight/dermasight:latest` |
