import { Router } from "express";
import HealthController from "@/controllers/Health";

const healthRouter = Router();

healthRouter.get("/", HealthController.check);

export default healthRouter;
