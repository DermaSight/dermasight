-- CreateEnum
CREATE TYPE "dermasight"."UserRole" AS ENUM ('MEMBER', 'ADMIN');

-- AlterTable
ALTER TABLE "dermasight"."User" ADD COLUMN     "role" "dermasight"."UserRole" NOT NULL DEFAULT 'MEMBER';
