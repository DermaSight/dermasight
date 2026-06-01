import { Router } from "express";
import PredictionController from "@/controllers/Prediction";
import uploadFile from "@/middlewares/upload";
import { optionalAuth } from "@/middlewares/auth";
import requireAuth from "@/middlewares/auth";
import validate from "@/middlewares/validate";
import { createPredictionSchema, historyQuerySchema } from "@/schemas/prediction";

const predictionRouter = Router();

// POST /predict - Public with optional auth
predictionRouter.post(
    "/",
    uploadFile("file"),
    optionalAuth,
    validate(createPredictionSchema, "body"),
    PredictionController.predict
);

// GET /history - Authenticated only
predictionRouter.get(
    "/history",
    requireAuth,
    validate(historyQuerySchema, "query"),
    PredictionController.getHistory
);

export default predictionRouter;
