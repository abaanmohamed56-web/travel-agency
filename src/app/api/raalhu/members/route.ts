import { assertRole, requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";
import { inviteMemberSchema } from "@/modules/raalhu/lib/validation";

/**
 * Adds an existing user to the caller's active organization. There is no
 * invite-by-email flow yet — the account must already exist.
 */
export async function POST(request: Request) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;
  const forbidden = assertRole(raalhu.membership, "ADMIN");
  if (forbidden) return forbidden;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = inviteMemberSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const { email, role } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return Response.json({ error: "user_not_found" }, { status: 404 });
  }

  try {
    const membership = await prisma.$transaction(async (tx) => {
      const created = await tx.membership.create({
        data: { organizationId: raalhu.org.id, userId: user.id, role },
        include: { user: { select: { id: true, name: true, email: true, image: true } } },
      });
      await tx.auditLog.create({
        data: {
          organizationId: raalhu.org.id,
          actorUserId: raalhu.user.id,
          action: "member.added",
          targetType: "Membership",
          targetId: created.id,
          metadata: { email, role },
        },
      });
      return created;
    });
    return Response.json({ membership }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return Response.json({ error: "already_a_member" }, { status: 409 });
    }
    throw error;
  }
}
