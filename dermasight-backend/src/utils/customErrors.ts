const createErrorClass = (defaultMessage: string, code: number) => {
    return class extends Error {
        statusCode = code;

        constructor(message?: string, issues?: object[]) {
            super(message || defaultMessage);
            Object.setPrototypeOf(this, new.target!.prototype);
            if (issues) this.cause = issues;
        }
    };
};

export const InternalServerError = createErrorClass("Internal Server Error", 500);
export const NotFoundError = createErrorClass("Not Found", 404);
export const BadRequestError = createErrorClass("Bad Request", 400);
export const UnauthorizedError = createErrorClass("Unauthorized", 401);
export const ForbiddenError = createErrorClass("Forbidden", 403);
export const MLServiceError = createErrorClass("ML Service unavailable", 503);
