import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";
import { createContentItemSchema } from "@/modules/raalhu/lib/validation";

/** Creates a content item (calendar entry) in the caller's active organization. */
export async function POST(request: Request) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = createContentItemSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const { title, body: contentBody, contentType, channel, status, scheduledAt, campaignId } =
    parsed.data;

  if (campaignId) {
    const campaign = await prisma.campaign.findFirst({
      where: { id: campaignId, organizationId: raalhu.org.id },
      select: { id: true },
    });
    if (!campaign) {
      return Response.json({ error: "campaign_not_found" }, { status: 400 });
    }
  }

  const contentItem = await prisma.$transaction(async (tx) => {
    const created = await tx.contentItem.create({
      data: {
        organizationId: raalhu.org.id,
        createdById: raalhu.user.id,
        campaignId: campaignId ?? null,
        title,
        body: contentBody || null,
        contentType,
        channel: channel || null,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      },
    });
    await tx.auditLog.create({
      data: {
        organizationId: raalhu.org.id,
        actorUserId: raalhu.user.id,
        action: "content.created",
        targetType: "ContentItem",
        targetId: created.id,
        metadata: { title },
      },
    });
    return created;
  });

  return Response.json({ contentItem }, { status: 201 });
}
