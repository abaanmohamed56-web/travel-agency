import { prisma } from "@/lib/prisma";
import { encryptSecret, decryptSecret } from "@/lib/crypto";
import * as meta from "@/lib/meta";
import * as tiktok from "@/lib/tiktok";
import type { SocialProvider } from "@prisma/client";

export class SocialNotConnectedError extends Error {
  constructor(provider: string) {
    super(`No ${provider} account connected for this workspace.`);
    this.name = "SocialNotConnectedError";
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function upsertInstagramAccount(
  organizationId: string,
  connectedById: string,
  igUserId: string,
  username: string,
  pageAccessToken: string
) {
  return prisma.socialAccount.upsert({
    where: { organizationId_provider: { organizationId, provider: "INSTAGRAM" } },
    create: {
      organizationId,
      provider: "INSTAGRAM",
      externalAccountId: igUserId,
      displayName: username,
      accessToken: encryptSecret(pageAccessToken),
      connectedById,
    },
    update: {
      externalAccountId: igUserId,
      displayName: username,
      accessToken: encryptSecret(pageAccessToken),
      connectedById,
    },
  });
}

export async function upsertTiktokAccount(
  organizationId: string,
  connectedById: string,
  tokens: tiktok.TiktokTokens,
  displayName?: string
) {
  const expiresAt = new Date(Date.now() + tokens.expiresIn * 1000);
  return prisma.socialAccount.upsert({
    where: { organizationId_provider: { organizationId, provider: "TIKTOK" } },
    create: {
      organizationId,
      provider: "TIKTOK",
      externalAccountId: tokens.openId,
      displayName: displayName ?? null,
      accessToken: encryptSecret(tokens.accessToken),
      refreshToken: encryptSecret(tokens.refreshToken),
      expiresAt,
      connectedById,
    },
    update: {
      externalAccountId: tokens.openId,
      displayName: displayName ?? null,
      accessToken: encryptSecret(tokens.accessToken),
      refreshToken: encryptSecret(tokens.refreshToken),
      expiresAt,
      connectedById,
    },
  });
}

export function listConnectedAccounts(organizationId: string) {
  return prisma.socialAccount.findMany({
    where: { organizationId },
    select: { id: true, provider: true, displayName: true, externalAccountId: true, createdAt: true },
  });
}

export async function disconnectAccount(organizationId: string, provider: SocialProvider) {
  await prisma.socialAccount.deleteMany({ where: { organizationId, provider } });
}

function channelToProvider(channel: string | null): SocialProvider | null {
  const c = (channel ?? "").toLowerCase();
  if (c.includes("instagram")) return "INSTAGRAM";
  if (c.includes("tiktok")) return "TIKTOK";
  return null;
}

async function getFreshTiktokAccessToken(
  account: NonNullable<Awaited<ReturnType<typeof prisma.socialAccount.findUnique>>>
): Promise<string> {
  const accessToken = decryptSecret(account.accessToken);
  if (account.expiresAt && account.expiresAt.getTime() - Date.now() > 5 * 60 * 1000) {
    return accessToken;
  }
  if (!account.refreshToken) return accessToken;
  const refreshed = await tiktok.refreshAccessToken(decryptSecret(account.refreshToken));
  await prisma.socialAccount.update({
    where: { id: account.id },
    data: {
      accessToken: encryptSecret(refreshed.accessToken),
      refreshToken: encryptSecret(refreshed.refreshToken),
      expiresAt: new Date(Date.now() + refreshed.expiresIn * 1000),
    },
  });
  return refreshed.accessToken;
}

/** Publishes a content item to whichever connected account matches its channel. */
export async function publishContentItem(organizationId: string, contentItemId: string) {
  const item = await prisma.contentItem.findFirst({
    where: { id: contentItemId, organizationId },
  });
  if (!item) throw new Error("content_item_not_found");

  const provider = channelToProvider(item.channel);
  if (!provider) throw new Error("unsupported_channel");

  const account = await prisma.socialAccount.findUnique({
    where: { organizationId_provider: { organizationId, provider } },
  });
  if (!account) throw new SocialNotConnectedError(provider);

  await prisma.contentItem.update({
    where: { id: contentItemId },
    data: { publishStatus: "PENDING", publishError: null },
  });

  try {
    if (provider === "INSTAGRAM") {
      const accessToken = decryptSecret(account.accessToken);
      const caption = item.body ?? item.title;
      const result = item.videoUrl
        ? await meta.publishReel(account.externalAccountId, accessToken, item.videoUrl, caption)
        : item.imageUrl
          ? await meta.publishImage(account.externalAccountId, accessToken, item.imageUrl, caption)
          : null;
      if (!result) throw new Error("This content item has no generated image or video to publish.");
      return await prisma.contentItem.update({
        where: { id: contentItemId },
        data: {
          publishStatus: "READY",
          status: "PUBLISHED",
          publishedAt: new Date(),
          externalPostId: result.postId,
          externalPostUrl: result.permalink,
        },
      });
    }

    // TikTok — video only.
    if (!item.videoUrl) {
      throw new Error("TikTok publishing needs a generated video on this item first.");
    }
    const accessToken = await getFreshTiktokAccessToken(account);
    const { publishId } = await tiktok.publishVideoFromUrl(accessToken, item.videoUrl, item.title);

    let status = await tiktok.checkPublishStatus(accessToken, publishId);
    for (let i = 0; i < 6 && status.status !== "PUBLISH_COMPLETE" && status.status !== "FAILED"; i++) {
      await sleep(3000);
      status = await tiktok.checkPublishStatus(accessToken, publishId);
    }

    if (status.status === "PUBLISH_COMPLETE") {
      return await prisma.contentItem.update({
        where: { id: contentItemId },
        data: {
          publishStatus: "READY",
          status: "PUBLISHED",
          publishedAt: new Date(),
          publishJobId: publishId,
          externalPostId: status.postIds[0] ?? publishId,
        },
      });
    }
    if (status.status === "FAILED") {
      return await prisma.contentItem.update({
        where: { id: contentItemId },
        data: {
          publishStatus: "FAILED",
          publishJobId: publishId,
          publishError: status.failReason ?? "TikTok publish failed.",
        },
      });
    }
    // Still processing — leave PENDING with the job id for refreshPublishStatus to pick up.
    return await prisma.contentItem.update({
      where: { id: contentItemId },
      data: { publishJobId: publishId },
    });
  } catch (err) {
    return prisma.contentItem.update({
      where: { id: contentItemId },
      data: {
        publishStatus: "FAILED",
        publishError: err instanceof Error ? err.message : String(err),
      },
    });
  }
}

/** Polled by the UI while a TikTok publish job is still processing. */
export async function refreshPublishStatus(organizationId: string, contentItemId: string) {
  const item = await prisma.contentItem.findFirst({
    where: { id: contentItemId, organizationId },
  });
  if (!item) throw new Error("content_item_not_found");
  if (item.publishStatus !== "PENDING" || !item.publishJobId) return item;

  const provider = channelToProvider(item.channel);
  if (provider !== "TIKTOK") return item;
  const account = await prisma.socialAccount.findUnique({
    where: { organizationId_provider: { organizationId, provider: "TIKTOK" } },
  });
  if (!account) return item;

  try {
    const accessToken = await getFreshTiktokAccessToken(account);
    const status = await tiktok.checkPublishStatus(accessToken, item.publishJobId);
    if (status.status === "PUBLISH_COMPLETE") {
      return await prisma.contentItem.update({
        where: { id: contentItemId },
        data: {
          publishStatus: "READY",
          status: "PUBLISHED",
          publishedAt: new Date(),
          externalPostId: status.postIds[0] ?? item.publishJobId,
        },
      });
    }
    if (status.status === "FAILED") {
      return await prisma.contentItem.update({
        where: { id: contentItemId },
        data: { publishStatus: "FAILED", publishError: status.failReason ?? "TikTok publish failed." },
      });
    }
    return item;
  } catch (err) {
    return prisma.contentItem.update({
      where: { id: contentItemId },
      data: {
        publishStatus: "FAILED",
        publishError: err instanceof Error ? err.message : String(err),
      },
    });
  }
}
