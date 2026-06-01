-- CreateTable
CREATE TABLE "dermasight"."Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "tags" TEXT[],
    "content" TEXT NOT NULL,
    "image" TEXT,
    "timeToRead" INTEGER NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorTitle" TEXT,
    "authorImage" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "dermasight"."Article"("slug");

-- AddForeignKey
ALTER TABLE "dermasight"."Article" ADD CONSTRAINT "Article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "dermasight"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
