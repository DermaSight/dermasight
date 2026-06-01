import { encrypt, decrypt } from "paseto-ts/v4";
import { requireEnv } from "@/utils/env";

const KEY = requireEnv("PASETO_SECRET_KEY");

const PasetoUtil = {
    createAccessToken: (payload: { sub: string; email: string; role: string }) => {
        const jti = crypto.randomUUID();
        const token = encrypt(KEY, { ...payload, jti, type: "access" });
        return { token, jti };
    },

    createRefreshToken: (payload: { sub: string; jti: string }) =>
        encrypt(KEY, { ...payload, type: "refresh", exp: "7 days" }),

    decrypt: <T extends Record<string, unknown>>(token: string) => decrypt<T>(KEY, token)
};

export default PasetoUtil;
