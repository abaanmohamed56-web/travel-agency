import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";
import { updateContentItemSchema } from "@/modules/raalhu/lib/validation";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** Edits a content item's fields, including its status. */
export async function PATCH(request: Request, { params }: RouteContext) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;
  const { id } = await params;

  const existing = await prisma.contentItem.findFirst({
    where: { id, organizationId: raalhu.org.id },
  });
  if (!existing) return Response.json({ error: "not_found" }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = updateContentItemSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const data = parsed.data;

  if (data.campaignId) {
    const campaign = await prisma.campaign.findFirst({
      where: { id: data.campaignId, organizationId: raalhu.org.id },
      select: { id: true },
    });
    if (!campaign) {
      return Response.json({ error: "campaign_not_found" }, { status: 400 });
    }
  }

  const contentItem = await prisma.$transaction(async (tx) => {
    const updated = await tx.contentItem.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.body !== undefined && { body: data.body || null }),
        ...(data.contentType !== undefined && { contentType: data.contentType }),
        ...(data.channel !== undefined && { channel: data.channel || null }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.scheduledAt !== undefined && {
          scheduledAt: new Date(data.scheduledAt),
        }),
        ...(data.campaignId !== undefined && { campaignId: data.campaignId }),
      },
    });
    await tx.auditLog.create({
      data: {
        organizationId: raalhu.org.id,
        actorUserId: raalhu.user.id,
        action: "content.updated",
        targetType: "ContentItem",
        targetId: id,
        metadata: data,
      },
    });
    return updated;
  });

  return Response.json({ contentItem });
}
