const createErrorClass = (name: string, defaultMessage: string, code: number) => {
    return class extends Error {
        statusCode = code;

        constructor(message?: string, issues?: object[]) {
            super(message || defaultMessage);
            this.name = name;
            Object.setPrototypeOf(this, new.target!.prototype);
            if (issues) this.cause = issues;
        }
    };
};

export const InternalServerError = createErrorClass("InternalServerError", "Internal Server Error", 500);
export const NotFoundError = createErrorClass("NotFoundError", "Not Found", 404);
export const BadRequestError = createErrorClass("BadRequestError", "Bad Request", 400);
export const UnauthorizedError = createErrorClass("UnauthorizedError", "Unauthorized", 401);
export const ForbiddenError = createErrorClass("ForbiddenError", "Forbidden", 403);
export const MLServiceError = createErrorClass("MLServiceError", "ML Service unavailable", 503);
