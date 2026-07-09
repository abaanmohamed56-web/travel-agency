import { prisma } from "@/lib/prisma";

/**
 * Org-scoped read helpers. Every query in this module MUST filter by
 * organizationId — it is the tenancy boundary for all Raalhu data.
 */

export function getBusinessProfile(organizationId: string) {
  return prisma.businessProfile.findUnique({ where: { organizationId } });
}

export function listCampaigns(organizationId: string) {
  return prisma.campaign.findMany({
    where: { organizationId },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { contentItems: true } } },
  });
}

export function getCampaign(organizationId: string, id: string) {
  return prisma.campaign.findFirst({
    where: { id, organizationId },
    include: {
      contentItems: { orderBy: [{ scheduledAt: "asc" }, { createdAt: "asc" }] },
    },
  });
}

export function listContentInRange(
  organizationId: string,
  from: Date,
  to: Date
) {
  return prisma.contentItem.findMany({
    where: { organizationId, scheduledAt: { gte: from, lte: to } },
    orderBy: { scheduledAt: "asc" },
    include: { campaign: { select: { id: true, name: true } } },
  });
}

export function listContacts(organizationId: string) {
  return prisma.contact.findMany({
    where: { organizationId },
    orderBy: { updatedAt: "desc" },
  });
}

export function listNotifications(organizationId: string, userId: string) {
  return prisma.raalhuNotification.findMany({
    where: { organizationId, OR: [{ userId }, { userId: null }] },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export function listConversations(organizationId: string) {
  return prisma.conversation.findMany({
    where: { organizationId },
    orderBy: { updatedAt: "desc" },
    take: 30,
  });
}

export function getConversationWithMessages(
  organizationId: string,
  id: string
) {
  return prisma.conversation.findFirst({
    where: { id, organizationId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
}

export function listAgentRuns(organizationId: string) {
  return prisma.agentRun.findMany({
    where: { organizationId },
    orderBy: { startedAt: "desc" },
    take: 25,
    include: { tasks: { orderBy: { startedAt: "asc" } } },
  });
}

export function listMembers(organizationId: string) {
  return prisma.membership.findMany({
    where: { organizationId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
  });
}

export function listUserMemberships(userId: string) {
  return prisma.membership.findMany({
    where: { userId },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });
}
