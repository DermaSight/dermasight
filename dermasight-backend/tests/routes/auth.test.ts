import { describe, test, expect, beforeAll, afterAll, beforeEach } from "bun:test";
import { startTestServer, stopTestServer } from "@/tests/helpers/testServer";
import { parseResponse } from "@/tests/helpers/response";
import { __mock__, resetMocks } from "@/tests/setup";
import crypto from "crypto";

let baseURL: string;
let hashedPassword: string;
const testPassword = "securepass123";

function signCookie(value: string): string {
    const sig = crypto
        .createHmac("sha256", "test-cookie-secret")
        .update(value)
        .digest("base64")
        .replace(/=+$/, "");
    return `s:${value}.${sig}`;
}

beforeAll(async () => {
    baseURL = await startTestServer();
    hashedPassword = await Bun.password.hash(testPassword, { algorithm: "argon2id" });
});

afterAll(async () => {
    await stopTestServer();
});

beforeEach(() => {
    resetMocks();
});

const defaultUser = {
    id: "user-1",
    email: "test@example.com",
    name: "Test User",
    password: "",
    role: "MEMBER",
    createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
};

const defaultUserPublic = {
    id: "user-1",
    email: "test@example.com",
    name: "Test User",
    role: "MEMBER",
    createdAt: new Date("2024-01-01T00:00:00Z").toISOString(),
    updatedAt: new Date("2024-01-01T00:00:00Z").toISOString(),
};

const defaultRefreshToken = {
    id: "rt-1",
    tokenHash: "test-jti",
    userId: "user-1",
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POST /auth/register
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
describe("POST /auth/register", () => {
    test("creates account and returns 201 with user + accessToken + refresh cookie", async () => {
        __mock__.user.findByEmailResult = null;
        __mock__.user.createResult = defaultUserPublic;
        __mock__.refreshToken.createResult = defaultRefreshToken;

        const res = await fetch(`${baseURL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "new@example.com", password: testPassword, confirm_password: testPassword, name: "New" })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(201);
        expect(body.status).toBe("success");
        expect(body.message).toBe("Account created");
        expect(body.data.user).toBeDefined();
        expect(body.data.user.email).toBe("test@example.com");
        expect(body.data.user.role).toBe("MEMBER");
        expect(body.data.user).not.toHaveProperty("password");
        expect(body.data.accessToken).toBe("test-access-token");

        const cookies = res.headers.getSetCookie();
        expect(cookies.length).toBeGreaterThan(0);
        expect(cookies[0]).toContain("refreshToken");
    });

    test("returns 400 when email already in use", async () => {
        __mock__.user.findByEmailResult = defaultUser;

        const res = await fetch(`${baseURL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "existing@example.com", password: testPassword, confirm_password: testPassword })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Email already in use");
    });

    test("returns 400 for invalid email format", async () => {
        const res = await fetch(`${baseURL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "not-email", password: testPassword, confirm_password: testPassword })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Validation failed");
    });

    test("returns 400 for short password", async () => {
        const res = await fetch(`${baseURL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "user@example.com", password: "short", confirm_password: "short" })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
    });

    test("returns 400 when passwords do not match", async () => {
        const res = await fetch(`${baseURL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "user@example.com", password: testPassword, confirm_password: "differentpass1" })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Validation failed");
    });

    test("returns 400 for missing required fields", async () => {
        const res = await fetch(`${baseURL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({})
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(400);
        expect(body.status).toBe("failed");
    });

    test("registration without name still succeeds", async () => {
        __mock__.user.findByEmailResult = null;
        __mock__.user.createResult = { ...defaultUserPublic, name: null };
        __mock__.refreshToken.createResult = defaultRefreshToken;

        const res = await fetch(`${baseURL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "noname@example.com", password: testPassword, confirm_password: testPassword })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(201);
        expect(body.status).toBe("success");
        expect(body.data.user.role).toBe("MEMBER");
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POST /auth/login
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
describe("POST /auth/login", () => {
    test("logs in with valid credentials", async () => {
        __mock__.user.findByEmailResult = { ...defaultUser, password: hashedPassword };
        __mock__.user.findByIdResult = defaultUserPublic;
        __mock__.refreshToken.createResult = defaultRefreshToken;

        const res = await fetch(`${baseURL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "test@example.com", password: testPassword })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
        expect(body.data.user).toBeDefined();
        expect(body.data.user.role).toBe("MEMBER");
        expect(body.data.user).not.toHaveProperty("password");
        expect(body.data.accessToken).toBe("test-access-token");

        const cookies = res.headers.getSetCookie();
        expect(cookies.length).toBeGreaterThan(0);
        expect(cookies[0]).toContain("refreshToken");
    });

    test("returns 401 for non-existent email", async () => {
        __mock__.user.findByEmailResult = null;

        const res = await fetch(`${baseURL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "noone@example.com", password: testPassword })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(401);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Invalid email or password");
    });

    test("returns 401 for wrong password", async () => {
        __mock__.user.findByEmailResult = { ...defaultUser, password: hashedPassword };

        const res = await fetch(`${baseURL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "test@example.com", password: "wrongpassword" })
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(401);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Invalid email or password");
    });

    test("error message is identical for wrong email vs wrong password (no oracle)", async () => {
        // Wrong email
        __mock__.user.findByEmailResult = null;
        const res1 = await fetch(`${baseURL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "noone@example.com", password: testPassword })
        });
        const body1 = await parseResponse(res1);

        // Wrong password
        __mock__.user.findByEmailResult = { ...defaultUser, password: hashedPassword };
        const res2 = await fetch(`${baseURL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "test@example.com", password: "wrongpassword" })
        });
        const body2 = await parseResponse(res2);

        expect(body1.message).toBe(body2.message);
        expect(body1.status).toBe(body2.status);
    });

    test("returns 400 for invalid email format", async () => {
        const res = await fetch(`${baseURL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "not-email", password: testPassword })
        });
        expect(res.status).toBe(400);
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POST /auth/refresh
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
describe("POST /auth/refresh", () => {
    test("refreshes tokens with valid cookie", async () => {
        __mock__.paseto.decryptPayload = {
            sub: "user-1",
            email: "test@example.com",
            role: "MEMBER",
            jti: "valid-jti",
            type: "refresh",
            exp: new Date(Date.now() + 3600000).toISOString()
        };
        __mock__.refreshToken.findByTokenHashResult = {
            ...defaultRefreshToken,
            tokenHash: "valid-jti",
        };
        __mock__.user.findByIdResult = defaultUserPublic;
        __mock__.refreshToken.createResult = defaultRefreshToken;

        const res = await fetch(`${baseURL}/auth/refresh`, {
            method: "POST",
            headers: { Cookie: `refreshToken=${encodeURIComponent(signCookie("valid-refresh-token"))}` }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
        expect(body.data.accessToken).toBe("test-access-token");

        const cookies = res.headers.getSetCookie();
        expect(cookies.length).toBeGreaterThan(0);
        expect(cookies[0]).toContain("refreshToken");
    });

    test("returns 401 when no refresh cookie present", async () => {
        const res = await fetch(`${baseURL}/auth/refresh`, { method: "POST" });
        const body = await parseResponse(res);

        expect(res.status).toBe(401);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("No refresh token");
    });

    test("returns 401 when decrypt fails (invalid/expired token)", async () => {
        __mock__.paseto.decryptShouldThrow = true;

        const res = await fetch(`${baseURL}/auth/refresh`, {
            method: "POST",
            headers: { Cookie: `refreshToken=${encodeURIComponent(signCookie("invalid-token"))}` }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(401);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Invalid or expired refresh token");
    });

    test("returns 401 when token type is not 'refresh'", async () => {
        __mock__.paseto.decryptPayload = {
            sub: "user-1",
            email: "test@example.com",
            role: "MEMBER",
            jti: "acc-jti",
            type: "access",
            exp: new Date(Date.now() + 3600000).toISOString()
        };

        const res = await fetch(`${baseURL}/auth/refresh`, {
            method: "POST",
            headers: { Cookie: `refreshToken=${encodeURIComponent(signCookie("access-token"))}` }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(401);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Invalid token type");
    });

    test("returns 401 when stored token not found", async () => {
        __mock__.paseto.decryptPayload = {
            sub: "user-1",
            email: "test@example.com",
            role: "MEMBER",
            jti: "missing-jti",
            type: "refresh",
            exp: new Date(Date.now() + 3600000).toISOString()
        };
        __mock__.refreshToken.findByTokenHashResult = null;

        const res = await fetch(`${baseURL}/auth/refresh`, {
            method: "POST",
            headers: { Cookie: `refreshToken=${encodeURIComponent(signCookie("valid-refresh-token"))}` }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(401);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Refresh token revoked or expired");
    });

    test("returns 401 when stored token is expired", async () => {
        __mock__.paseto.decryptPayload = {
            sub: "user-1",
            email: "test@example.com",
            role: "MEMBER",
            jti: "expired-jti",
            type: "refresh",
            exp: new Date(Date.now() + 3600000).toISOString()
        };
        __mock__.refreshToken.findByTokenHashResult = {
            ...defaultRefreshToken,
            tokenHash: "expired-jti",
            expiresAt: new Date(Date.now() - 1000).toISOString(),
        };

        const res = await fetch(`${baseURL}/auth/refresh`, {
            method: "POST",
            headers: { Cookie: `refreshToken=${encodeURIComponent(signCookie("expired-refresh-token"))}` }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(401);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Refresh token revoked or expired");
    });

    test("returns 401 when user no longer exists", async () => {
        __mock__.paseto.decryptPayload = {
            sub: "deleted-user",
            email: "deleted@example.com",
            role: "MEMBER",
            jti: "valid-jti",
            type: "refresh",
            exp: new Date(Date.now() + 3600000).toISOString()
        };
        __mock__.refreshToken.findByTokenHashResult = {
            ...defaultRefreshToken,
            userId: "deleted-user",
            tokenHash: "valid-jti",
        };
        __mock__.user.findByIdResult = null;

        const res = await fetch(`${baseURL}/auth/refresh`, {
            method: "POST",
            headers: { Cookie: `refreshToken=${encodeURIComponent(signCookie("valid-refresh-token"))}` }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(401);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("User not found");
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POST /auth/logout
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
describe("POST /auth/logout", () => {
    test("logs out with valid access token and refresh cookie", async () => {
        const res = await fetch(`${baseURL}/auth/logout`, {
            method: "POST",
            headers: {
                Authorization: "Bearer test-access-token",
                Cookie: `refreshToken=${encodeURIComponent(signCookie("valid-refresh-token"))}`
            }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
        expect(body.message).toBe("Logged out");

        const cookies = res.headers.getSetCookie();
        const clearCookie = cookies.find(c => c.startsWith("refreshToken="));
        expect(clearCookie).toBeDefined();
    });

    test("logs out without any tokens", async () => {
        const res = await fetch(`${baseURL}/auth/logout`, { method: "POST" });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
    });

    test("logs out with invalid access token (graceful handling)", async () => {
        __mock__.paseto.decryptShouldThrow = true;

        const res = await fetch(`${baseURL}/auth/logout`, {
            method: "POST",
            headers: { Authorization: "Bearer invalid-token" }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
    });

    test("logs out with already-revoked token (graceful handling)", async () => {
        const res = await fetch(`${baseURL}/auth/logout`, {
            method: "POST",
            headers: { Authorization: "Bearer revoked-token" }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
    });

    test("clears refresh cookie on logout", async () => {
        const res = await fetch(`${baseURL}/auth/logout`, {
            method: "POST",
            headers: { Cookie: `refreshToken=${encodeURIComponent(signCookie("valid-refresh-token"))}` }
        });

        const cookies = res.headers.getSetCookie();
        expect(cookies.length).toBeGreaterThan(0);
        const clearCookie = cookies[0]!;
        expect(clearCookie).toContain("refreshToken=;");
    });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GET /auth/me
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
describe("GET /auth/me", () => {
    test("returns authenticated user with valid token", async () => {
        __mock__.user.findByIdResult = defaultUserPublic;

        const res = await fetch(`${baseURL}/auth/me`, {
            headers: { Authorization: "Bearer test-access-token" }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(200);
        expect(body.status).toBe("success");
        expect(body.data.user).toBeDefined();
        expect(body.data.user.email).toBe("test@example.com");
        expect(body.data.user.role).toBe("MEMBER");
        expect(body.data.user).not.toHaveProperty("password");
    });

    test("returns 401 without Authorization header", async () => {
        const res = await fetch(`${baseURL}/auth/me`);
        const body = await parseResponse(res);

        expect(res.status).toBe(401);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Not authenticated");
    });

    test("returns 401 with malformed Authorization header", async () => {
        const res = await fetch(`${baseURL}/auth/me`, {
            headers: { Authorization: "NotBearer token" }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(401);
        expect(body.status).toBe("failed");
    });

    test("returns 401 with empty Bearer token", async () => {
        const res = await fetch(`${baseURL}/auth/me`, {
            headers: { Authorization: "Bearer " }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(401);
        expect(body.status).toBe("failed");
    });

    test("returns 401 when token is expired", async () => {
        __mock__.paseto.decryptShouldThrow = true;

        const res = await fetch(`${baseURL}/auth/me`, {
            headers: { Authorization: "Bearer expired-token" }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(401);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Invalid token");
    });

    test("returns 401 when token is blacklisted/revoked", async () => {
        __mock__.blacklist.isBlacklisted = true;

        const res = await fetch(`${baseURL}/auth/me`, {
            headers: { Authorization: "Bearer revoked-token" }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(401);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Token has been revoked");
    });

    test("returns 401 when token type is refresh (not access)", async () => {
        __mock__.paseto.decryptPayload = {
            sub: "user-1",
            email: "test@example.com",
            role: "MEMBER",
            jti: "refresh-jti",
            type: "refresh",
            exp: new Date(Date.now() + 3600000).toISOString()
        };

        const res = await fetch(`${baseURL}/auth/me`, {
            headers: { Authorization: "Bearer refresh-token-used-as-access" }
        });
        const body = await parseResponse(res);

        expect(res.status).toBe(401);
        expect(body.status).toBe("failed");
        expect(body.message).toBe("Invalid token type");
    });
});
