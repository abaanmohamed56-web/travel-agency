import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";
import { generateMediaSchema } from "@/modules/raalhu/lib/validation";
import { generateContentVideo, MediaNotConfiguredError } from "@/modules/raalhu/lib/media";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * Starts video generation from a content item's existing image and returns
 * immediately (status PENDING) — video takes 1-3+ minutes, far longer than a
 * serverless function should hold a request open. The client polls
 * media-status for completion.
 */
export async function POST(request: Request, { params }: RouteContext) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;
  const { id } = await params;

  const existing = await prisma.contentItem.findFirst({
    where: { id, organizationId: raalhu.org.id },
  });
  if (!existing) return Response.json({ error: "not_found" }, { status: 404 });
  if (!existing.imageUrl) {
    return Response.json({ error: "no_image" }, { status: 400 });
  }

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // empty body is fine — prompt falls back below
  }
  const parsed = generateMediaSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const prompt = parsed.data.prompt || existing.body || existing.title;

  try {
    const contentItem = await generateContentVideo(raalhu.org.id, id, prompt);
    return Response.json({ contentItem });
  } catch (err) {
    if (err instanceof MediaNotConfiguredError) {
      return Response.json({ error: "not_configured" }, { status: 400 });
    }
    return Response.json({ error: "generation_failed" }, { status: 502 });
  }
}
