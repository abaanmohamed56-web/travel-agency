import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";
import { publishContentItem, SocialNotConnectedError } from "@/modules/raalhu/lib/social";

// TikTok's publish flow includes a short bounded status poll.
export const maxDuration = 60;

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_request: Request, { params }: RouteContext) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;
  const { id } = await params;

  const existing = await prisma.contentItem.findFirst({
    where: { id, organizationId: raalhu.org.id },
  });
  if (!existing) return Response.json({ error: "not_found" }, { status: 404 });

  try {
    const contentItem = await publishContentItem(raalhu.org.id, id);
    return Response.json({ contentItem });
  } catch (err) {
    if (err instanceof SocialNotConnectedError) {
      return Response.json({ error: "not_connected" }, { status: 400 });
    }
    if (err instanceof Error && err.message === "unsupported_channel") {
      return Response.json({ error: "unsupported_channel" }, { status: 400 });
    }
    return Response.json({ error: "publish_failed" }, { status: 502 });
  }
}
