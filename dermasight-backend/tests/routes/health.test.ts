import { describe, test, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import { startTestServer, stopTestServer } from "@/tests/helpers/testServer";
import { parseResponse } from "@/tests/helpers/response";
import { __mock__, resetMocks } from "@/tests/setup";

let baseURL: string;

beforeAll(async () => {
    baseURL = await startTestServer();
});

afterAll(async () => {
    await stopTestServer();
});

beforeEach(() => {
    resetMocks();
});

describe("GET /health", () => {
    test("returns 200 when database is healthy", async () => {
        __mock__.db.healthy = true;

        const res = await fetch(`${baseURL}/health`);
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
        expect(body.message).toBe("System is Healthy");
        expect(body.data.database).toBe("healthy");
    });

    test("returns 503 when database is unhealthy", async () => {
        __mock__.db.healthy = false;

        const res = await fetch(`${baseURL}/health`);
        const body = await parseResponse(res);

        expect(res.status).toBe(503);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("System is Unhealthy");
        expect(body.data.database).toBe("unhealthy");
    });

    test("response contains valid JSON structure", async () => {
        __mock__.db.healthy = true;

        const res = await fetch(`${baseURL}/health`);
        const body = await parseResponse(res);

        expect(body).toHaveProperty("status");
        expect(body).toHaveProperty("message");
        expect(body).toHaveProperty("data");
        expect(body.data).toHaveProperty("database");
    });

    test("uses GET method", async () => {
        const res = await fetch(`${baseURL}/health`, { method: "GET" });
        expect(res.status).toBe(200);
    });

    test("POST to /health returns 404 (wrong method)", async () => {
        const res = await fetch(`${baseURL}/health`, { method: "POST" });
        expect(res.status).toBe(404);
    });
});
