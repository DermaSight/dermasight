import { describe, test, expect, mock, afterEach } from "bun:test";
import { errorMiddleware, notFoundMiddleware } from "@/middlewares/errorHandler";
import {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    InternalServerError,
    MLServiceError
} from "@/utils/customErrors";

mock.module("@/utils/logger", () => ({
    default: {
        error: mock(() => {}),
        info: mock(() => {}),
        warn: mock(() => {}),
        debug: mock(() => {})
    }
}));

function makeRes() {
    const json = mock(() => {});
    const status = mock(() => ({ json }));
    return { status, json } as any;
}

const mockReq = {} as any;
const mockNext = mock(() => {});

describe("errorMiddleware", () => {
    afterEach(() => {
        delete process.env.ENVIRONMENT;
        process.env.ENVIRONMENT = "test";
    });

    test("BadRequestError with issues returns 400 with issues and type", () => {
        const res = makeRes();
        const issues = [{ message: "email: Valid email is required" }];
        const err = new BadRequestError("Validation failed", issues);

        errorMiddleware(err, mockReq, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.status().json).toHaveBeenCalledWith({
            status: "failed",
            message: "Validation failed",
            data: { type: "BadRequestError", issues }
        });
    });

    test("BadRequestError without issues returns 400 with type, no issues key", () => {
        const res = makeRes();
        const err = new BadRequestError();

        errorMiddleware(err, mockReq, res, mockNext);

        const jsonArg = res.status().json.mock.calls[0][0];
        expect(jsonArg.data.type).toBe("BadRequestError");
        expect(Object.hasOwn(jsonArg.data, "issues")).toBe(false);
    });

    test("UnauthorizedError returns 401", () => {
        const res = makeRes();
        const err = new UnauthorizedError("Token expired");

        errorMiddleware(err, mockReq, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.status().json).toHaveBeenCalledWith({
            status: "failed",
            message: "Token expired",
            data: { type: "UnauthorizedError" }
        });
    });

    test("ForbiddenError returns 403", () => {
        const res = makeRes();
        const err = new ForbiddenError();

        errorMiddleware(err, mockReq, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(403);
        const jsonArg = res.status().json.mock.calls[0][0];
        expect(jsonArg.message).toBe("Forbidden");
        expect(jsonArg.data.type).toBe("ForbiddenError");
    });

    test("NotFoundError returns 404", () => {
        const res = makeRes();
        const err = new NotFoundError("Article not found");

        errorMiddleware(err, mockReq, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(404);
        const jsonArg = res.status().json.mock.calls[0][0];
        expect(jsonArg.message).toBe("Article not found");
        expect(jsonArg.data.type).toBe("NotFoundError");
    });

    test("InternalServerError returns 500", () => {
        const res = makeRes();
        const err = new InternalServerError();

        errorMiddleware(err, mockReq, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(500);
        const jsonArg = res.status().json.mock.calls[0][0];
        expect(jsonArg.data.type).toBe("InternalServerError");
    });

    test("MLServiceError returns 503", () => {
        const res = makeRes();
        const err = new MLServiceError("ML Service timeout");

        errorMiddleware(err, mockReq, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(503);
        const jsonArg = res.status().json.mock.calls[0][0];
        expect(jsonArg.message).toBe("ML Service timeout");
        expect(jsonArg.data.type).toBe("MLServiceError");
    });

    test("plain Error returns 500 with Something went wrong and no issues key", () => {
        const res = makeRes();
        const err = new Error("something bad");

        errorMiddleware(err, mockReq, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.status().json).toHaveBeenCalledWith({
            status: "failed",
            message: "Something went wrong",
            data: { type: "Error" }
        });
    });

    test("plain Error with empty message also returns Something went wrong", () => {
        const res = makeRes();
        const err = new Error();

        errorMiddleware(err, mockReq, res, mockNext);

        const jsonArg = res.status().json.mock.calls[0][0];
        expect(jsonArg.message).toBe("Something went wrong");
    });

    test("SyntaxError with body property returns 400 Invalid JSON", () => {
        const res = makeRes();
        const err = new SyntaxError("Unexpected token");
        (err as any).body = {};

        errorMiddleware(err, mockReq, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.status().json).toHaveBeenCalledWith({
            status: "failed",
            message: "Invalid JSON",
            data: { type: "SyntaxError" }
        });
    });

    test("SyntaxError without body property falls through to generic 500", () => {
        const res = makeRes();
        const err = new SyntaxError("Some other syntax problem");

        errorMiddleware(err, mockReq, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(500);
        const jsonArg = res.status().json.mock.calls[0][0];
        expect(jsonArg.message).toBe("Something went wrong");
        expect(jsonArg.data.type).toBe("SyntaxError");
    });

    test("includes stack in data when ENVIRONMENT is development", () => {
        process.env.ENVIRONMENT = "development";
        const res = makeRes();
        const err = new BadRequestError("test");

        errorMiddleware(err, mockReq, res, mockNext);

        const jsonArg = res.status().json.mock.calls[0][0];
        expect(Array.isArray(jsonArg.data.stack)).toBe(true);
        expect(jsonArg.data.stack.length).toBeGreaterThan(0);
    });

    test("does not include stack in data when ENVIRONMENT is production", () => {
        process.env.ENVIRONMENT = "production";
        const res = makeRes();
        const err = new BadRequestError("test");

        errorMiddleware(err, mockReq, res, mockNext);

        const jsonArg = res.status().json.mock.calls[0][0];
        expect(Object.hasOwn(jsonArg.data, "stack")).toBe(false);
    });

    test("does not include stack in data when ENVIRONMENT is test", () => {
        const res = makeRes();
        const err = new BadRequestError("test");

        errorMiddleware(err, mockReq, res, mockNext);

        const jsonArg = res.status().json.mock.calls[0][0];
        expect(Object.hasOwn(jsonArg.data, "stack")).toBe(false);
    });

    test("issues are included in all environments", () => {
        process.env.ENVIRONMENT = "production";
        const res = makeRes();
        const issues = [{ message: "email: required" }];
        const err = new BadRequestError("Validation failed", issues);

        errorMiddleware(err, mockReq, res, mockNext);

        const jsonArg = res.status().json.mock.calls[0][0];
        expect(jsonArg.data.issues).toEqual(issues);
    });

    test("type is included in all environments", () => {
        process.env.ENVIRONMENT = "production";
        const res = makeRes();
        const err = new NotFoundError();

        errorMiddleware(err, mockReq, res, mockNext);

        const jsonArg = res.status().json.mock.calls[0][0];
        expect(jsonArg.data.type).toBe("NotFoundError");
    });
});

describe("notFoundMiddleware", () => {
    test("returns 404 with Route not found", () => {
        const res = makeRes();

        notFoundMiddleware(mockReq, res, mockNext);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.status().json).toHaveBeenCalledWith({
            status: "failed",
            message: "Route not found",
            data: {}
        });
        expect(mockNext).not.toHaveBeenCalled();
    });
});
