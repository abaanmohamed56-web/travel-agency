
-- CreateEnum
CREATE TYPE "SocialProvider" AS ENUM ('INSTAGRAM', 'TIKTOK');

-- AlterTable
ALTER TABLE "raalhu_content_items" ADD COLUMN     "externalPostId" TEXT,
ADD COLUMN     "externalPostUrl" TEXT,
ADD COLUMN     "publishError" TEXT,
ADD COLUMN     "publishStatus" "MediaStatus" NOT NULL DEFAULT 'NONE';

-- CreateTable
CREATE TABLE "raalhu_social_accounts" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "provider" "SocialProvider" NOT NULL,
    "externalAccountId" TEXT NOT NULL,
    "displayName" TEXT,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3),
    "connectedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raalhu_social_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "raalhu_social_accounts_organizationId_provider_key" ON "raalhu_social_accounts"("organizationId", "provider");

-- AddForeignKey
ALTER TABLE "raalhu_social_accounts" ADD CONSTRAINT "raalhu_social_accounts_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "raalhu_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

