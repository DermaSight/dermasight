import prisma from "@/lib/prisma";

const TokenBlacklistModel = {
    add: (jti: string, expiresAt: Date) =>
        prisma.tokenBlacklist.create({ data: { jti, expiresAt } }),

    isBlacklisted: async (jti: string) => {
        const entry = await prisma.tokenBlacklist.findUnique({ where: { jti } });
        return entry !== null && entry.expiresAt > new Date();
    },

    cleanExpired: () =>
        prisma.tokenBlacklist.deleteMany({ where: { expiresAt: { lt: new Date() } } })
};

export default TokenBlacklistModel;
