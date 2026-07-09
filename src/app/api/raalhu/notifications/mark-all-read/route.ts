import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";

/** Marks every unread notification visible to the caller as read. */
export async function POST() {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;

  const result = await prisma.raalhuNotification.updateMany({
    where: {
      organizationId: raalhu.org.id,
      OR: [{ userId: raalhu.user.id }, { userId: null }],
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  return Response.json({ count: result.count });
}
