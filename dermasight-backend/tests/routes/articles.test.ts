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

const defaultArticle = {
    id: "article-1",
    title: "Test Article",
    slug: "test-article",
    tags: ["dermatology"],
    content: "Article content here",
    image: null as string | null,
    timeToRead: 5,
    authorName: "Dr. Test",
    authorTitle: "Dermatologist" as string | null,
    authorImage: null as string | null,
    createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GET /articles
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
describe("GET /articles", () => {
    test("returns empty list when no articles exist", async () => {
        __mock__.article.findAllResult = [];

        const res = await fetch(`${baseURL}/articles`);
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
        expect(body.data.articles).toEqual([]);
    });

    test("returns all articles ordered by recent", async () => {
        __mock__.article.findAllResult = [defaultArticle];

        const res = await fetch(`${baseURL}/articles`);
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.data.articles).toHaveLength(1);
        expect(body.data.articles[0].slug).toBe("test-article");
    });

    test("returns articles without password field", async () => {
        __mock__.article.findAllResult = [defaultArticle];

        const res = await fetch(`${baseURL}/articles`);
        const body = await parseResponse(res);

        const article = body.data.articles[0];
        expect(article).not.toHaveProperty("password");
    });

    test("signs image URLs for articles in list", async () => {
        __mock__.article.findAllResult = [
            { ...defaultArticle, image: "articles/banner1.jpg", authorImage: "articles/author1.jpg" },
            { ...defaultArticle, image: "articles/banner2.jpg", authorImage: "articles/author2.jpg" }
        ];

        const res = await fetch(`${baseURL}/articles`);
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.data.articles[0].image).toBe("https://r2.test/signed/image.jpg?signature=abc");
        expect(body.data.articles[0].authorImage).toBe("https://r2.test/signed/image.jpg?signature=abc");
        expect(body.data.articles[1].image).toBe("https://r2.test/signed/image.jpg?signature=abc");
        expect(body.data.articles[1].authorImage).toBe("https://r2.test/signed/image.jpg?signature=abc");
    });

    test("returns file keys when presigning fails on list", async () => {
        __mock__.article.findAllResult = [
            { ...defaultArticle, image: "articles/banner1.jpg", authorImage: "articles/author1.jpg" },
            { ...defaultArticle, image: "articles/banner2.jpg", authorImage: "articles/author2.jpg" }
        ];
        __mock__.s3.shouldThrow = true;

        const res = await fetch(`${baseURL}/articles`);
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.data.articles[0].image).toBe("articles/banner1.jpg");
        expect(body.data.articles[0].authorImage).toBe("articles/author1.jpg");
        expect(body.data.articles[1].image).toBe("articles/banner2.jpg");
        expect(body.data.articles[1].authorImage).toBe("articles/author2.jpg");
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GET /articles/:slug
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
describe("GET /articles/:slug", () => {
    test("returns article by slug", async () => {
        __mock__.article.findBySlugResult = defaultArticle;

        const res = await fetch(`${baseURL}/articles/test-article`);
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.data.article.slug).toBe("test-article");
        expect(body.data.article.title).toBe("Test Article");
    });

    test("returns 404 for non-existent slug", async () => {
        __mock__.article.findBySlugResult = null;

        const res = await fetch(`${baseURL}/articles/non-existent`);
        const body = await parseResponse(res);

        expect(res.status).toBe(404);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Article not found");
    });

    test("trailing slash lists articles (no slug)", async () => {
        __mock__.article.findAllResult = [defaultArticle];

        const res = await fetch(`${baseURL}/articles/`);
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.data.articles).toHaveLength(1);
    });

    test("handles slug with special characters", async () => {
        __mock__.article.findBySlugResult = {
            ...defaultArticle,
            slug: "article-with-special-chars-1",
        };

        const res = await fetch(`${baseURL}/articles/article-with-special-chars-1`);
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.data.article.slug).toBe("article-with-special-chars-1");
    });

    test("returns article with signed image URLs", async () => {
        __mock__.article.findBySlugResult = { ...defaultArticle, image: "articles/banner.jpg", authorImage: "articles/author.jpg" };

        const res = await fetch(`${baseURL}/articles/test-article`);
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.data.article.image).toBe("https://r2.test/signed/image.jpg?signature=abc");
        expect(body.data.article.authorImage).toBe("https://r2.test/signed/image.jpg?signature=abc");
    });

    test("returns article with null images when no images set", async () => {
        __mock__.article.findBySlugResult = { ...defaultArticle, image: null, authorImage: null };

        const res = await fetch(`${baseURL}/articles/test-article`);
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.data.article.image).toBeNull();
        expect(body.data.article.authorImage).toBeNull();
    });

    test("returns file key when presigning fails on GET", async () => {
        __mock__.article.findBySlugResult = { ...defaultArticle, image: "articles/banner.jpg", authorImage: "articles/author.jpg" };
        __mock__.s3.shouldThrow = true;

        const res = await fetch(`${baseURL}/articles/test-article`);
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.data.article.image).toBe("articles/banner.jpg");
        expect(body.data.article.authorImage).toBe("articles/author.jpg");
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POST /articles  (ADMIN only)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
describe("POST /articles", () => {
    test("creates article when admin authenticated", async () => {
        __mock__.paseto.decryptPayload = { ...__mock__.paseto.decryptPayload, role: "ADMIN" };
        __mock__.article.createResult = defaultArticle;

        const res = await fetch(`${baseURL}/articles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer test-access-token"
            },
            body: JSON.stringify({
                title: "Test Article",
                tags: ["dermatology"],
                content: "Article content here",
                timeToRead: 5,
                authorName: "Dr. Test"
            })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(201);
        expect(body.status).toBe("success");
        expect(body.data.article.slug).toBe("test-article");
    });

    test("returns 403 when member tries to create", async () => {
        const res = await fetch(`${baseURL}/articles`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer test-access-token"
            },
            body: JSON.stringify({
                title: "Test Article",
                tags: ["dermatology"],
                content: "Content here",
                timeToRead: 5,
                authorName: "Dr. Test"
            })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(403);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Insufficient permissions");
    });

    test("returns 401 when not authenticated", async () => {
        const res = await fetch(`${baseURL}/articles`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: "Test Article",
                tags: ["dermatology"],
                content: "Content here",
                timeToRead: 5,
                authorName: "Dr. Test"
            })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(401);
        expect(body.status).toBe("failed");
    });

    test("creates article with image file upload via multipart", async () => {
        __mock__.paseto.decryptPayload = { ...__mock__.paseto.decryptPayload, role: "ADMIN" };
        __mock__.article.createResult = { ...defaultArticle, image: "articles/test-file-key" };

        const formData = new FormData();
        formData.append("title", "Test Article");
        formData.append("tags", JSON.stringify(["dermatology"]));
        formData.append("content", "Article content here");
        formData.append("timeToRead", "5");
        formData.append("authorName", "Dr. Test");
        formData.append("image", new Blob(["fake-image"], { type: "image/jpeg" }), "banner.jpg");

        const res = await fetch(`${baseURL}/articles`, {
            method: "POST",
            headers: { Authorization: "Bearer test-access-token" },
            body: formData
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(201);
        expect(body.status).toBe("success");
        expect(body.data.article.image).toBe("https://r2.test/signed/image.jpg?signature=abc");
    });

    test("returns 400 when image upload to S3 fails", async () => {
        __mock__.paseto.decryptPayload = { ...__mock__.paseto.decryptPayload, role: "ADMIN" };
        __mock__.s3.shouldThrow = true;

        const formData = new FormData();
        formData.append("title", "Test Article");
        formData.append("tags", JSON.stringify(["dermatology"]));
        formData.append("content", "Article content here");
        formData.append("timeToRead", "5");
        formData.append("authorName", "Dr. Test");
        formData.append("image", new Blob(["fake"], { type: "image/jpeg" }), "banner.jpg");

        const res = await fetch(`${baseURL}/articles`, {
            method: "POST",
            headers: { Authorization: "Bearer test-access-token" },
            body: formData
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
        expect(body.message).toContain("Failed to upload image");
    });

    test("returns 400 for invalid image file type", async () => {
        __mock__.paseto.decryptPayload = { ...__mock__.paseto.decryptPayload, role: "ADMIN" };

        const formData = new FormData();
        formData.append("title", "Test Article");
        formData.append("tags", JSON.stringify(["dermatology"]));
        formData.append("content", "Article content here");
        formData.append("timeToRead", "5");
        formData.append("authorName", "Dr. Test");
        formData.append("image", new Blob(["fake"], { type: "application/pdf" }), "doc.pdf");

        const res = await fetch(`${baseURL}/articles`, {
            method: "POST",
            headers: { Authorization: "Bearer test-access-token" },
            body: formData
        });

        expect(res.status).toBe(400);
    });

    test("creates article with authorImage file upload via multipart", async () => {
        __mock__.paseto.decryptPayload = { ...__mock__.paseto.decryptPayload, role: "ADMIN" };
        __mock__.article.createResult = { ...defaultArticle, authorImage: "articles/test-author-file-key" };

        const formData = new FormData();
        formData.append("title", "Test Article");
        formData.append("tags", JSON.stringify(["dermatology"]));
        formData.append("content", "Article content here");
        formData.append("timeToRead", "5");
        formData.append("authorName", "Dr. Test");
        formData.append("authorImage", new Blob(["fake-author-image"], { type: "image/jpeg" }), "headshot.jpg");

        const res = await fetch(`${baseURL}/articles`, {
            method: "POST",
            headers: { Authorization: "Bearer test-access-token" },
            body: formData
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(201);
        expect(body.status).toBe("success");
        expect(body.data.article.authorImage).toBe("https://r2.test/signed/image.jpg?signature=abc");
    });

    test("returns 400 when authorImage upload to S3 fails", async () => {
        __mock__.paseto.decryptPayload = { ...__mock__.paseto.decryptPayload, role: "ADMIN" };
        __mock__.s3.shouldThrow = true;

        const formData = new FormData();
        formData.append("title", "Test Article");
        formData.append("tags", JSON.stringify(["dermatology"]));
        formData.append("content", "Article content here");
        formData.append("timeToRead", "5");
        formData.append("authorName", "Dr. Test");
        formData.append("authorImage", new Blob(["fake"], { type: "image/jpeg" }), "headshot.jpg");

        const res = await fetch(`${baseURL}/articles`, {
            method: "POST",
            headers: { Authorization: "Bearer test-access-token" },
            body: formData
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
        expect(body.message).toContain("Failed to upload author image");
    });

    test("returns 400 for invalid authorImage file type", async () => {
        __mock__.paseto.decryptPayload = { ...__mock__.paseto.decryptPayload, role: "ADMIN" };

        const formData = new FormData();
        formData.append("title", "Test Article");
        formData.append("tags", JSON.stringify(["dermatology"]));
        formData.append("content", "Article content here");
        formData.append("timeToRead", "5");
        formData.append("authorName", "Dr. Test");
        formData.append("authorImage", new Blob(["fake"], { type: "application/pdf" }), "doc.pdf");

        const res = await fetch(`${baseURL}/articles`, {
            method: "POST",
            headers: { Authorization: "Bearer test-access-token" },
            body: formData
        });

        expect(res.status).toBe(400);
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PUT /articles/:slug  (ADMIN only)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
describe("PUT /articles/:slug", () => {
    test("updates article when admin authenticated", async () => {
        __mock__.paseto.decryptPayload = { ...__mock__.paseto.decryptPayload, role: "ADMIN" };
        __mock__.article.findBySlugResult = defaultArticle;
        __mock__.article.updateResult = { ...defaultArticle, title: "Updated Title" };

        const res = await fetch(`${baseURL}/articles/test-article`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer test-access-token"
            },
            body: JSON.stringify({ title: "Updated Title" })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
        expect(body.data.article.title).toBe("Updated Title");
    });

    test("returns 403 when member tries to update", async () => {
        const res = await fetch(`${baseURL}/articles/test-article`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer test-access-token"
            },
            body: JSON.stringify({ title: "Updated" })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(403);
        expect(body.status).toBe("failed");
    });

    test("returns 401 when not authenticated", async () => {
        const res = await fetch(`${baseURL}/articles/test-article`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "Updated" })
        });
        expect(res.status).toBe(401);
    });

    test("returns 404 for non-existent slug when admin", async () => {
        __mock__.paseto.decryptPayload = { ...__mock__.paseto.decryptPayload, role: "ADMIN" };
        __mock__.article.findBySlugResult = null;

        const res = await fetch(`${baseURL}/articles/non-existent`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer test-access-token"
            },
            body: JSON.stringify({ title: "Updated" })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(404);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Article not found");
    });

    test("updates article with image file upload via multipart", async () => {
        __mock__.paseto.decryptPayload = { ...__mock__.paseto.decryptPayload, role: "ADMIN" };
        __mock__.article.findBySlugResult = defaultArticle;
        __mock__.article.updateResult = { ...defaultArticle, image: "articles/updated-file-key" };

        const formData = new FormData();
        formData.append("title", "Updated Title");
        formData.append("image", new Blob(["fake"], { type: "image/jpeg" }), "new-banner.jpg");

        const res = await fetch(`${baseURL}/articles/test-article`, {
            method: "PUT",
            headers: { Authorization: "Bearer test-access-token" },
            body: formData
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
        expect(body.data.article.image).toBe("https://r2.test/signed/image.jpg?signature=abc");
    });

    test("returns 400 when image upload fails on update", async () => {
        __mock__.paseto.decryptPayload = { ...__mock__.paseto.decryptPayload, role: "ADMIN" };
        __mock__.article.findBySlugResult = defaultArticle;
        __mock__.s3.shouldThrow = true;

        const formData = new FormData();
        formData.append("title", "Updated Title");
        formData.append("image", new Blob(["fake"], { type: "image/jpeg" }), "banner.jpg");

        const res = await fetch(`${baseURL}/articles/test-article`, {
            method: "PUT",
            headers: { Authorization: "Bearer test-access-token" },
            body: formData
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
        expect(body.message).toContain("Failed to upload image");
    });

    test("updates article with authorImage file upload via multipart", async () => {
        __mock__.paseto.decryptPayload = { ...__mock__.paseto.decryptPayload, role: "ADMIN" };
        __mock__.article.findBySlugResult = defaultArticle;
        __mock__.article.updateResult = { ...defaultArticle, authorImage: "articles/updated-author-file-key" };

        const formData = new FormData();
        formData.append("title", "Updated Title");
        formData.append("authorImage", new Blob(["fake"], { type: "image/jpeg" }), "new-headshot.jpg");

        const res = await fetch(`${baseURL}/articles/test-article`, {
            method: "PUT",
            headers: { Authorization: "Bearer test-access-token" },
            body: formData
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
        expect(body.data.article.authorImage).toBe("https://r2.test/signed/image.jpg?signature=abc");
    });

    test("returns 400 when authorImage upload fails on update", async () => {
        __mock__.paseto.decryptPayload = { ...__mock__.paseto.decryptPayload, role: "ADMIN" };
        __mock__.article.findBySlugResult = defaultArticle;
        __mock__.s3.shouldThrow = true;

        const formData = new FormData();
        formData.append("title", "Updated Title");
        formData.append("authorImage", new Blob(["fake"], { type: "image/jpeg" }), "headshot.jpg");

        const res = await fetch(`${baseURL}/articles/test-article`, {
            method: "PUT",
            headers: { Authorization: "Bearer test-access-token" },
            body: formData
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
        expect(body.message).toContain("Failed to upload author image");
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DELETE /articles/:slug  (ADMIN only)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
describe("DELETE /articles/:slug", () => {
    test("deletes article when admin authenticated", async () => {
        __mock__.paseto.decryptPayload = { ...__mock__.paseto.decryptPayload, role: "ADMIN" };
        __mock__.article.findBySlugResult = defaultArticle;

        const res = await fetch(`${baseURL}/articles/test-article`, {
            method: "DELETE",
            headers: { Authorization: "Bearer test-access-token" }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
        expect(body.message).toBe("Article deleted");
    });

    test("returns 403 when member tries to delete", async () => {
        const res = await fetch(`${baseURL}/articles/test-article`, {
            method: "DELETE",
            headers: { Authorization: "Bearer test-access-token" }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(403);
        expect(body.status).toBe("failed");
    });

    test("returns 401 when not authenticated", async () => {
        const res = await fetch(`${baseURL}/articles/test-article`, { method: "DELETE" });
        expect(res.status).toBe(401);
    });

    test("returns 404 for non-existent slug when admin", async () => {
        __mock__.paseto.decryptPayload = { ...__mock__.paseto.decryptPayload, role: "ADMIN" };
        __mock__.article.findBySlugResult = null;

        const res = await fetch(`${baseURL}/articles/non-existent`, {
            method: "DELETE",
            headers: { Authorization: "Bearer test-access-token" }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(404);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Article not found");
    });
});
