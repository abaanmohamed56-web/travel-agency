import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";
import {
  addContactNoteSchema,
  updateContactSchema,
} from "@/modules/raalhu/lib/validation";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** Edits a contact's fields; a stage change is auto-logged as an activity. */
export async function PATCH(request: Request, { params }: RouteContext) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;
  const { id } = await params;

  const existing = await prisma.contact.findFirst({
    where: { id, organizationId: raalhu.org.id },
  });
  if (!existing) return Response.json({ error: "not_found" }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = updateContactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const data = parsed.data;

  try {
    const contact = await prisma.$transaction(async (tx) => {
      const updated = await tx.contact.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name || null }),
          ...(data.email !== undefined && { email: data.email || null }),
          ...(data.phone !== undefined && { phone: data.phone || null }),
          ...(data.company !== undefined && { company: data.company || null }),
          ...(data.stage !== undefined && { stage: data.stage }),
          ...(data.source !== undefined && { source: data.source || null }),
          ...(data.tags !== undefined && { tags: data.tags }),
        },
      });

      if (data.stage && data.stage !== existing.stage) {
        await tx.contactActivity.create({
          data: {
            organizationId: raalhu.org.id,
            contactId: id,
            type: "STAGE_CHANGE",
            body: `${existing.stage} → ${data.stage}`,
            actorUserId: raalhu.user.id,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          organizationId: raalhu.org.id,
          actorUserId: raalhu.user.id,
          action: "contact.updated",
          targetType: "Contact",
          targetId: id,
          metadata: data,
        },
      });

      return updated;
    });
    return Response.json({ contact });
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

/** Adds a note to the contact's activity timeline. */
export async function POST(request: Request, { params }: RouteContext) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;
  const { id } = await params;

  const existing = await prisma.contact.findFirst({
    where: { id, organizationId: raalhu.org.id },
  });
  if (!existing) return Response.json({ error: "not_found" }, { status: 404 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = addContactNoteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const activity = await prisma.contactActivity.create({
    data: {
      organizationId: raalhu.org.id,
      contactId: id,
      type: "NOTE",
      body: parsed.data.body,
      actorUserId: raalhu.user.id,
    },
  });

  return Response.json({ activity }, { status: 201 });
}
