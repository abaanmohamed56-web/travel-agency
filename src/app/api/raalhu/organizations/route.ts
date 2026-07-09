import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createOrganizationSchema,
  slugify,
} from "@/modules/raalhu/lib/validation";

/** Creates an organization with the caller as OWNER, plus its business profile. */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return Response.json({ error: "unauthenticated" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = createOrganizationSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const { name, profile } = parsed.data;

  // Ensure a unique slug, appending a numeric suffix on collision.
  const base = parsed.data.slug || slugify(name);
  let slug = base;
  for (let i = 2; ; i++) {
    const existing = await prisma.organization.findUnique({ where: { slug } });
    if (!existing) break;
    if (i > 50) {
      return Response.json({ error: "slug_unavailable" }, { status: 409 });
    }
    slug = `${base}-${i}`;
  }

  const organization = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({ data: { name, slug } });
    await tx.membership.create({
      data: { organizationId: org.id, userId, role: "OWNER" },
    });
    await tx.businessProfile.create({
      data: {
        organizationId: org.id,
        businessName: profile.businessName,
        industry: profile.industry || null,
        description: profile.description || null,
        targetAudience: profile.targetAudience || null,
        brandVoice: profile.brandVoice || null,
        websiteUrl: profile.websiteUrl || null,
        goals: profile.goals ?? [],
      },
    });
    await tx.auditLog.create({
      data: {
        organizationId: org.id,
        actorUserId: userId,
        action: "organization.created",
        targetType: "Organization",
        targetId: org.id,
        metadata: { name, slug },
      },
    });
    return org;
  });

  return Response.json(
    { organization: { id: organization.id, name, slug } },
    { status: 201 }
  );
}
