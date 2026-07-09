import { assertRole, requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";
import { updateMemberRoleSchema } from "@/modules/raalhu/lib/validation";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** Changes a member's role. OWNER memberships can't be modified through this route. */
export async function PATCH(request: Request, { params }: RouteContext) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;
  const forbidden = assertRole(raalhu.membership, "ADMIN");
  if (forbidden) return forbidden;
  const { id } = await params;

  const existing = await prisma.membership.findFirst({
    where: { id, organizationId: raalhu.org.id },
  });
  if (!existing) return Response.json({ error: "not_found" }, { status: 404 });
  if (existing.role === "OWNER") {
    return Response.json({ error: "cannot_modify_owner" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = updateMemberRoleSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const membership = await prisma.$transaction(async (tx) => {
    const updated = await tx.membership.update({
      where: { id },
      data: { role: parsed.data.role },
    });
    await tx.auditLog.create({
      data: {
        organizationId: raalhu.org.id,
        actorUserId: raalhu.user.id,
        action: "member.role_changed",
        targetType: "Membership",
        targetId: id,
        metadata: { role: parsed.data.role },
      },
    });
    return updated;
  });

  return Response.json({ membership });
}

/** Removes a member from the organization. OWNER memberships can't be removed. */
export async function DELETE(_request: Request, { params }: RouteContext) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;
  const forbidden = assertRole(raalhu.membership, "ADMIN");
  if (forbidden) return forbidden;
  const { id } = await params;

  const existing = await prisma.membership.findFirst({
    where: { id, organizationId: raalhu.org.id },
  });
  if (!existing) return Response.json({ error: "not_found" }, { status: 404 });
  if (existing.role === "OWNER") {
    return Response.json({ error: "cannot_remove_owner" }, { status: 400 });
  }

  await prisma.$transaction(async (tx) => {
    await tx.membership.delete({ where: { id } });
    await tx.auditLog.create({
      data: {
        organizationId: raalhu.org.id,
        actorUserId: raalhu.user.id,
        action: "member.removed",
        targetType: "Membership",
        targetId: id,
      },
    });
  });

  return Response.json({ ok: true });
}
