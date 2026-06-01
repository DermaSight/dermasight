import { Router } from "express";
import healthRouter from "@/routes/health";
import authRouter from "@/routes/auth";
import articleRouter from "@/routes/article";
import predictionRouter from "@/routes/prediction";
import contactRouter from "@/routes/contact";
import docsRouter from "@/routes/docs";

const router = Router();

router.use("/health", healthRouter);
router.use("/auth", authRouter);
router.use("/articles", articleRouter);
router.use("/predict", predictionRouter);
router.use("/contact-us", contactRouter);

if (process.env.ENVIRONMENT !== "production") {
    router.use("/docs", docsRouter);
}

export default router;
