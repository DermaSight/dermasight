import { Request, Response, NextFunction, ErrorRequestHandler } from "express";

import {
    InternalServerError,
    NotFoundError,
    BadRequestError,
    ForbiddenError,
    UnauthorizedError,
    MLServiceError
} from "@/utils/customErrors";
import fResponse from "@/utils/responseFormatter";

const devStack = (err: Error) =>
    process.env.ENVIRONMENT === "development" ? err.stack?.trim().split("\n") : {};

const devCause = (err: Error) =>
    process.env.ENVIRONMENT === "development" ? (err.cause as object) : {};

export const errorMiddleware: ErrorRequestHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    const code = err instanceof BadRequestError
        ? err.statusCode
        : err instanceof InternalServerError ||
          err instanceof NotFoundError ||
          err instanceof ForbiddenError ||
          err instanceof UnauthorizedError ||
          err instanceof MLServiceError
        ? err.statusCode
        : 500;

    return fResponse({
        res,
        code,
        message: err instanceof BadRequestError ? err.message : err.message || "Something went wrong",
        data: err instanceof BadRequestError ? devCause(err) : devStack(err)
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
