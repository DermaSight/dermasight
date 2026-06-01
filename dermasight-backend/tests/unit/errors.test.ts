import { describe, test, expect } from "bun:test";
import {
    InternalServerError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    MLServiceError,
} from "@/utils/customErrors";

describe("Custom Error Classes", () => {
    describe("InternalServerError", () => {
        test("default message", () => {
            const err = new InternalServerError();
            expect(err.message).toBe("Internal Server Error");
            expect(err.statusCode).toBe(500);
            expect(err).toBeInstanceOf(Error);
        });

        test("custom message", () => {
            const err = new InternalServerError("Custom 500");
            expect(err.message).toBe("Custom 500");
            expect(err.statusCode).toBe(500);
        });

        test("prototype chain preserved", () => {
            const err = new InternalServerError();
            expect(err instanceof InternalServerError).toBe(true);
            expect(err instanceof Error).toBe(true);
        });
    });

    describe("NotFoundError", () => {
        test("default message", () => {
            const err = new NotFoundError();
            expect(err.message).toBe("Not Found");
            expect(err.statusCode).toBe(404);
        });

        test("custom message", () => {
            const err = new NotFoundError("Article not found");
            expect(err.message).toBe("Article not found");
            expect(err.statusCode).toBe(404);
        });

        test("instanceof checks", () => {
            const err = new NotFoundError();
            expect(err instanceof NotFoundError).toBe(true);
            expect(err instanceof Error).toBe(true);
        });
    });

    describe("BadRequestError", () => {
        test("default message without issues", () => {
            const err = new BadRequestError();
            expect(err.message).toBe("Bad Request");
            expect(err.statusCode).toBe(400);
            expect(err.cause).toBeUndefined();
        });

        test("custom message with issues", () => {
            const issues = [{ message: "email: Valid email is required" }];
            const err = new BadRequestError("Validation failed", issues);
            expect(err.message).toBe("Validation failed");
            expect(err.statusCode).toBe(400);
            expect(err.cause).toEqual(issues);
        });

        test("instanceof chain", () => {
            const err = new BadRequestError();
            expect(err instanceof BadRequestError).toBe(true);
            expect(err instanceof Error).toBe(true);
        });
    });

    describe("UnauthorizedError", () => {
        test("default message", () => {
            const err = new UnauthorizedError();
            expect(err.message).toBe("Unauthorized");
            expect(err.statusCode).toBe(401);
        });

        test("custom message", () => {
            const err = new UnauthorizedError("Token expired");
            expect(err.message).toBe("Token expired");
            expect(err.statusCode).toBe(401);
        });

        test("instanceof chain", () => {
            const err = new UnauthorizedError();
            expect(err instanceof UnauthorizedError).toBe(true);
            expect(err instanceof Error).toBe(true);
        });
    });

    describe("ForbiddenError", () => {
        test("default message", () => {
            const err = new ForbiddenError();
            expect(err.message).toBe("Forbidden");
            expect(err.statusCode).toBe(403);
        });

        test("instanceof chain", () => {
            const err = new ForbiddenError();
            expect(err instanceof ForbiddenError).toBe(true);
            expect(err instanceof Error).toBe(true);
        });
    });

    describe("MLServiceError", () => {
        test("default message", () => {
            const err = new MLServiceError();
            expect(err.message).toBe("ML Service unavailable");
            expect(err.statusCode).toBe(503);
        });

        test("custom message", () => {
            const err = new MLServiceError("ML Service request timeout");
            expect(err.message).toBe("ML Service request timeout");
            expect(err.statusCode).toBe(503);
        });

        test("instanceof chain", () => {
            const err = new MLServiceError();
            expect(err instanceof MLServiceError).toBe(true);
            expect(err instanceof Error).toBe(true);
        });
    });

    describe("distinct error types", () => {
        test("InternalServerError is not NotFoundError", () => {
            expect(new InternalServerError() instanceof NotFoundError).toBe(false);
        });

        test("BadRequestError is not UnauthorizedError", () => {
            expect(new BadRequestError() instanceof UnauthorizedError).toBe(false);
        });

        test("MLServiceError is not InternalServerError", () => {
            expect(new MLServiceError() instanceof InternalServerError).toBe(false);
        });

        test("each error class has unique statusCode", () => {
            const codes = [
                new InternalServerError().statusCode,
                new NotFoundError().statusCode,
                new BadRequestError().statusCode,
                new UnauthorizedError().statusCode,
                new ForbiddenError().statusCode,
                new MLServiceError().statusCode,
            ];
            expect(new Set(codes).size).toBe(codes.length);
        });
    });
});
