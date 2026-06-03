import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

import fResponse from "@/utils/responseFormatter";
import logger from "@/utils/logger";

const devStack = (err: Error) =>
    process.env.ENVIRONMENT === "development" ? err.stack?.trim().split("\n") : {};

export const errorMiddleware: ErrorRequestHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    logger.error(err.stack || err.message);

    if (err instanceof SyntaxError && "body" in err) {
        return fResponse({
            res,
            code: 400,
            message: "Invalid JSON",
            data: { type: "SyntaxError" }
        });
    }

    const code = (err as any).statusCode ?? 500;
    const isCustomError = typeof (err as any).statusCode === "number";

    return fResponse({
        res,
        code,
        message: isCustomError ? err.message : "Something went wrong",
        data: {
            type: err.name,
            ...(err.cause ? { issues: err.cause } : {}),
            ...(process.env.ENVIRONMENT === "development" ? { stack: devStack(err) } : {})
        }
    });
};

export const notFoundMiddleware = (_req: Request, res: Response, _next: NextFunction) => {
    return fResponse({
        res,
        code: 404,
        message: "Route not found",
        data: {}
    });
};
