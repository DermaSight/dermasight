import { Request, Response } from "express";
import fResponse from "@/utils/responseFormatter";
import { formatErr } from "@/utils/format";
import { uploadFileToBucket, getPresignedUrl, signField } from "@/lib/s3";
import modelApi from "@/lib/modelApi";
import PredictionModel from "@/models/Prediction";
import { MLServiceError, BadRequestError, UnauthorizedError } from "@/utils/customErrors";
import type { MLApiResponse } from "@/types/modelApi";
import type { Prisma } from "@/prisma/client";

const signPrediction = async (prediction: { imageUrl: string }): Promise<void> => {
    await signField(prediction as Record<string, string | null | undefined>, "imageUrl");
};

const PredictionController = {
    predict: async (req: Request, res: Response) => {
        // Validate file exists
        if (!req.file) {
            throw new BadRequestError("Image file is required");
        }

        const { anatomical_site } = req.body;

        // Upload file to R2
        let imageKey: string;
        try {
            const { key } = await uploadFileToBucket(req.file);
            imageKey = key;
        } catch (error) {
            throw new BadRequestError(
                `Failed to upload image: ${formatErr(error, "Unknown error")}`
            );
        }

        // Generate presigned URL for the response
        let imageUrl: string;
        try {
            imageUrl = await getPresignedUrl(imageKey);
        } catch {
            imageUrl = imageKey;
        }

        // Call ML Model API
        let mlResponse: MLApiResponse;
        try {
            const formData = new FormData();
            formData.append(
                "file",
                new Blob([req.file.buffer], { type: req.file.mimetype }),
                req.file.originalname
            );
            formData.append("anatomical_site", anatomical_site);

            const response = await modelApi.post("/predict?include_analysis=true", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            mlResponse = response.data;
        } catch (error) {
            if (error instanceof Error && "isAxiosError" in error) {
                const axiosError = error as any;
                if (axiosError.code === "ECONNABORTED") {
                    throw new MLServiceError("ML Service request timeout");
                }
                if (axiosError.response?.status && axiosError.response.status >= 500) {
                    throw new MLServiceError("ML Service returned an error");
                }
                throw new MLServiceError(`ML Service error: ${axiosError.message}`);
            }
            throw new MLServiceError("Failed to connect to ML Service");
        }

        // Extract 8 key fields from ML response
        const predictionData = {
            userId: req.user?.sub ?? null,
            imageUrl: imageKey,
            predicted_class: mlResponse.predicted_class,
            severity_label: mlResponse.severity_label,
            confidence: mlResponse.confidence,
            combined_score: mlResponse.combined_score,
            malignancy_score: mlResponse.malignancy_score,
            site_risk_score: mlResponse.site_risk_score,
            area_pct: mlResponse.area_pct,
            inference_time_ms: mlResponse.inference_time_ms,
            groq_analysis: mlResponse.groq_analysis as Prisma.InputJsonValue | undefined,
            anatomical_site
        };

        // Store in DB if authenticated
        if (req.user) {
            await PredictionModel.create(predictionData);
        }

        // Build response data
        const responseData: Record<string, unknown> = {
            ...mlResponse,
            anatomical_site,
            imageUrl,
            storedInHistory: !!req.user
        };

        if (mlResponse.groq_analysis?.available) {
            responseData.groq_analysis = mlResponse.groq_analysis;
        }

        // Return response
        return fResponse({
            res,
            code: 200,
            message: "Prediction completed",
            data: responseData
        });
    },

    getHistory: async (req: Request, res: Response) => {
        // Check authentication
        if (!req.user) {
            throw new UnauthorizedError("Must be authenticated to view prediction history");
        }

        const { limit, offset } = req.query as unknown as { limit: number; offset: number };

        // Fetch predictions from DB
        const predictions = await PredictionModel.findByUserId(req.user.sub, limit, offset);
        const total = await PredictionModel.countByUserId(req.user.sub);

        // Sign stored image keys with presigned URLs
        await Promise.all(predictions.map(signPrediction));

        // Return paginated response
        return fResponse({
            res,
            code: 200,
            message: "Prediction history retrieved",
            data: {
                predictions,
                pagination: {
                    total,
                    limit,
                    offset,
                    hasMore: offset + limit < total
                }
            }
        });
    }
};

export default PredictionController;
