
-- CreateEnum
CREATE TYPE "MediaStatus" AS ENUM ('NONE', 'PENDING', 'READY', 'FAILED');

-- AlterTable
ALTER TABLE "raalhu_content_items" ADD COLUMN     "imageJobId" TEXT,
ADD COLUMN     "imagePrompt" TEXT,
ADD COLUMN     "imageStatus" "MediaStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "mediaError" TEXT,
ADD COLUMN     "videoJobId" TEXT,
ADD COLUMN     "videoPrompt" TEXT,
ADD COLUMN     "videoStatus" "MediaStatus" NOT NULL DEFAULT 'NONE',
ADD COLUMN     "videoUrl" TEXT;

