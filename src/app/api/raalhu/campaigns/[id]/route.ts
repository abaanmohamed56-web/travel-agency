import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";
import { updateCampaignSchema } from "@/modules/raalhu/lib/validation";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** Edits a campaign's fields, including its status. */
export async function PATCH(request: Request, { params }: RouteContext) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;
  const { id } = await params;

  const existing = await prisma.campaign.findFirst({
    where: { id, organizationId: raalhu.org.id },
  });
  if (!existing) return Response.json({ error: "not_found" }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = updateCampaignSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const campaign = await prisma.$transaction(async (tx) => {
    const updated = await tx.campaign.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.objective !== undefined && { objective: data.objective || null }),
        ...(data.channels !== undefined && { channels: data.channels }),
        ...(data.budget !== undefined && { budget: data.budget }),
        ...(data.startDate !== undefined && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && { endDate: new Date(data.endDate) }),
        ...(data.status !== undefined && { status: data.status }),
      },
    });
    await tx.auditLog.create({
      data: {
        organizationId: raalhu.org.id,
        actorUserId: raalhu.user.id,
        action: "campaign.updated",
        targetType: "Campaign",
        targetId: id,
        metadata: data,
      },
    });
    return updated;
  });

  return Response.json({ campaign });
}
