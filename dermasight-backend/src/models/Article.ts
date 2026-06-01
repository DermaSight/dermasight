import prisma from "@/lib/prisma";

const slugify = (title: string): string =>
    title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

const generateUniqueSlug = async (title: string): Promise<string> => {
    let slug = slugify(title);
    let suffix = 0;
    while (await prisma.article.findUnique({ where: { slug } })) {
        suffix++;
        slug = `${slugify(title)}-${suffix}`;
    }
    return slug;
};

const publicSelect = {
    id: true,
    title: true,
    slug: true,
    tags: true,
    content: true,
    image: true,
    timeToRead: true,
    authorName: true,
    authorTitle: true,
    authorImage: true,
    createdAt: true,
    updatedAt: true
} as const;

const ArticleModel = {
    findAll: () =>
        prisma.article.findMany({
            select: publicSelect,
            orderBy: { createdAt: "desc" }
        }),

    findBySlug: (slug: string) =>
        prisma.article.findUnique({
            where: { slug },
            select: publicSelect
        }),

    create: async (data: {
        title: string;
        tags: string[];
        content: string;
        image?: string;
        timeToRead: number;
        authorName: string;
        authorTitle?: string;
        authorImage?: string;
        userId?: string;
    }) => {
        const slug = await generateUniqueSlug(data.title);
        return prisma.article.create({
            data: { ...data, slug },
            select: publicSelect
        });
    },

    update: (
        slug: string,
        data: {
            title?: string;
            tags?: string[];
            content?: string;
            image?: string;
            timeToRead?: number;
            authorName?: string;
            authorTitle?: string;
            authorImage?: string;
        }
    ) =>
        prisma.article.update({
            where: { slug },
            data,
            select: publicSelect
        }),

    delete: (slug: string) => prisma.article.delete({ where: { slug } })
};

export default ArticleModel;
