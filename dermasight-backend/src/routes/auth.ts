import { Router } from "express";
import AuthController from "@/controllers/Auth";
import validate from "@/middlewares/validate";
import { registerSchema, loginSchema } from "@/schemas/auth";
import requireAuth from "@/middlewares/auth";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema, "body"), AuthController.register);
authRouter.post("/login", validate(loginSchema, "body"), AuthController.login);
authRouter.post("/refresh", AuthController.refresh);
authRouter.post("/logout", AuthController.logout);
authRouter.get("/me", requireAuth, AuthController.me);

export default authRouter;
