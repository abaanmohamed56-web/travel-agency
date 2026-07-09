import { requireRaalhuApiContext } from "@/modules/raalhu/auth/context";
import {
  exchangeCodeForToken,
  exchangeForLongLivedToken,
  fetchInstagramAccount,
} from "@/lib/meta";
import { upsertInstagramAccount } from "@/modules/raalhu/lib/social";

const STATE_COOKIE = "raalhu_ig_oauth_state";
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
    return Response.redirect(`${url.origin}${SETTINGS_URL}&error=instagram_state_mismatch`, 302);
  }

  try {
    const shortLivedToken = await exchangeCodeForToken(code);
    const { accessToken } = await exchangeForLongLivedToken(shortLivedToken);
    const account = await fetchInstagramAccount(accessToken);
    if (!account) {
      return Response.redirect(`${url.origin}${SETTINGS_URL}&error=instagram_no_business_account`, 302);
    }
    await upsertInstagramAccount(
      raalhu.org.id,
      raalhu.user.id,
      account.igUserId,
      account.username,
      account.pageAccessToken
    );
    return Response.redirect(`${url.origin}${SETTINGS_URL}&connected=instagram`, 302);
  } catch {
    return Response.redirect(`${url.origin}${SETTINGS_URL}&error=instagram_connect_failed`, 302);
  }
}
