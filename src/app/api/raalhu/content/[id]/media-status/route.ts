import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";
import { refreshContentMedia } from "@/modules/raalhu/lib/media";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** Polled by the UI while image/video generation is in flight. */
export async function GET(_request: Request, { params }: RouteContext) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;
  const { id } = await params;

  const existing = await prisma.contentItem.findFirst({
    where: { id, organizationId: raalhu.org.id },
    select: { id: true },
  });
  if (!existing) return Response.json({ error: "not_found" }, { status: 404 });

  const contentItem = await refreshContentMedia(raalhu.org.id, id);
  return Response.json({ contentItem });
}
