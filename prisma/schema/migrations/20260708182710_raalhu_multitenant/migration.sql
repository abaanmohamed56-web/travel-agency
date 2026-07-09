-- CreateEnum
CREATE TYPE "RaalhuPlan" AS ENUM ('FREE', 'STARTER', 'GROWTH', 'SCALE');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "RaalhuChatRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM', 'TOOL');

-- CreateEnum
CREATE TYPE "RunStatus" AS ENUM ('RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('SOCIAL_POST', 'BLOG_POST', 'EMAIL', 'AD_COPY', 'SCRIPT', 'OTHER');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('IDEA', 'DRAFT', 'REVIEW', 'APPROVED', 'SCHEDULED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "LeadStage" AS ENUM ('LEAD', 'MQL', 'SQL', 'CUSTOMER', 'CHURNED');

-- CreateTable
CREATE TABLE "raalhu_organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plan" "RaalhuPlan" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raalhu_organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raalhu_memberships" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raalhu_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raalhu_business_profiles" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "industry" TEXT,
    "description" TEXT,
    "targetAudience" TEXT,
    "brandVoice" TEXT,
    "websiteUrl" TEXT,
    "goals" JSONB,
    "socialLinks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raalhu_business_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raalhu_conversations" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raalhu_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raalhu_chat_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "RaalhuChatRole" NOT NULL,
    "content" JSONB NOT NULL,
    "agentId" TEXT,
    "agentRunId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raalhu_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raalhu_agent_runs" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "conversationId" TEXT,
    "triggeredById" TEXT NOT NULL,
    "status" "RunStatus" NOT NULL DEFAULT 'RUNNING',
    "rootAgentId" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "raalhu_agent_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raalhu_agent_tasks" (
    "id" TEXT NOT NULL,
    "agentRunId" TEXT NOT NULL,
    "parentTaskId" TEXT,
    "agentId" TEXT NOT NULL,
    "status" "RunStatus" NOT NULL DEFAULT 'RUNNING',
    "input" JSONB NOT NULL,
    "output" JSONB,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "raalhu_agent_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raalhu_campaigns" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT,
    "name" TEXT NOT NULL,
    "objective" TEXT,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "channels" TEXT[],
    "budget" DECIMAL(12,2),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "brief" JSONB,
    "createdByAgent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raalhu_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raalhu_content_items" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "campaignId" TEXT,
    "createdById" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "contentType" "ContentType" NOT NULL DEFAULT 'SOCIAL_POST',
    "channel" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "timezone" TEXT,
    "metadata" JSONB,
    "createdByAgent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raalhu_content_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raalhu_contacts" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "company" TEXT,
    "stage" "LeadStage" NOT NULL DEFAULT 'LEAD',
    "source" TEXT,
    "tags" TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raalhu_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raalhu_notifications" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "type" TEXT NOT NULL DEFAULT 'info',
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raalhu_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raalhu_audit_logs" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actorAgentId" TEXT,
    "action" TEXT NOT NULL,
    "targetType" TEXT,
    "targetId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raalhu_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "raalhu_api_keys" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hashedKey" TEXT NOT NULL,
    "lastFour" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "lastUsedAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "raalhu_api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "raalhu_organizations_slug_key" ON "raalhu_organizations"("slug");

-- CreateIndex
CREATE INDEX "raalhu_memberships_userId_idx" ON "raalhu_memberships"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "raalhu_memberships_organizationId_userId_key" ON "raalhu_memberships"("organizationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "raalhu_business_profiles_organizationId_key" ON "raalhu_business_profiles"("organizationId");

-- CreateIndex
CREATE INDEX "raalhu_conversations_organizationId_updatedAt_idx" ON "raalhu_conversations"("organizationId", "updatedAt");

-- CreateIndex
CREATE INDEX "raalhu_chat_messages_conversationId_createdAt_idx" ON "raalhu_chat_messages"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "raalhu_agent_runs_organizationId_startedAt_idx" ON "raalhu_agent_runs"("organizationId", "startedAt");

-- CreateIndex
CREATE INDEX "raalhu_agent_tasks_agentRunId_idx" ON "raalhu_agent_tasks"("agentRunId");

-- CreateIndex
CREATE INDEX "raalhu_campaigns_organizationId_status_idx" ON "raalhu_campaigns"("organizationId", "status");

-- CreateIndex
CREATE INDEX "raalhu_content_items_organizationId_scheduledAt_idx" ON "raalhu_content_items"("organizationId", "scheduledAt");

-- CreateIndex
CREATE INDEX "raalhu_content_items_organizationId_status_idx" ON "raalhu_content_items"("organizationId", "status");

-- CreateIndex
CREATE INDEX "raalhu_contacts_organizationId_stage_idx" ON "raalhu_contacts"("organizationId", "stage");

-- CreateIndex
CREATE UNIQUE INDEX "raalhu_contacts_organizationId_email_key" ON "raalhu_contacts"("organizationId", "email");

-- CreateIndex
CREATE INDEX "raalhu_notifications_organizationId_userId_createdAt_idx" ON "raalhu_notifications"("organizationId", "userId", "createdAt");

-- CreateIndex
CREATE INDEX "raalhu_audit_logs_organizationId_createdAt_idx" ON "raalhu_audit_logs"("organizationId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "raalhu_api_keys_hashedKey_key" ON "raalhu_api_keys"("hashedKey");

-- AddForeignKey
ALTER TABLE "raalhu_memberships" ADD CONSTRAINT "raalhu_memberships_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "raalhu_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raalhu_memberships" ADD CONSTRAINT "raalhu_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raalhu_business_profiles" ADD CONSTRAINT "raalhu_business_profiles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "raalhu_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raalhu_conversations" ADD CONSTRAINT "raalhu_conversations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "raalhu_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raalhu_chat_messages" ADD CONSTRAINT "raalhu_chat_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "raalhu_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raalhu_agent_runs" ADD CONSTRAINT "raalhu_agent_runs_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "raalhu_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raalhu_agent_runs" ADD CONSTRAINT "raalhu_agent_runs_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "raalhu_conversations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raalhu_agent_tasks" ADD CONSTRAINT "raalhu_agent_tasks_agentRunId_fkey" FOREIGN KEY ("agentRunId") REFERENCES "raalhu_agent_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raalhu_campaigns" ADD CONSTRAINT "raalhu_campaigns_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "raalhu_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raalhu_content_items" ADD CONSTRAINT "raalhu_content_items_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "raalhu_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raalhu_content_items" ADD CONSTRAINT "raalhu_content_items_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "raalhu_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raalhu_contacts" ADD CONSTRAINT "raalhu_contacts_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "raalhu_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raalhu_notifications" ADD CONSTRAINT "raalhu_notifications_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "raalhu_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raalhu_audit_logs" ADD CONSTRAINT "raalhu_audit_logs_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "raalhu_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "raalhu_api_keys" ADD CONSTRAINT "raalhu_api_keys_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "raalhu_organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
