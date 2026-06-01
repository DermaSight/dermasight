export interface MLApiPrediction {
    predicted_class: string;
    severity_label: string;
    confidence: number;
    combined_score: number;
    malignancy_score: number;
    site_risk_score: number;
    area_pct: number;
    inference_time_ms: number;
}

export interface MLApiAnalysis {
    available: boolean;
    text: string;
    model: string;
}

export interface MLApiResponse extends MLApiPrediction {
    groq_analysis?: MLApiAnalysis;
}
