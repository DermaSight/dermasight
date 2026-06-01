import { Request, Response } from "express";
import fResponse from "@/utils/responseFormatter";
import UserModel from "@/models/User";
import RefreshTokenModel from "@/models/RefreshToken";
import TokenBlacklistModel from "@/models/TokenBlacklist";
import PasetoUtil from "@/lib/paseto";
import { BadRequestError, UnauthorizedError } from "@/utils/customErrors";
import type { PasetoAccessPayload, PasetoRefreshPayload } from "@/types/auth";

const REFRESH_COOKIE = "refreshToken";
const REFRESH_DAYS = 7;

const setRefreshCookie = (res: Response, token: string) => {
    res.cookie(REFRESH_COOKIE, token, {
        httpOnly: true,
        secure: process.env.ENVIRONMENT === "production",
        sameSite: "lax",
        path: "/api/auth",
        maxAge: REFRESH_DAYS * 24 * 60 * 60 * 1000,
        signed: true
    });
};

const clearRefreshCookie = (res: Response) => {
    res.clearCookie(REFRESH_COOKIE, { path: "/api/auth" });
};

const tryBlacklistAccessToken = async (header: string | undefined) => {
    if (!header?.startsWith("Bearer ")) return;
    try {
        const { payload } = PasetoUtil.decrypt<PasetoAccessPayload>(header.slice(7));
        if (payload.type === "access" && payload.jti) {
            await TokenBlacklistModel.add(payload.jti, new Date(payload.exp));
        }
    } catch {}
};

const tryDeleteRefreshToken = async (token: string | undefined) => {
    if (!token) return;
    try {
        const { payload } = PasetoUtil.decrypt<PasetoRefreshPayload>(token);
        await RefreshTokenModel.deleteByTokenHash(payload.jti);
    } catch {}
};

const createTokens = async (user: { id: string; email: string; role: string }) => {
    const { token: accessToken, jti: _jti } = PasetoUtil.createAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role
    });

    const refreshJti = crypto.randomUUID();
    const refreshToken = PasetoUtil.createRefreshToken({
        sub: user.id,
        jti: refreshJti
    });

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_DAYS);

    const stored = await RefreshTokenModel.create({
        tokenHash: refreshJti,
        userId: user.id,
        expiresAt
    });

    return { accessToken, refreshToken, refreshId: stored.id };
};

const AuthController = {
    register: async (req: Request, res: Response) => {
        const { email, password, name } = req.body;

        const existing = await UserModel.findByEmail(email);
        if (existing) {
            throw new BadRequestError("Email already in use");
        }

        const hashed = await Bun.password.hash(password, {
            algorithm: "argon2id"
        });

        const user = await UserModel.create({ email, password: hashed, name });
        const { accessToken, refreshToken } = await createTokens(user);

        setRefreshCookie(res, refreshToken);

        return fResponse({
            res,
            code: 201,
            message: "Account created",
            data: { user, accessToken }
        });
    },

    login: async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const user = await UserModel.findByEmail(email);
        if (!user) {
            throw new UnauthorizedError("Invalid email or password");
        }

        const valid = await Bun.password.verify(password, user.password);
        if (!valid) {
            throw new UnauthorizedError("Invalid email or password");
        }

        const { accessToken, refreshToken } = await createTokens(user);

        setRefreshCookie(res, refreshToken);

        return fResponse({
            res,
            code: 200,
            message: "Logged in",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                },
                accessToken
            }
        });
    },

    refresh: async (req: Request, res: Response) => {
        const token = req.signedCookies?.[REFRESH_COOKIE];
        if (!token) {
            throw new UnauthorizedError("No refresh token");
        }

        let payload: PasetoRefreshPayload;
        try {
            const result = PasetoUtil.decrypt<PasetoRefreshPayload>(token);
            payload = result.payload;
        } catch {
            clearRefreshCookie(res);
            throw new UnauthorizedError("Invalid or expired refresh token");
        }

        if (payload.type !== "refresh") {
            clearRefreshCookie(res);
            throw new UnauthorizedError("Invalid token type");
        }

        const stored = await RefreshTokenModel.findByTokenHash(payload.jti);
        if (!stored || stored.expiresAt < new Date()) {
            clearRefreshCookie(res);
            await RefreshTokenModel.deleteByTokenHash(payload.jti);
            throw new UnauthorizedError("Refresh token revoked or expired");
        }

        await RefreshTokenModel.deleteByTokenHash(payload.jti);

        const user = await UserModel.findById(stored.userId);
        if (!user) {
            throw new UnauthorizedError("User not found");
        }

        const { accessToken, refreshToken } = await createTokens(user);

        setRefreshCookie(res, refreshToken);

        return fResponse({
            res,
            code: 200,
            message: "Token refreshed",
            data: { accessToken }
        });
    },

    logout: async (req: Request, res: Response) => {
        await tryBlacklistAccessToken(req.headers.authorization);
        await tryDeleteRefreshToken(req.signedCookies?.[REFRESH_COOKIE]);

        clearRefreshCookie(res);

        return fResponse({
            res,
            code: 200,
            message: "Logged out",
            data: {}
        });
    },

    me: async (req: Request, res: Response) => {
        const user = await UserModel.findById(req.user!.sub);

        return fResponse({
            res,
            code: 200,
            message: "Authenticated",
            data: { user }
        });
    }
};

export default AuthController;
