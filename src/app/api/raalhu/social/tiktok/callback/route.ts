import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import { exchangeCodeForToken } from "@/lib/tiktok";
import { upsertTiktokAccount } from "@/modules/raalhu/lib/social";

const STATE_COOKIE = "raalhu_tt_oauth_state";
const SETTINGS_URL = "/raalhu/dashboard/settings?tab=social";

function getCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie") ?? "";
  const match = header.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export async function GET(request: Request) {
  const raalhu = await requireRaalhuApiContext();
  if (raalhu instanceof Response) return raalhu;

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = getCookie(request, STATE_COOKIE);

  if (!code || !state || !cookieState || state !== cookieState) {
    return Response.redirect(`${url.origin}${SETTINGS_URL}&error=tiktok_state_mismatch`, 302);
  }

  try {
    const tokens = await exchangeCodeForToken(code);
    await upsertTiktokAccount(raalhu.org.id, raalhu.user.id, tokens);
    return Response.redirect(`${url.origin}${SETTINGS_URL}&connected=tiktok`, 302);
  } catch {
    return Response.redirect(`${url.origin}${SETTINGS_URL}&error=tiktok_connect_failed`, 302);
  }
}
