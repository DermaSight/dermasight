import { z } from "zod";

export const registerSchema = z.object({
    email: z.email("Valid email is required"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(1).optional()
}).refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"]
});

export const loginSchema = z.object({
    email: z.email("Valid email is required"),
    password: z.string().min(1, "Password is required")
});
