const AUTH_URL = "https://www.tiktok.com/v2/auth/authorize/";
const API_BASE = "https://open.tiktokapis.com/v2";

const SCOPES = ["user.info.basic", "video.publish"].join(",");

export function isTiktokConfigured(): boolean {
  return !!process.env.TIKTOK_CLIENT_KEY && !!process.env.TIKTOK_CLIENT_SECRET;
}

function requireEnv() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  if (!clientKey || !clientSecret) {
    throw new Error("TIKTOK_CLIENT_KEY/TIKTOK_CLIENT_SECRET not configured");
  }
  return { clientKey, clientSecret };
}

export function getRedirectUri(): string {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${base}/api/raalhu/social/tiktok/callback`;
}

export function getTiktokAuthUrl(state: string): string {
  const { clientKey } = requireEnv();
  const params = new URLSearchParams({
    client_key: clientKey,
    scope: SCOPES,
    response_type: "code",
    redirect_uri: getRedirectUri(),
    state,
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export interface TiktokTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  openId: string;
}

async function tokenRequest(body: Record<string, string>): Promise<TiktokTokens> {
  const { clientKey, clientSecret } = requireEnv();
  const res = await fetch(`${API_BASE}/oauth/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cache-Control": "no-cache",
    },
    body: new URLSearchParams({ client_key: clientKey, client_secret: clientSecret, ...body }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data?.error_description ?? data?.error ?? `TikTok token error (${res.status})`);
  }
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in,
    openId: data.open_id,
  };
}

export function exchangeCodeForToken(code: string): Promise<TiktokTokens> {
  return tokenRequest({ code, grant_type: "authorization_code", redirect_uri: getRedirectUri() });
}

export function refreshAccessToken(refreshToken: string): Promise<TiktokTokens> {
  return tokenRequest({ refresh_token: refreshToken, grant_type: "refresh_token" });
}

async function apiPost(accessToken: string, path: string, body: unknown) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok || data.error?.code !== "ok") {
    throw new Error(data?.error?.message ?? `TikTok API error (${res.status})`);
  }
  return data.data;
}

/**
 * Unaudited apps are restricted to SELF_ONLY and see a limited set of
 * privacy_level_options — always check this before publishing rather than
 * assuming PUBLIC_TO_EVERYONE is available.
 */
async function pickPrivacyLevel(accessToken: string): Promise<string> {
  try {
    const info = await apiPost(accessToken, "/post/publish/creator_info/query/", {});
    const options: string[] = info?.privacy_level_options ?? [];
    if (options.includes("PUBLIC_TO_EVERYONE")) return "PUBLIC_TO_EVERYONE";
    if (options.length > 0) return options[0];
  } catch {
    // fall through to the safe default
  }
  return "SELF_ONLY";
}

export interface TiktokPublishResult {
  publishId: string;
}

/** Video only — PULL_FROM_URL requires the media host's domain to be verified in the TikTok developer portal. */
export async function publishVideoFromUrl(
  accessToken: string,
  videoUrl: string,
  title: string
): Promise<TiktokPublishResult> {
  const privacyLevel = await pickPrivacyLevel(accessToken);
  const result = await apiPost(accessToken, "/post/publish/video/init/", {
    post_info: {
      title,
      privacy_level: privacyLevel,
      disable_duet: false,
      disable_comment: false,
      disable_stitch: false,
    },
    source_info: {
      source: "PULL_FROM_URL",
      video_url: videoUrl,
    },
  });
  return { publishId: result.publish_id as string };
}

export interface TiktokStatus {
  status: string;
  postIds: string[];
  failReason: string | null;
}

export async function checkPublishStatus(
  accessToken: string,
  publishId: string
): Promise<TiktokStatus> {
  const result = await apiPost(accessToken, "/post/publish/status/fetch/", {
    publish_id: publishId,
  });
  return {
    status: result.status as string,
    postIds: (result.publicaly_available_post_id as string[] | undefined) ?? [],
    failReason: (result.fail_reason as string | undefined) ?? null,
  };
}
