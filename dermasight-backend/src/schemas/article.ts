import { z } from "zod";

const parseTags = (val: unknown): unknown => {
    if (typeof val === "string") {
        try {
            return JSON.parse(val);
        } catch {
            return val.split(",").map((t) => t.trim()).filter(Boolean);
        }
    }
    return val;
};

export const createArticleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    tags: z.preprocess(parseTags, z.array(z.string().min(1)).min(1, "At least one tag is required")),
    content: z.string().min(1, "Content is required"),
    timeToRead: z.coerce.number().int().positive("Time to read must be a positive number"),
    authorName: z.string().min(1, "Author name is required"),
    authorTitle: z.string().optional()
});

export const updateArticleSchema = createArticleSchema.partial();
