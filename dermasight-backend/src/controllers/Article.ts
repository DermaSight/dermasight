import { Request, Response } from "express";
import fResponse from "@/utils/responseFormatter";
import { formatErr } from "@/utils/format";
import { uploadFileToBucket, signField } from "@/lib/s3";
import ArticleModel from "@/models/Article";
import { NotFoundError, BadRequestError } from "@/utils/customErrors";

const signArticle = async (
    article: { image?: string | null; authorImage?: string | null }
): Promise<void> => {
    await Promise.all([
        signField(article as Record<string, string | null | undefined>, "image"),
        signField(article as Record<string, string | null | undefined>, "authorImage")
    ]);
};

const uploadField = async (
    files: Record<string, Express.Multer.File[]> | undefined,
    fieldName: string,
    label: string,
    req: Request
) => {
    const file = files?.[fieldName]?.[0];
    if (!file) return;
    try {
        const { key } = await uploadFileToBucket(file, "articles");
        req.body[fieldName] = key;
    } catch (error) {
        throw new BadRequestError(
            `Failed to upload ${label}: ${formatErr(error, "Unknown error")}`
        );
    }
};

const handleFileUploads = async (req: Request) => {
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;
    await uploadField(files, "image", "image", req);
    await uploadField(files, "authorImage", "author image", req);
};

const ArticleController = {
    list: async (_req: Request, res: Response) => {
        const articles = await ArticleModel.findAll();
        await Promise.all(articles.map(signArticle));

        return fResponse({
            res,
            code: 200,
            message: "Articles retrieved",
            data: { articles }
        });
    },

    get: async (req: Request, res: Response) => {
        const slug = req.params.slug as string;
        const article = await ArticleModel.findBySlug(slug);

        if (!article) {
            throw new NotFoundError("Article not found");
        }

        await signArticle(article);

        return fResponse({
            res,
            code: 200,
            message: "Article retrieved",
            data: { article }
        });
    },

    create: async (req: Request, res: Response) => {
        await handleFileUploads(req);

        const article = await ArticleModel.create({
            ...req.body,
            userId: req.user?.sub
        });

        await signArticle(article);

        return fResponse({
            res,
            code: 201,
            message: "Article created",
            data: { article }
        });
    },

    update: async (req: Request, res: Response) => {
        const slug = req.params.slug as string;
        const existing = await ArticleModel.findBySlug(slug);

        if (!existing) {
            throw new NotFoundError("Article not found");
        }

        await handleFileUploads(req);

        const article = await ArticleModel.update(slug, req.body);

        await signArticle(article);

        return fResponse({
            res,
            code: 200,
            message: "Article updated",
            data: { article }
        });
    },

    remove: async (req: Request, res: Response) => {
        const slug = req.params.slug as string;
        const existing = await ArticleModel.findBySlug(slug);

        if (!existing) {
            throw new NotFoundError("Article not found");
        }

        await ArticleModel.delete(slug);

        return fResponse({
            res,
            code: 200,
            message: "Article deleted",
            data: {}
        });
    }
};

export default ArticleController;
