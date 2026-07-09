import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";
import { createCampaignSchema } from "@/modules/raalhu/lib/validation";

/** Creates a campaign in the caller's active organization. */
export async function POST(request: Request) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = createCampaignSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const { name, objective, channels, budget, startDate, endDate } = parsed.data;

  const campaign = await prisma.$transaction(async (tx) => {
    const created = await tx.campaign.create({
      data: {
        organizationId: raalhu.org.id,
        createdById: raalhu.user.id,
        name,
        objective: objective || null,
        channels: channels ?? [],
        budget: budget ?? null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    });
    await tx.auditLog.create({
      data: {
        organizationId: raalhu.org.id,
        actorUserId: raalhu.user.id,
        action: "campaign.created",
        targetType: "Campaign",
        targetId: created.id,
        metadata: { name },
      },
    });
    return created;
  });

  return Response.json({ campaign }, { status: 201 });
}
