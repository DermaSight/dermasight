import { describe, test, expect, mock } from "bun:test";
import fResponse from "@/utils/responseFormatter";

describe("fResponse", () => {
    const mockJson = mock(() => { });
    const mockStatus = mock(() => ({ json: mockJson }));
    const mockRes = { status: mockStatus } as any;

    test("success response (code < 400)", () => {
        mockStatus.mockReturnValue({ json: mockJson });
        fResponse({ res: mockRes, code: 200, message: "OK", data: { id: 1 } });

        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({
            status: "success",
            message: "OK",
            data: { id: 1 }
        });
    });

    test("created response", () => {
        mockStatus.mockReturnValue({ json: mockJson });
        fResponse({ res: mockRes, code: 201, message: "Created", data: {} });

        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({
            status: "success",
            message: "Created",
            data: {}
        });
    });

    test("error response (code >= 400)", () => {
        mockStatus.mockReturnValue({ json: mockJson });
        fResponse({ res: mockRes, code: 400, message: "Bad Request", data: {} });

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            status: "failed",
            message: "Bad Request",
            data: {}
        });
    });

    test("unauthorized response", () => {
        mockStatus.mockReturnValue({ json: mockJson });
        fResponse({ res: mockRes, code: 401, message: "Not authenticated", data: {} });

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
            status: "failed",
            message: "Not authenticated",
            data: {}
        });
    });

    test("server error response", () => {
        mockStatus.mockReturnValue({ json: mockJson });
        fResponse({ res: mockRes, code: 500, message: "Something went wrong", data: {} });

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({
            status: "failed",
            message: "Something went wrong",
            data: {}
        });
    });

    test("response with empty data", () => {
        mockStatus.mockReturnValue({ json: mockJson });
        fResponse({ res: mockRes, code: 200, message: "OK", data: {} });

        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({
            status: "success",
            message: "OK",
            data: {}
        });
    });

    test("response with null data", () => {
        mockStatus.mockReturnValue({ json: mockJson });
        fResponse({ res: mockRes, code: 200, message: "OK" });

        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({
            status: "success",
            message: "OK",
            data: undefined
        });
    });

    test("returns the call chain result", () => {
        const chainResult = {};
        const res = { status: mock(() => ({ json: mock(() => chainResult) })) } as any;
        const result = fResponse({ res, code: 200, message: "OK", data: {} });
        expect(result as any).toBe(chainResult);
    });
});
