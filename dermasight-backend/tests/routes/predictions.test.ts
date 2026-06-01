import { describe, test, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import { startTestServer, stopTestServer } from "@/tests/helpers/testServer";
import { parseResponse } from "@/tests/helpers/response";
import { __mock__, resetMocks } from "@/tests/setup";

let baseURL: string;

const pngBuffer = new Uint8Array([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
]);

const defaultPrediction = {
    id: "pred-1",
    userId: "user-1",
    imageUrl: "predictions/test-file-key",
    predicted_class: "Melanoma",
    severity_label: "Severe",
    confidence: 92.5,
    combined_score: 0.85,
    malignancy_score: 0.78,
    site_risk_score: 0.65,
    area_pct: 45.2,
    inference_time_ms: 1234.56,
    groq_analysis: null,
    anatomical_site: "head/neck",
    createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
};

beforeAll(async () => {
    baseURL = await startTestServer();
});

afterAll(async () => {
    await stopTestServer();
});

beforeEach(() => {
    resetMocks();
});

function buildFormData(): FormData {
    const form = new FormData();
    form.append("file", new Blob([pngBuffer], { type: "image/png" }), "test-image.png");
    form.append("anatomical_site", "head/neck");
    return form;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POST /predict
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
describe("POST /predict", () => {
    test("returns prediction for authenticated user and stores in history", async () => {
        __mock__.prediction.createResult = defaultPrediction;

        const form = buildFormData();
        const res = await fetch(`${baseURL}/predict`, {
            method: "POST",
            headers: { Authorization: "Bearer test-access-token" },
            body: form
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
        expect(body.data.predicted_class).toBe("Melanoma");
        expect(body.data.severity_label).toBe("Severe");
        expect(body.data.confidence).toBe(92.5);
        expect(body.data.combined_score).toBe(0.85);
        expect(body.data.malignancy_score).toBe(0.78);
        expect(body.data.site_risk_score).toBe(0.65);
        expect(body.data.area_pct).toBe(45.2);
        expect(body.data.inference_time_ms).toBe(1234.56);
        expect(body.data.anatomical_site).toBe("head/neck");
        expect(body.data.imageUrl).toBe("https://r2.test/signed/image.jpg?signature=abc");
        expect(body.data.storedInHistory).toBe(true);
    });

    test("returns prediction for anonymous user without storing in history", async () => {
        const form = buildFormData();
        const res = await fetch(`${baseURL}/predict`, {
            method: "POST",
            body: form
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
        expect(body.data.imageUrl).toBe("https://r2.test/signed/image.jpg?signature=abc");
        expect(body.data.storedInHistory).toBe(false);
    });

    test("returns 400 when no file is provided", async () => {
        const form = new FormData();
        form.append("anatomical_site", "head/neck");

        const res = await fetch(`${baseURL}/predict`, {
            method: "POST",
            body: form
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
        expect(body.message).toContain("Image file is required");
    });

    test("returns 400 when anatomical_site is missing", async () => {
        const form = new FormData();
        form.append("file", new Blob([pngBuffer], { type: "image/png" }), "test.png");

        const res = await fetch(`${baseURL}/predict`, {
            method: "POST",
            body: form
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
    });

    test("returns 503 when ML service errors", async () => {
        __mock__.modelApi.shouldThrow = true;

        const form = buildFormData();
        const res = await fetch(`${baseURL}/predict`, {
            method: "POST",
            body: form
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(503);
        expect(body.status).toBe("failed");
    });

    test("returns 400 when R2 upload fails", async () => {
        __mock__.s3.shouldThrow = true;

        const form = buildFormData();
        const res = await fetch(`${baseURL}/predict`, {
            method: "POST",
            body: form
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
        expect(body.message).toContain("Failed to upload image");
    });

    test("returns analysis when ML API provides it", async () => {
        __mock__.modelApi.hasAnalysis = true;

        const form = buildFormData();
        const res = await fetch(`${baseURL}/predict`, {
            method: "POST",
            body: form
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.data.groq_analysis).toBeDefined();
        expect(body.data.groq_analysis.available).toBe(true);
        expect(body.data.groq_analysis.text).toBeTruthy();
        expect(body.data.groq_analysis.model).toBe("llama-3.3-70b-versatile");
    });

    test("omits analysis when ML API does not provide it", async () => {
        __mock__.modelApi.hasAnalysis = false;

        const form = buildFormData();
        const res = await fetch(`${baseURL}/predict`, {
            method: "POST",
            body: form
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.data.groq_analysis).toBeUndefined();
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GET /predict/history  (authenticated)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
describe("GET /predict/history", () => {
    test("returns paginated prediction history for authenticated user", async () => {
        __mock__.prediction.findByUserIdResult = [defaultPrediction];
        __mock__.prediction.countByUserIdResult = 1;

        const res = await fetch(`${baseURL}/predict/history`, {
            headers: { Authorization: "Bearer test-access-token" }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
        expect(body.data.predictions).toHaveLength(1);
        expect(body.data.predictions[0].predicted_class).toBe("Melanoma");
        expect(body.data.predictions[0].imageUrl).toBe("https://r2.test/signed/image.jpg?signature=abc");
        expect(body.data.pagination.total).toBe(1);
        expect(body.data.pagination.hasMore).toBe(false);
    });

    test("returns 401 when not authenticated", async () => {
        const res = await fetch(`${baseURL}/predict/history`);
        const body = await parseResponse(res);

        expect(res.status).toBe(401);
        expect(body.status).toBe("failed");
    });

    test("returns empty list when user has no predictions", async () => {
        __mock__.prediction.findByUserIdResult = [];
        __mock__.prediction.countByUserIdResult = 0;

        const res = await fetch(`${baseURL}/predict/history`, {
            headers: { Authorization: "Bearer test-access-token" }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.data.predictions).toEqual([]);
        expect(body.data.pagination.total).toBe(0);
        expect(body.data.pagination.hasMore).toBe(false);
    });

    test("respects limit query parameter", async () => {
        const predictions = Array.from({ length: 5 }, (_, i) => ({
            ...defaultPrediction,
            id: `pred-${i + 1}`,
        }));
        __mock__.prediction.findByUserIdResult = predictions;
        __mock__.prediction.countByUserIdResult = 20;

        const res = await fetch(`${baseURL}/predict/history?limit=5`, {
            headers: { Authorization: "Bearer test-access-token" }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.data.predictions).toHaveLength(5);
        expect(body.data.pagination.limit).toBe(5);
        expect(body.data.pagination.hasMore).toBe(true);
    });

    test("defaults limit to 10 and offset to 0", async () => {
        __mock__.prediction.findByUserIdResult = [];
        __mock__.prediction.countByUserIdResult = 0;

        const res = await fetch(`${baseURL}/predict/history`, {
            headers: { Authorization: "Bearer test-access-token" }
        });
        const body = await parseResponse(res);

        expect(body.data.pagination.limit).toBe(10);
        expect(body.data.pagination.offset).toBe(0);
    });

    test("validates limit does not exceed 100", async () => {
        const res = await fetch(`${baseURL}/predict/history?limit=200`, {
            headers: { Authorization: "Bearer test-access-token" }
        });
        expect(res.status).toBe(400);
    });

    test("hasMore is true when offset + limit < total", async () => {
        __mock__.prediction.findByUserIdResult = [defaultPrediction];
        __mock__.prediction.countByUserIdResult = 25;

        const res = await fetch(`${baseURL}/predict/history?limit=10&offset=0`, {
            headers: { Authorization: "Bearer test-access-token" }
        });
        const body = await parseResponse(res);

        expect(body.data.pagination.hasMore).toBe(true);
    });

    test("hasMore is false when at the end of results", async () => {
        __mock__.prediction.findByUserIdResult = [defaultPrediction];
        __mock__.prediction.countByUserIdResult = 1;

        const res = await fetch(`${baseURL}/predict/history?limit=10&offset=0`, {
            headers: { Authorization: "Bearer test-access-token" }
        });
        const body = await parseResponse(res);

        expect(body.data.pagination.hasMore).toBe(false);
    });

    test("returns groq_analysis when prediction has it", async () => {
        const predictionWithAnalysis = {
            ...defaultPrediction,
            groq_analysis: {
                available: true,
                text: "Kanker kulit ini perlu perhatian khusus.",
                model: "llama-3.3-70b-versatile"
            }
        };
        __mock__.prediction.findByUserIdResult = [predictionWithAnalysis];
        __mock__.prediction.countByUserIdResult = 1;

        const res = await fetch(`${baseURL}/predict/history`, {
            headers: { Authorization: "Bearer test-access-token" }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.data.predictions[0].groq_analysis).toBeDefined();
        expect(body.data.predictions[0].groq_analysis.available).toBe(true);
        expect(body.data.predictions[0].groq_analysis.text).toBeTruthy();
        expect(body.data.predictions[0].groq_analysis.model).toBe("llama-3.3-70b-versatile");
    });

    test("returns null groq_analysis when prediction has none", async () => {
        __mock__.prediction.findByUserIdResult = [defaultPrediction];
        __mock__.prediction.countByUserIdResult = 1;

        const res = await fetch(`${baseURL}/predict/history`, {
            headers: { Authorization: "Bearer test-access-token" }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.data.predictions[0].groq_analysis).toBeNull();
    });
});
