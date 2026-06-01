import { Router } from "express";
import ArticleController from "@/controllers/Article";
import validate from "@/middlewares/validate";
import { createArticleSchema, updateArticleSchema } from "@/schemas/article";
import requireAuth, { requireRole } from "@/middlewares/auth";
import uploadFile from "@/middlewares/upload";

const articleRouter = Router();

const adminUpload = [requireAuth, requireRole("ADMIN"), uploadFile(["image", "authorImage"])] as const;

articleRouter.get("/", ArticleController.list);
articleRouter.get("/:slug", ArticleController.get);
articleRouter.post(
    "/",
    ...adminUpload,
    validate(createArticleSchema, "body"),
    ArticleController.create
);
articleRouter.put(
    "/:slug",
    ...adminUpload,
    validate(updateArticleSchema, "body"),
    ArticleController.update
);
articleRouter.delete(
    "/:slug",
    requireAuth,
    requireRole("ADMIN"),
    ArticleController.remove
);

export default articleRouter;
