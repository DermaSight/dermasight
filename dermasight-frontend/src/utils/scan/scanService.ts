import { useAuth } from "@/utils/auth-context/AuthContext";

export interface ScanPredictionData {
	id?: string;
	userId?: string;
	predicted_class: "Basal_Cell_Carcinoma" | "Melanocytic_Nevi" | "Melanoma";
	severity_label: "Mild" | "Moderate" | "Severe";
	confidence: number;
	combined_score: number;
	malignancy_score: number;
	site_risk_score: number;
	area_pct: number;
	inference_time_ms: number;
	anatomical_site: string;
	imageUrl: string;
	storedInHistory?: boolean;
	groq_analysis: {
		available: boolean;
		text: string;
		model: string;
	};
	createdAt?: string;
	updatedAt?: string;
}

export interface ScanPredictionResponse {
	status: string;
	message: string;
	data: ScanPredictionData;
}

export interface LivePredictionResult {
	id: string;
	name: string;
	confidence: number;
	severityScore: number;
	severityLabel: "Mild" | "Moderate" | "Severe";
	description: string;
	imageUrl: string;
	asymmetryScore: number;
	borderIrregularity: number;
	dateAnalyzed: string;
	createdAt?: string;
	// Rich API metadata and performance parameters
	areaPct: number;
	inferenceTimeMs: number;
	anatomicalSite: string;
	groqModel: string;
	whatMeansForMe?: string;
	whatShouldIDo?: string;
	disclaimerText?: string;
	// Compatible with SkinCondition interface using standard clean fallbacks
	scientificName: string;
	symptoms: string[];
	triggers: string[];
	firstAid: string[];
	actionPlan: string;
	size: string;
	colors: { label: string; percentage: number; colorHex: string }[];
}

export function useScanService() {
	const { accessToken } = useAuth();

	const scanImage = async (
		croppedImageBase64: string,
		anatomicalSite: string,
	): Promise<ScanPredictionResponse> => {
		const responseBlob = await fetch(croppedImageBase64);
		const blob = await responseBlob.blob();
		const file = new File([blob], "lesion.jpg", {
			type: blob.type || "image/jpeg",
		});

		const formData = new FormData();
		formData.append("file", file);
		formData.append("anatomical_site", anatomicalSite);

		const headers: Record<string, string> = {};
		if (accessToken) {
			headers.Authorization = `Bearer ${accessToken}`;
		}

		const apiUrl = import.meta.env.VITE_API_URL || "";
		const response = await fetch(`${apiUrl}/predict`, {
			method: "POST",
			headers,
			body: formData,
		});

		if (!response.ok) {
			const errData = await response.json().catch(() => ({}));
			throw new Error(
				errData.message || `Scan failed with status ${response.status}`,
			);
		}

		const result: ScanPredictionResponse = await response.json();
		return result;
	};

	return { scanImage };
}

export function mapPredictResponseToSkinCondition(
	apiData: ScanPredictionData,
): LivePredictionResult {
	const analysisText = apiData.groq_analysis?.text || "";

	// Parse sections from Llama contextual response text
	const sections = analysisText.split("\n\n");
	let description = "";
	let whatMeansForMe = "";
	let whatShouldIDo = "";
	let disclaimerText = "";

	for (const sec of sections) {
		const cleanSec = sec.trim();
		if (cleanSec.startsWith("Ini apa?")) {
			description = cleanSec.replace("Ini apa?\n", "").trim();
		} else if (cleanSec.startsWith("Apa artinya buat saya?")) {
			whatMeansForMe = cleanSec.replace("Apa artinya buat saya?\n", "").trim();
		} else if (cleanSec.startsWith("Apa yang harus saya lakukan?")) {
			whatShouldIDo = cleanSec
				.replace("Apa yang harus saya lakukan?\n", "")
				.trim();
		} else if (cleanSec.startsWith("Ingat,")) {
			disclaimerText = cleanSec;
		}
	}

	// Fallback in case formatting varies
	if (!description) {
		description = analysisText;
	}

	return {
		id: apiData.id || `scan-${Date.now()}`,
		name: apiData.predicted_class,
		confidence: apiData.confidence,
		severityScore: Math.round(apiData.combined_score * 100),
		severityLabel: apiData.severity_label,
		description: description,
		imageUrl: apiData.imageUrl,
		asymmetryScore: Math.round(apiData.malignancy_score * 100),
		borderIrregularity: Math.round(apiData.site_risk_score * 100),
		dateAnalyzed: apiData.createdAt
			? new Date(apiData.createdAt).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})
			: new Date().toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				}),
		createdAt: apiData.createdAt,
		areaPct: apiData.area_pct,
		inferenceTimeMs: apiData.inference_time_ms,
		anatomicalSite: apiData.anatomical_site,
		groqModel: apiData.groq_analysis?.model || "llama-3.3-70b-versatile",
		whatMeansForMe: whatMeansForMe || undefined,
		whatShouldIDo: whatShouldIDo || undefined,
		disclaimerText: disclaimerText || undefined,
		// Mandatory SkinCondition compatibility fields with clean empty fallbacks
		scientificName: apiData.predicted_class.replace(/_/g, " "),
		symptoms: [],
		triggers: [],
		firstAid: [],
		actionPlan: whatShouldIDo || "Consult a specialist for proper diagnosis.",
		size: "",
		colors: [],
	};
}
