import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { disconnectAccount } from "@/modules/raalhu/lib/social";

interface RouteContext {
  params: Promise<{ provider: string }>;
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;
  const { provider } = await params;

  const normalized = provider.toUpperCase();
  if (normalized !== "INSTAGRAM" && normalized !== "TIKTOK") {
    return Response.json({ error: "invalid_provider" }, { status: 400 });
  }

  await disconnectAccount(raalhu.org.id, normalized);
  return Response.json({ ok: true });
}
