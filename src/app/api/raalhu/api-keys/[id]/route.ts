import { assertRole, requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** Revokes an API key. */
export async function DELETE(_request: Request, { params }: RouteContext) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;
  const forbidden = assertRole(raalhu.membership, "ADMIN");
  if (forbidden) return forbidden;
  const { id } = await params;

  const existing = await prisma.apiKey.findFirst({
    where: { id, organizationId: raalhu.org.id },
  });
  if (!existing) return Response.json({ error: "not_found" }, { status: 404 });

  await prisma.$transaction(async (tx) => {
    await tx.apiKey.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
    await tx.auditLog.create({
      data: {
        organizationId: raalhu.org.id,
        actorUserId: raalhu.user.id,
        action: "api_key.revoked",
        targetType: "ApiKey",
        targetId: id,
      },
    });
  });

  return Response.json({ ok: true });
}
