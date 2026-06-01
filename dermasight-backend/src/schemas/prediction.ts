import { z } from "zod";

export const anatomicalSites = [
    "head/neck",
    "torso",
    "upper extremity",
    "lower extremity",
    "palms/soles",
    "oral/genital",
    "anterior torso",
    "posterior torso",
    "lateral torso"
] as const;

export const createPredictionSchema = z.object({
    anatomical_site: z.enum(anatomicalSites, {
        message: `Invalid anatomical_site. Must be one of: ${anatomicalSites.join(", ")}`
    })
});

export const historyQuerySchema = z.object({
    limit: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : 10))
        .pipe(z.number().int().min(1).max(100))
        .default(10),
    offset: z
        .string()
        .optional()
        .transform((val) => (val ? Number(val) : 0))
        .pipe(z.number().int().min(0))
        .default(0)
});

export type CreatePredictionInput = z.infer<typeof createPredictionSchema>;
export type HistoryQueryInput = z.infer<typeof historyQuerySchema>;
