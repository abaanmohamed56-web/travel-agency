import { randomBytes } from "node:crypto";
import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { getTiktokAuthUrl, isTiktokConfigured } from "@/lib/tiktok";

const STATE_COOKIE = "raalhu_tt_oauth_state";

export async function GET() {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;

  if (!isTiktokConfigured()) {
    return Response.json({ error: "not_configured" }, { status: 400 });
  }

  const state = randomBytes(16).toString("hex");
  return new Response(null, {
    status: 302,
    headers: {
      Location: getTiktokAuthUrl(state),
      "Set-Cookie": `${STATE_COOKIE}=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
