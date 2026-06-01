import { describe, test, expect, mock } from "bun:test";
import { requireRole } from "@/middlewares/auth";
import { UnauthorizedError, ForbiddenError } from "@/utils/customErrors";

function makeReq(role?: string) {
    return {
        user: role ? { sub: "user-1", email: "test@example.com", role } : undefined,
    } as any;
}

describe("requireRole middleware", () => {
    test("calls next() when role matches ADMIN", () => {
        const req = makeReq("ADMIN");
        const next = mock(() => {});
        requireRole("ADMIN")(req, {} as any, next);
        expect(next).toHaveBeenCalled();
    });

    test("calls next() when role matches MEMBER", () => {
        const req = makeReq("MEMBER");
        const next = mock(() => {});
        requireRole("MEMBER")(req, {} as any, next);
        expect(next).toHaveBeenCalled();
    });

    test("calls next() when multiple roles accepted and user has one", () => {
        const req = makeReq("MEMBER");
        const next = mock(() => {});
        requireRole("MEMBER", "ADMIN")(req, {} as any, next);
        expect(next).toHaveBeenCalled();
    });

    test("throws ForbiddenError when MEMBER hits ADMIN guard", () => {
        const req = makeReq("MEMBER");
        expect(() => requireRole("ADMIN")(req, {} as any, () => {})).toThrow(ForbiddenError);
    });

    test("throws ForbiddenError with correct message", () => {
        const req = makeReq("MEMBER");
        expect(() => requireRole("ADMIN")(req, {} as any, () => {})).toThrow("Insufficient permissions");
    });

    test("throws ForbiddenError when role does not match any accepted role", () => {
        const req = makeReq("MEMBER");
        expect(() => requireRole("ADMIN", "SUPER_ADMIN")(req, {} as any, () => {})).toThrow(ForbiddenError);
    });

    test("throws UnauthorizedError when req.user is undefined", () => {
        const req = makeReq();
        expect(() => requireRole("ADMIN")(req, {} as any, () => {})).toThrow(UnauthorizedError);
    });

    test("throws UnauthorizedError with correct message when unauthenticated", () => {
        const req = makeReq();
        expect(() => requireRole("ADMIN")(req, {} as any, () => {})).toThrow("Not authenticated");
    });

    test("ForbiddenError has statusCode 403", () => {
        const req = makeReq("MEMBER");
        try {
            requireRole("ADMIN")(req, {} as any, () => {});
        } catch (e: any) {
            expect(e.statusCode).toBe(403);
        }
    });

    test("UnauthorizedError has statusCode 401", () => {
        const req = makeReq();
        try {
            requireRole("ADMIN")(req, {} as any, () => {});
        } catch (e: any) {
            expect(e.statusCode).toBe(401);
        }
    });
});
