import prisma from "@/lib/prisma";

const RefreshTokenModel = {
    create: (data: { tokenHash: string; userId: string; expiresAt: Date }) =>
        prisma.refreshToken.create({ data }),

    findByTokenHash: (tokenHash: string) =>
        prisma.refreshToken.findUnique({ where: { tokenHash } }),

    deleteByTokenHash: (tokenHash: string) => prisma.refreshToken.delete({ where: { tokenHash } }),

    deleteAllForUser: (userId: string) => prisma.refreshToken.deleteMany({ where: { userId } })
};

export default RefreshTokenModel;
