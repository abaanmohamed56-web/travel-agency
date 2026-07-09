-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_userId_fkey";

-- DropForeignKey
ALTER TABLE "JournalEntry" DROP CONSTRAINT "JournalEntry_userId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropIndex
DROP INDEX "User_stripeCustomerId_key";

-- DropIndex
DROP INDEX "User_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "plan",
DROP COLUMN "planExpiresAt",
DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeSubscriptionId";

-- DropTable
DROP TABLE "Course";

-- DropTable
DROP TABLE "Enrollment";

-- DropTable
DROP TABLE "JournalEntry";

-- DropTable
DROP TABLE "Lesson";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "Signal";

-- DropEnum
DROP TYPE "Plan";

-- DropEnum
DROP TYPE "SignalConfidence";

-- DropEnum
DROP TYPE "SignalStatus";

-- DropEnum
DROP TYPE "SignalType";

