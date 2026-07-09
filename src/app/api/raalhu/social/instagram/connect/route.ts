import { randomBytes } from "node:crypto";
import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { getInstagramAuthUrl, isMetaConfigured } from "@/lib/meta";

const STATE_COOKIE = "raalhu_ig_oauth_state";

export async function GET() {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;

  if (!isMetaConfigured()) {
    return Response.json({ error: "not_configured" }, { status: 400 });
  }

  // Response.redirect() returns an immutable Response, so build this one by
  // hand — we also need to set the state cookie on the same response.
  const state = randomBytes(16).toString("hex");
  return new Response(null, {
    status: 302,
    headers: {
      Location: getInstagramAuthUrl(state),
      "Set-Cookie": `${STATE_COOKIE}=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
