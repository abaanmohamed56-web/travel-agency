
-- CreateTable
CREATE TABLE "raalhu_autopilot_settings" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "postsPerDay" INTEGER NOT NULL DEFAULT 2,
    "videosPerDay" INTEGER NOT NULL DEFAULT 1,
    "channels" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lastRunAt" TIMESTAMP(3),
    "lastRunStatus" TEXT,
    "lastRunError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raalhu_autopilot_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "raalhu_autopilot_settings_organizationId_key" ON "raalhu_autopilot_settings"("organizationId");

-- AddForeignKey
ALTER TABLE "raalhu_autopilot_settings" ADD CONSTRAINT "raalhu_autopilot_settings_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "raalhu_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

