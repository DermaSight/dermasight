import { mock } from "bun:test";

process.env.COOKIE_SECRET = "test-cookie-secret";
process.env.PASETO_SECRET_KEY = "k4.local.test-paseto-secret-key-for-testing";
process.env.MODEL_API_URL = "http://test-model-api.local";
process.env.R2_STORAGE_URL = "https://test-r2.local";
process.env.R2_ACCESS_KEY_ID = "test-key";
process.env.R2_SECRET_ACCESS_KEY = "test-secret";
process.env.ENVIRONMENT = "test";
process.env.HOST = "127.0.0.1";
process.env.PORT = "0";
process.env.SMTP_HOST = "smtp.test.com";
process.env.SMTP_PORT = "587";
process.env.SMTP_USER = "test@test.com";
process.env.SMTP_PASS = "test-pass";
process.env.CONTACT_EMAIL = "admin@dermasight.com,team@dermasight.com";

export const __mock__: Record<string, any> = {
    db: {
        healthy: true
    },
    mailer: {
        shouldThrow: false
    },
    user: {
        findByEmailResult: null as Record<string, unknown> | null,
        findByIdResult: null as Record<string, unknown> | null,
        createResult: null as Record<string, unknown> | null
    },
    paseto: {
        decryptPayload: {
            sub: "user-1",
            email: "test@example.com",
            role: "MEMBER",
            jti: "test-jti",
            type: "access",
            exp: new Date(Date.now() + 3600000).toISOString()
        },
        decryptShouldThrow: false,
        accessToken: "test-access-token",
        refreshToken: "test-refresh-token"
    },
    refreshToken: {
        findByTokenHashResult: null as Record<string, unknown> | null,
        createResult: null as Record<string, unknown> | null
    },
    blacklist: {
        isBlacklisted: false
    },
    article: {
        findAllResult: [] as Record<string, unknown>[],
        findBySlugResult: null as Record<string, unknown> | null,
        createResult: null as Record<string, unknown> | null,
        updateResult: null as Record<string, unknown> | null
    },
    prediction: {
        createResult: null as Record<string, unknown> | null,
        findByUserIdResult: [] as Record<string, unknown>[],
        countByUserIdResult: 0
    },
    s3: {
        shouldThrow: false,
        uploadUrl: "https://r2.test/image.jpg",
        presignedUrl: "https://r2.test/signed/image.jpg?signature=abc"
    },
    modelApi: {
        shouldThrow: false,
        hasAnalysis: false,
        response: {
            data: {
                predicted_class: "Melanoma",
                severity_label: "Severe",
                confidence: 92.5,
                combined_score: 0.85,
                malignancy_score: 0.78,
                site_risk_score: 0.65,
                area_pct: 45.2,
                inference_time_ms: 1234.56
            }
        }
    }
};

export function resetMocks() {
    __mock__.db.healthy = true;
    __mock__.mailer.shouldThrow = false;

    __mock__.user.findByEmailResult = null;
    __mock__.user.findByIdResult = null;
    __mock__.user.createResult = null;

    __mock__.paseto.decryptShouldThrow = false;
    __mock__.paseto.decryptPayload = {
        sub: "user-1",
        email: "test@example.com",
        role: "MEMBER",
        jti: "test-jti",
        type: "access",
        exp: new Date(Date.now() + 3600000).toISOString()
    };
    __mock__.paseto.accessToken = "test-access-token";
    __mock__.paseto.refreshToken = "test-refresh-token";

    __mock__.refreshToken.findByTokenHashResult = null;
    __mock__.refreshToken.createResult = null;

    __mock__.blacklist.isBlacklisted = false;

    __mock__.article.findAllResult = [];
    __mock__.article.findBySlugResult = null;
    __mock__.article.createResult = null;
    __mock__.article.updateResult = null;

    __mock__.prediction.createResult = null;
    __mock__.prediction.findByUserIdResult = [];
    __mock__.prediction.countByUserIdResult = 0;

    __mock__.s3.shouldThrow = false;
    __mock__.s3.uploadUrl = "https://r2.test/image.jpg";
    __mock__.s3.presignedUrl = "https://r2.test/signed/image.jpg?signature=abc";

    __mock__.modelApi.shouldThrow = false;
    __mock__.modelApi.hasAnalysis = false;
    __mock__.modelApi.response = {
        data: {
            predicted_class: "Melanoma",
            severity_label: "Severe",
            confidence: 92.5,
            combined_score: 0.85,
            malignancy_score: 0.78,
            site_risk_score: 0.65,
            area_pct: 45.2,
            inference_time_ms: 1234.56
        }
    };
}

mock.module("@/lib/prisma", () => ({
    default: {
        $queryRaw: async () => {
            if (!__mock__.db.healthy) throw new Error("DB connection failed");
            return [{ "?column?": 1 }];
        },
        $disconnect: async () => {},
        user: {
            findUnique: async (args: { where: { email?: string; id?: string } }) => {
                if (args.where?.email) return __mock__.user.findByEmailResult;
                if (args.where?.id) return __mock__.user.findByIdResult;
                return null;
            },
            create: async () => __mock__.user.createResult,
            update: async () => __mock__.user.findByIdResult
        },
        refreshToken: {
            create: async () => __mock__.refreshToken.createResult,
            findUnique: async () => {
                const result = __mock__.refreshToken.findByTokenHashResult;
                if (result && typeof result.expiresAt === "string") {
                    return { ...result, expiresAt: new Date(result.expiresAt) };
                }
                return result;
            },
            delete: async () => {},
            deleteMany: async () => {}
        },
        tokenBlacklist: {
            create: async () => {},
            findUnique: async () =>
                __mock__.blacklist.isBlacklisted
                    ? { jti: "test-jti", expiresAt: new Date(Date.now() + 3600000) }
                    : null,
            deleteMany: async () => {}
        },
        article: {
            findMany: async () => __mock__.article.findAllResult,
            findUnique: async () => __mock__.article.findBySlugResult,
            create: async () => __mock__.article.createResult,
            update: async () => __mock__.article.updateResult,
            delete: async () => {}
        },
        prediction: {
            create: async () => __mock__.prediction.createResult,
            findMany: async () => __mock__.prediction.findByUserIdResult,
            count: async () => __mock__.prediction.countByUserIdResult
        }
    }
}));

mock.module("@/lib/paseto", () => ({
    default: {
        createAccessToken: () => ({ token: __mock__.paseto.accessToken, jti: "mocked-access-jti" }),
        createRefreshToken: () => __mock__.paseto.refreshToken,
        decrypt: <T>(_token: string) => {
            if (__mock__.paseto.decryptShouldThrow) throw new Error("Decryption failed");
            return { payload: __mock__.paseto.decryptPayload as T };
        }
    }
}));

mock.module("@/lib/s3", () => ({
    uploadFileToBucket: async (_file: Express.Multer.File, _prefix?: string) => {
        if (__mock__.s3.shouldThrow) throw new Error("S3 upload failed: Network error");
        const prefix = _prefix ?? "predictions";
        return { key: `${prefix}/test-file-key`, url: __mock__.s3.uploadUrl };
    },
    getPresignedUrl: async (_key: string) => {
        if (__mock__.s3.shouldThrow) throw new Error("Failed to generate presigned URL");
        return __mock__.s3.presignedUrl;
    },
    signField: async (_obj: Record<string, string | null | undefined>, _field: string) => {
        if (!_obj[_field] || __mock__.s3.shouldThrow) return;
        _obj[_field] = __mock__.s3.presignedUrl;
    },
    default: {}
}));

mock.module("@/lib/modelApi", () => ({
    default: {
        post: async (_url: string, _data: unknown, _config?: unknown) => {
            if (__mock__.modelApi.shouldThrow) {
                const error = new Error("timeout") as any;
                error.code = "ECONNABORTED";
                error.isAxiosError = true;
                throw error;
            }
            const data = { ...__mock__.modelApi.response.data };
            if (__mock__.modelApi.hasAnalysis) {
                data.groq_analysis = {
                    available: true,
                    text: "Kanker kulit ini perlu perhatian khusus untuk pengobatan yang efektif.",
                    model: "llama-3.3-70b-versatile"
                };
            }
            return { data };
        },
        get: async () => ({ data: {} })
    }
}));

mock.module("@/utils/mailer", () => ({
    sendContactEmail: async (_subject: string, _content: string) => {
        if (__mock__.mailer.shouldThrow) throw new Error("SMTP connection failed");
    }
}));
