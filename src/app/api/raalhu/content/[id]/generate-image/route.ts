import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { prisma } from "@/lib/prisma";
import { generateMediaSchema } from "@/modules/raalhu/lib/validation";
import { generateContentImage, MediaNotConfiguredError } from "@/modules/raalhu/lib/media";

// generateContentImage polls briefly (up to ~20s) for a synchronous-feeling
// result before falling back to PENDING.
export const maxDuration = 60;

interface RouteContext {
  params: Promise<{ id: string }>;
}

/** Starts image generation for a content item. Runs to completion (Soul text-to-image is fast). */
export async function POST(request: Request, { params }: RouteContext) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;
  const { id } = await params;

  const existing = await prisma.contentItem.findFirst({
    where: { id, organizationId: raalhu.org.id },
  });
  if (!existing) return Response.json({ error: "not_found" }, { status: 404 });

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    // empty body is fine — prompt falls back to the content item's title/body below
  }
  const parsed = generateMediaSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const prompt =
    parsed.data.prompt || existing.body || existing.title;

  try {
    const contentItem = await generateContentImage(raalhu.org.id, id, prompt);
    return Response.json({ contentItem });
  } catch (err) {
    if (err instanceof MediaNotConfiguredError) {
      return Response.json({ error: "not_configured" }, { status: 400 });
    }
    return Response.json({ error: "generation_failed" }, { status: 502 });
  }
}
