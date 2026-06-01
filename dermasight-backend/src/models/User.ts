import prisma from "@/lib/prisma";

const publicSelect = {
    id: true,
    email: true,
    name: true,
    role: true,
    createdAt: true,
    updatedAt: true
} as const;

const UserModel = {
    findById: (id: string) =>
        prisma.user.findUnique({
            where: { id },
            select: publicSelect
        }),

    findByEmail: (email: string) => prisma.user.findUnique({ where: { email } }),

    create: (data: { email: string; password: string; name?: string }) =>
        prisma.user.create({
            data,
            select: publicSelect
        }),

    update: (id: string, data: { name?: string; email?: string }) =>
        prisma.user.update({
            where: { id },
            data,
            select: publicSelect
        })
};

export default UserModel;
