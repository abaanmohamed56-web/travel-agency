
-- CreateEnum
CREATE TYPE "ContactActivityType" AS ENUM ('NOTE', 'STAGE_CHANGE', 'EMAIL', 'CALL');

-- CreateTable
CREATE TABLE "raalhu_contact_activity" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "type" "ContactActivityType" NOT NULL,
    "body" TEXT,
    "actorUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raalhu_contact_activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "raalhu_contact_activity_contactId_createdAt_idx" ON "raalhu_contact_activity"("contactId", "createdAt");

-- AddForeignKey
ALTER TABLE "raalhu_contact_activity" ADD CONSTRAINT "raalhu_contact_activity_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "raalhu_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

