import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";
import { createContactSchema } from "@/modules/raalhu/lib/validation";

/** Creates a CRM contact in the caller's active organization. */
export async function POST(request: Request) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = createContactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const { name, email, phone, company, stage, source, tags } = parsed.data;

  try {
    const contact = await prisma.$transaction(async (tx) => {
      const created = await tx.contact.create({
        data: {
          organizationId: raalhu.org.id,
          name: name || null,
          email: email || null,
          phone: phone || null,
          company: company || null,
          stage,
          source: source || null,
          tags: tags ?? [],
        },
      });
      await tx.auditLog.create({
        data: {
          organizationId: raalhu.org.id,
          actorUserId: raalhu.user.id,
          action: "contact.created",
          targetType: "Contact",
          targetId: created.id,
          metadata: { name: name ?? null, email: email ?? null },
        },
      });
      return created;
    });
    return Response.json({ contact }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return Response.json({ error: "email_exists" }, { status: 409 });
    }
    throw error;
  }
}
