import prisma from "@/lib/prisma";
import type { Prisma } from "@/prisma/client";

const predictionSelect = {
    id: true,
    userId: true,
    imageUrl: true,
    predicted_class: true,
    severity_label: true,
    confidence: true,
    combined_score: true,
    malignancy_score: true,
    site_risk_score: true,
    area_pct: true,
    inference_time_ms: true,
    groq_analysis: true,
    anatomical_site: true,
    createdAt: true,
    updatedAt: true
} as const;

const PredictionModel = {
    create: (data: {
        userId?: string | null;
        imageUrl: string;
        predicted_class: string;
        severity_label: string;
        confidence: number;
        combined_score: number;
        malignancy_score: number;
        site_risk_score: number;
        area_pct: number;
        inference_time_ms: number;
        groq_analysis?: Prisma.InputJsonValue;
        anatomical_site: string;
    }) => {
        const { userId, ...rest } = data;
        return prisma.prediction.create({
            data: {
                ...rest,
                ...(userId ? { user: { connect: { id: userId } } } : {})
            },
            select: predictionSelect
        });
    },

    findByUserId: (userId: string, limit: number, offset: number) =>
        prisma.prediction.findMany({
            where: { userId },
            select: predictionSelect,
            orderBy: { createdAt: "desc" },
            take: limit,
            skip: offset
        }),

    countByUserId: (userId: string) => prisma.prediction.count({ where: { userId } })
};

export default PredictionModel;
