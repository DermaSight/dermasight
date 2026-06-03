import { describe, test, expect } from "bun:test";
import { registerSchema, loginSchema } from "@/schemas/auth";
import { createArticleSchema, updateArticleSchema } from "@/schemas/article";
import { createPredictionSchema, historyQuerySchema } from "@/schemas/prediction";

describe("Auth Schemas", () => {
    describe("registerSchema", () => {
        const validPassword = "securepass123";

        test("valid registration data", () => {
            const result = registerSchema.safeParse({
                email: "user@example.com",
                password: validPassword,
                confirm_password: validPassword,
                name: "Test User"
            });
            expect(result.success).toBe(true);
        });

        test("valid without optional name", () => {
            const result = registerSchema.safeParse({
                email: "user@example.com",
                password: validPassword,
                confirm_password: validPassword
            });
            expect(result.success).toBe(true);
        });

        test("invalid email format", () => {
            const result = registerSchema.safeParse({
                email: "not-an-email",
                password: validPassword,
                confirm_password: validPassword
            });
            expect(result.success).toBe(false);
        });

        test("missing email", () => {
            const result = registerSchema.safeParse({
                password: validPassword,
                confirm_password: validPassword
            });
            expect(result.success).toBe(false);
        });

        test("password too short (under 8 characters)", () => {
            const result = registerSchema.safeParse({
                email: "user@example.com",
                password: "short",
                confirm_password: "short"
            });
            expect(result.success).toBe(false);
        });

        test("missing password", () => {
            const result = registerSchema.safeParse({
                email: "user@example.com",
                confirm_password: validPassword
            });
            expect(result.success).toBe(false);
        });

        test("empty body", () => {
            const result = registerSchema.safeParse({});
            expect(result.success).toBe(false);
        });

        test("empty email string", () => {
            const result = registerSchema.safeParse({
                email: "",
                password: validPassword,
                confirm_password: validPassword
            });
            expect(result.success).toBe(false);
        });

        test("mismatched passwords", () => {
            const result = registerSchema.safeParse({
                email: "user@example.com",
                password: validPassword,
                confirm_password: "differentpass1"
            });
            expect(result.success).toBe(false);
            const issues = (result as any).error.issues;
            expect(issues[0].path).toContain("confirm_password");
            expect(issues[0].message).toBe("Passwords do not match");
        });

        test("missing confirm_password", () => {
            const result = registerSchema.safeParse({
                email: "user@example.com",
                password: validPassword
            });
            expect(result.success).toBe(false);
        });

        test("confirm_password too short (under 8 characters)", () => {
            const result = registerSchema.safeParse({
                email: "user@example.com",
                password: validPassword,
                confirm_password: "short"
            });
            expect(result.success).toBe(false);
        });
    });

    describe("loginSchema", () => {
        test("valid login data", () => {
            const result = loginSchema.safeParse({
                email: "user@example.com",
                password: "password"
            });
            expect(result.success).toBe(true);
        });

        test("invalid email", () => {
            const result = loginSchema.safeParse({
                email: "not-email",
                password: "password"
            });
            expect(result.success).toBe(false);
        });

        test("empty password", () => {
            const result = loginSchema.safeParse({
                email: "user@example.com",
                password: ""
            });
            expect(result.success).toBe(false);
        });

        test("missing email", () => {
            const result = loginSchema.safeParse({
                password: "password"
            });
            expect(result.success).toBe(false);
        });

        test("missing password", () => {
            const result = loginSchema.safeParse({
                email: "user@example.com"
            });
            expect(result.success).toBe(false);
        });
    });
});

describe("Article Schemas", () => {
    describe("createArticleSchema", () => {
        const validArticle = {
            title: "Test Article",
            tags: ["dermatology"],
            content: "Article content here",
            timeToRead: 5,
            authorName: "Dr. Test"
        };

        test("valid minimal article", () => {
            const result = createArticleSchema.safeParse(validArticle);
            expect(result.success).toBe(true);
        });

        test("valid article with all optional fields", () => {
            const result = createArticleSchema.safeParse({
                ...validArticle,
                authorTitle: "Dermatologist"
            });
            expect(result.success).toBe(true);
        });

        test("missing title", () => {
            const result = createArticleSchema.safeParse({
                ...validArticle,
                title: ""
            });
            expect(result.success).toBe(false);
        });

        test("empty tags array", () => {
            const result = createArticleSchema.safeParse({
                ...validArticle,
                tags: []
            });
            expect(result.success).toBe(false);
        });

        test("missing content", () => {
            const result = createArticleSchema.safeParse({
                ...validArticle,
                content: ""
            });
            expect(result.success).toBe(false);
        });

        test("timeToRead must be positive", () => {
            const result = createArticleSchema.safeParse({
                ...validArticle,
                timeToRead: 0
            });
            expect(result.success).toBe(false);
        });

        test("timeToRead must be integer", () => {
            const result = createArticleSchema.safeParse({
                ...validArticle,
                timeToRead: 5.5
            });
            expect(result.success).toBe(false);
        });

        test("missing required fields returns multiple issues", () => {
            const result = createArticleSchema.safeParse({});
            expect(result.success).toBe(false);
            if (!result.success) {
                const paths = result.error.issues.map(i => i.path[0]);
                expect(paths).toContain("title");
                expect(paths).toContain("tags");
                expect(paths).toContain("content");
                expect(paths).toContain("timeToRead");
                expect(paths).toContain("authorName");
            }
        });
    });

    describe("updateArticleSchema", () => {
        test("partial update with single field", () => {
            const result = updateArticleSchema.safeParse({ title: "New Title" });
            expect(result.success).toBe(true);
        });

        test("empty object is valid (all fields optional)", () => {
            const result = updateArticleSchema.safeParse({});
            expect(result.success).toBe(true);
        });

        test("can update tags", () => {
            const result = updateArticleSchema.safeParse({ tags: ["new-tag"] });
            expect(result.success).toBe(true);
        });

        test("invalid field type (string instead of number for timeToRead)", () => {
            const result = updateArticleSchema.safeParse({ timeToRead: "five" });
            expect(result.success).toBe(false);
        });
    });
});

describe("Prediction Schemas", () => {
    describe("createPredictionSchema", () => {
        test("valid anatomical site", () => {
            const result = createPredictionSchema.safeParse({ anatomical_site: "head/neck" });
            expect(result.success).toBe(true);
        });

        test("all valid anatomical sites", () => {
            const sites = [
                "head/neck", "torso", "upper extremity", "lower extremity",
                "palms/soles", "oral/genital", "anterior torso",
                "posterior torso", "lateral torso"
            ];
            for (const site of sites) {
                const result = createPredictionSchema.safeParse({ anatomical_site: site });
                expect(result.success).toBe(true);
            }
        });

        test("invalid anatomical site", () => {
            const result = createPredictionSchema.safeParse({ anatomical_site: "invalid-site" });
            expect(result.success).toBe(false);
        });

        test("empty string as site", () => {
            const result = createPredictionSchema.safeParse({ anatomical_site: "" });
            expect(result.success).toBe(false);
        });

        test("missing anatomical_site", () => {
            const result = createPredictionSchema.safeParse({});
            expect(result.success).toBe(false);
        });
    });

    describe("historyQuerySchema", () => {
        test("default values when not provided", () => {
            const result = historyQuerySchema.safeParse({});
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.limit).toBe(10);
                expect(result.data.offset).toBe(0);
            }
        });

        test("custom limit and offset as strings", () => {
            const result = historyQuerySchema.safeParse({ limit: "20", offset: "5" });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.limit).toBe(20);
                expect(result.data.offset).toBe(5);
            }
        });

        test("limit cannot exceed 100", () => {
            const result = historyQuerySchema.safeParse({ limit: "200" });
            expect(result.success).toBe(false);
        });

        test("limit cannot be less than 1", () => {
            const result = historyQuerySchema.safeParse({ limit: "0" });
            expect(result.success).toBe(false);
        });

        test("offset cannot be negative", () => {
            const result = historyQuerySchema.safeParse({ offset: "-1" });
            expect(result.success).toBe(false);
        });

        test("non-numeric limit string", () => {
            const result = historyQuerySchema.safeParse({ limit: "abc" });
            expect(result.success).toBe(false);
        });

        test("limit at boundary (1)", () => {
            const result = historyQuerySchema.safeParse({ limit: "1" });
            expect(result.success).toBe(true);
            if (result.success) expect(result.data.limit).toBe(1);
        });

        test("limit at boundary (100)", () => {
            const result = historyQuerySchema.safeParse({ limit: "100" });
            expect(result.success).toBe(true);
            if (result.success) expect(result.data.limit).toBe(100);
        });
    });
});
