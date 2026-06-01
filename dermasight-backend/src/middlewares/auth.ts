import { Request, Response, NextFunction, RequestHandler } from "express";
import { UnauthorizedError, ForbiddenError } from "@/utils/customErrors";
import PasetoUtil from "@/lib/paseto";
import TokenBlacklistModel from "@/models/TokenBlacklist";
import { PasetoClaimInvalid } from "paseto-ts/lib/errors";
import type { PasetoAccessPayload } from "@/types/auth";

type AuthResult =
    | { ok: true; payload: PasetoAccessPayload }
    | { ok: false; error: Error };

const authenticate = async (req: Request): Promise<AuthResult> => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        return { ok: false, error: new UnauthorizedError("Not authenticated") };
    }

    try {
        const { payload } = PasetoUtil.decrypt<PasetoAccessPayload>(header.slice(7));

        if (payload.type !== "access") {
            return { ok: false, error: new UnauthorizedError("Invalid token type") };
        }

        if (await TokenBlacklistModel.isBlacklisted(payload.jti)) {
            return { ok: false, error: new UnauthorizedError("Token has been revoked") };
        }

        return { ok: true, payload };
    } catch (err) {
        if (err instanceof PasetoClaimInvalid) {
            return { ok: false, error: new UnauthorizedError("Token expired") };
        }
        return { ok: false, error: new UnauthorizedError("Invalid token") };
    }
};

const setUser = (req: Request, payload: PasetoAccessPayload) => {
    req.user = { sub: payload.sub, email: payload.email, role: payload.role };
};

const requireAuth: RequestHandler = async (req, _res, next) => {
    const result = await authenticate(req);
    if (!result.ok) throw result.error;
    setUser(req, result.payload);
    next();
};

const optionalAuth: RequestHandler = async (req, _res, next) => {
    const result = await authenticate(req);
    if (result.ok) setUser(req, result.payload);
    next();
};

const requireRole = (...roles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) throw new UnauthorizedError("Not authenticated");
        if (!roles.includes(req.user.role)) throw new ForbiddenError("Insufficient permissions");
        next();
    };
};

export default requireAuth;
export { optionalAuth, requireRole };
