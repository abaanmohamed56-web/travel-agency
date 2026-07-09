import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** Marks a single notification as read. */
export async function PATCH(_request: Request, { params }: RouteContext) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;
  const { id } = await params;

  const existing = await prisma.raalhuNotification.findFirst({
    where: {
      id,
      organizationId: raalhu.org.id,
      OR: [{ userId: raalhu.user.id }, { userId: null }],
    },
  });
  if (!existing) return Response.json({ error: "not_found" }, { status: 404 });

  const notification = await prisma.raalhuNotification.update({
    where: { id },
    data: { readAt: existing.readAt ?? new Date() },
  });

  return Response.json({ notification });
}
