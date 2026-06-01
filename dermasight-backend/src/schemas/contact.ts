import { z } from "zod";

export const contactSchema = z.object({
    subject: z.string().min(1, "Subject is required"),
    content: z.string().min(1, "Content is required")
});
