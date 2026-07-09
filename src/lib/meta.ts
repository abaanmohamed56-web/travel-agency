const GRAPH_API = "https://graph.facebook.com/v21.0";
const OAUTH_DIALOG = "https://www.facebook.com/v21.0/dialog/oauth";

const SCOPES = [
  "instagram_basic",
  "instagram_content_publish",
  "pages_show_list",
  "pages_read_engagement",
  "business_management",
].join(",");

export function isMetaConfigured(): boolean {
  return !!process.env.META_APP_ID && !!process.env.META_APP_SECRET;
}

function requireEnv() {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  if (!appId || !appSecret) throw new Error("META_APP_ID/META_APP_SECRET not configured");
  return { appId, appSecret };
}

export function getRedirectUri(): string {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${base}/api/raalhu/social/instagram/callback`;
}

export function getInstagramAuthUrl(state: string): string {
  const { appId } = requireEnv();
  const params = new URLSearchParams({
    client_id: appId,
    redirect_uri: getRedirectUri(),
    state,
    scope: SCOPES,
    response_type: "code",
  });
  return `${OAUTH_DIALOG}?${params.toString()}`;
}

async function graphGet(path: string, params: Record<string, string>) {
  const url = new URL(`${GRAPH_API}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString());
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? `Meta Graph API error (${res.status})`);
  }
  return data;
}

async function graphPost(path: string, params: Record<string, string>) {
  const url = new URL(`${GRAPH_API}${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), { method: "POST" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message ?? `Meta Graph API error (${res.status})`);
  }
  return data;
}

export async function exchangeCodeForToken(code: string): Promise<string> {
  const { appId, appSecret } = requireEnv();
  const data = await graphGet("/oauth/access_token", {
    client_id: appId,
    client_secret: appSecret,
    redirect_uri: getRedirectUri(),
    code,
  });
  return data.access_token as string;
}

export async function exchangeForLongLivedToken(
  shortLivedToken: string
): Promise<{ accessToken: string; expiresIn: number }> {
  const { appId, appSecret } = requireEnv();
  const data = await graphGet("/oauth/access_token", {
    grant_type: "fb_exchange_token",
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: shortLivedToken,
  });
  return { accessToken: data.access_token as string, expiresIn: data.expires_in as number };
}

export interface InstagramAccount {
  igUserId: string;
  username: string;
  pageAccessToken: string;
}

/** Finds the first Facebook Page (of this user) with a linked Instagram Business account. */
export async function fetchInstagramAccount(
  userAccessToken: string
): Promise<InstagramAccount | null> {
  const pages = await graphGet("/me/accounts", {
    access_token: userAccessToken,
    fields: "id,name,access_token,instagram_business_account",
  });
  for (const page of pages.data ?? []) {
    if (page.instagram_business_account?.id) {
      const igUserId = page.instagram_business_account.id as string;
      const account = await graphGet(`/${igUserId}`, {
        access_token: page.access_token,
        fields: "username",
      });
      return {
        igUserId,
        username: account.username as string,
        pageAccessToken: page.access_token as string,
      };
    }
  }
  return null;
}

async function pollContainerStatus(containerId: string, accessToken: string): Promise<void> {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    const status = await graphGet(`/${containerId}`, {
      access_token: accessToken,
      fields: "status_code",
    });
    if (status.status_code === "FINISHED") return;
    if (status.status_code === "ERROR") {
      throw new Error("Instagram media container processing failed");
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }
  throw new Error("Timed out waiting for Instagram media container to process");
}

export interface PublishResult {
  postId: string;
  permalink: string | null;
}

async function publishContainer(
  igUserId: string,
  containerId: string,
  accessToken: string
): Promise<PublishResult> {
  const published = await graphPost(`/${igUserId}/media_publish`, {
    creation_id: containerId,
    access_token: accessToken,
  });
  const postId = published.id as string;
  let permalink: string | null = null;
  try {
    const details = await graphGet(`/${postId}`, {
      access_token: accessToken,
      fields: "permalink",
    });
    permalink = (details.permalink as string) ?? null;
  } catch {
    // permalink lookup is best-effort
  }
  return { postId, permalink };
}

export async function publishImage(
  igUserId: string,
  accessToken: string,
  imageUrl: string,
  caption: string
): Promise<PublishResult> {
  const container = await graphPost(`/${igUserId}/media`, {
    image_url: imageUrl,
    caption,
    access_token: accessToken,
  });
  return publishContainer(igUserId, container.id as string, accessToken);
}

export async function publishReel(
  igUserId: string,
  accessToken: string,
  videoUrl: string,
  caption: string
): Promise<PublishResult> {
  const container = await graphPost(`/${igUserId}/media`, {
    media_type: "REELS",
    video_url: videoUrl,
    caption,
    access_token: accessToken,
  });
  const containerId = container.id as string;
  await pollContainerStatus(containerId, accessToken);
  return publishContainer(igUserId, containerId, accessToken);
}
