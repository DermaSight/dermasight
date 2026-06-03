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

describe("POST /contact-us", () => {
    test("returns 200 when subject and content are valid", async () => {
        const res = await fetch(`${baseURL}/contact-us`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject: "Bug Report", content: "I found a bug in the app." })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
        expect(body.message).toBe("Message sent successfully");
    });

    test("returns 200 with extra fields (ignored)", async () => {
        const res = await fetch(`${baseURL}/contact-us`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject: "Hello", content: "World", extra: "ignored" })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
    });

    test("returns 400 when subject is missing", async () => {
        const res = await fetch(`${baseURL}/contact-us`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: "Some content" })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
    });

    test("returns 400 when content is missing", async () => {
        const res = await fetch(`${baseURL}/contact-us`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject: "Hello" })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
    });

    test("returns 400 when subject is empty", async () => {
        const res = await fetch(`${baseURL}/contact-us`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject: "", content: "Content" })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
    });

    test("returns 400 when content is empty", async () => {
        const res = await fetch(`${baseURL}/contact-us`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject: "Subject", content: "" })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
    });

    test("returns 400 when subject is not a string", async () => {
        const res = await fetch(`${baseURL}/contact-us`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject: 123, content: "Content" })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
    });

    test("returns 400 when content is not a string", async () => {
        const res = await fetch(`${baseURL}/contact-us`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject: "Subject", content: { text: "hello" } })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
    });

    test("returns 500 when SMTP fails", async () => {
        __mock__.mailer.shouldThrow = true;

        const res = await fetch(`${baseURL}/contact-us`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ subject: "Test", content: "Test content" })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(500);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Failed to send message");
    });

    test("returns 404 on GET method", async () => {
        const res = await fetch(`${baseURL}/contact-us`, { method: "GET" });
        expect(res.status).toBe(404);
    });

    test("returns 404 on PUT method", async () => {
        const res = await fetch(`${baseURL}/contact-us`, { method: "PUT" });
        expect(res.status).toBe(404);
    });

    test("returns 400 when both subject and content are missing", async () => {
        const res = await fetch(`${baseURL}/contact-us`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
    });

    test("returns 400 on malformed JSON body (express.json SyntaxError)", async () => {
        const res = await fetch(`${baseURL}/contact-us`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "not-json"
        });
        const body = await parseResponse(res);
        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Invalid JSON");
    });
});
