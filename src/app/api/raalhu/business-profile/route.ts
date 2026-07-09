import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";
import { updateBusinessProfileSchema } from "@/modules/raalhu/lib/validation";

/** Edits the caller's active organization's business profile — what the AI team knows. */
export async function PATCH(request: Request) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = updateBusinessProfileSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const data = parsed.data;

  const profile = await prisma.$transaction(async (tx) => {
    const updated = await tx.businessProfile.upsert({
      where: { organizationId: raalhu.org.id },
      create: {
        organizationId: raalhu.org.id,
        businessName: data.businessName ?? raalhu.org.name,
        industry: data.industry || null,
        description: data.description || null,
        targetAudience: data.targetAudience || null,
        brandVoice: data.brandVoice || null,
        websiteUrl: data.websiteUrl || null,
        goals: data.goals ?? [],
      },
      update: {
        ...(data.businessName !== undefined && { businessName: data.businessName }),
        ...(data.industry !== undefined && { industry: data.industry || null }),
        ...(data.description !== undefined && { description: data.description || null }),
        ...(data.targetAudience !== undefined && {
          targetAudience: data.targetAudience || null,
        }),
        ...(data.brandVoice !== undefined && { brandVoice: data.brandVoice || null }),
        ...(data.websiteUrl !== undefined && { websiteUrl: data.websiteUrl || null }),
        ...(data.goals !== undefined && { goals: data.goals }),
      },
    });
    await tx.auditLog.create({
      data: {
        organizationId: raalhu.org.id,
        actorUserId: raalhu.user.id,
        action: "business_profile.updated",
        targetType: "BusinessProfile",
        targetId: updated.id,
        metadata: data,
      },
    });
    return updated;
  });

  return Response.json({ profile });
}
