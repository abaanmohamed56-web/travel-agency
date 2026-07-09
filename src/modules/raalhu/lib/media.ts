import { prisma } from "@/lib/prisma";
import {
  checkGenerationStatus,
  isHiggsfieldConfigured,
  startImageGeneration,
  startVideoGeneration,
  type HiggsfieldJobResult,
  type HiggsfieldStatus,
} from "@/lib/higgsfield";
import type { MediaStatus } from "@prisma/client";

export class MediaNotConfiguredError extends Error {
  constructor() {
    super("Image/video generation is not configured (missing HF_CREDENTIALS).");
    this.name = "MediaNotConfiguredError";
  }
}

function toMediaStatus(status: HiggsfieldStatus): MediaStatus {
  if (status === "completed") return "READY";
  if (status === "failed" || status === "nsfw") return "FAILED";
  return "PENDING";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Higgsfield jobs start async regardless of media type. Images are usually
 * fast (single-digit to low-double-digit seconds), so we poll a short,
 * bounded window here to give callers a synchronous-feeling result in the
 * common case — without risking a serverless function timeout. If it's not
 * done in time we just leave it PENDING; the regular status poll picks it up.
 */
function isSettled(status: HiggsfieldStatus) {
  return status === "completed" || status === "failed" || status === "nsfw";
}

async function pollBriefly(
  requestId: string,
  attempts: number,
  intervalMs: number
): Promise<HiggsfieldJobResult> {
  let last = await checkGenerationStatus(requestId);
  for (let i = 0; i < attempts && !isSettled(last.status); i++) {
    await sleep(intervalMs);
    last = await checkGenerationStatus(requestId);
  }
  return last;
}

/** Starts (or restarts) image generation for a content item and persists progress. */
export async function generateContentImage(
  organizationId: string,
  contentItemId: string,
  prompt: string
) {
  if (!isHiggsfieldConfigured()) throw new MediaNotConfiguredError();
  const item = await prisma.contentItem.findFirst({
    where: { id: contentItemId, organizationId },
  });
  if (!item) throw new Error("content_item_not_found");

  await prisma.contentItem.update({
    where: { id: contentItemId },
    data: { imageStatus: "PENDING", imagePrompt: prompt, mediaError: null },
  });

  try {
    let result = await startImageGeneration(prompt);
    if (result.status !== "completed" && result.status !== "failed" && result.status !== "nsfw") {
      result = await pollBriefly(result.requestId, 8, 2500); // up to ~20s
    }
    return await prisma.contentItem.update({
      where: { id: contentItemId },
      data: {
        imageJobId: result.requestId,
        imageStatus: toMediaStatus(result.status),
        imageUrl: result.imageUrl ?? item.imageUrl,
        mediaError:
          result.status === "failed" || result.status === "nsfw"
            ? `Image generation ${result.status}.`
            : null,
      },
    });
  } catch (err) {
    return prisma.contentItem.update({
      where: { id: contentItemId },
      data: {
        imageStatus: "FAILED",
        mediaError: err instanceof Error ? err.message : String(err),
      },
    });
  }
}

/** Animates a content item's existing image into a short video. */
export async function generateContentVideo(
  organizationId: string,
  contentItemId: string,
  prompt: string
) {
  if (!isHiggsfieldConfigured()) throw new MediaNotConfiguredError();
  const item = await prisma.contentItem.findFirst({
    where: { id: contentItemId, organizationId },
  });
  if (!item) throw new Error("content_item_not_found");
  if (!item.imageUrl) throw new Error("content_item_has_no_image");

  await prisma.contentItem.update({
    where: { id: contentItemId },
    data: { videoStatus: "PENDING", videoPrompt: prompt, mediaError: null },
  });

  try {
    const result = await startVideoGeneration(item.imageUrl, prompt);
    return await prisma.contentItem.update({
      where: { id: contentItemId },
      data: {
        videoJobId: result.requestId,
        videoStatus: toMediaStatus(result.status),
        videoUrl: result.videoUrl ?? item.videoUrl,
        mediaError:
          result.status === "failed" || result.status === "nsfw"
            ? `Video generation ${result.status}.`
            : null,
      },
    });
  } catch (err) {
    return prisma.contentItem.update({
      where: { id: contentItemId },
      data: {
        videoStatus: "FAILED",
        mediaError: err instanceof Error ? err.message : String(err),
      },
    });
  }
}

/** Polls Higgsfield for any job still in flight and persists the latest state. */
export async function refreshContentMedia(organizationId: string, contentItemId: string) {
  const item = await prisma.contentItem.findFirst({
    where: { id: contentItemId, organizationId },
  });
  if (!item) throw new Error("content_item_not_found");

  const data: Record<string, unknown> = {};

  if (item.imageStatus === "PENDING" && item.imageJobId) {
    try {
      const result = await checkGenerationStatus(item.imageJobId);
      data.imageStatus = toMediaStatus(result.status);
      if (result.imageUrl) data.imageUrl = result.imageUrl;
      if (result.status === "failed" || result.status === "nsfw") {
        data.mediaError = `Image generation ${result.status}.`;
      }
    } catch (err) {
      data.imageStatus = "FAILED";
      data.mediaError = err instanceof Error ? err.message : String(err);
    }
  }

  if (item.videoStatus === "PENDING" && item.videoJobId) {
    try {
      const result = await checkGenerationStatus(item.videoJobId);
      data.videoStatus = toMediaStatus(result.status);
      if (result.videoUrl) data.videoUrl = result.videoUrl;
      if (result.status === "failed" || result.status === "nsfw") {
        data.mediaError = `Video generation ${result.status}.`;
      }
    } catch (err) {
      data.videoStatus = "FAILED";
      data.mediaError = err instanceof Error ? err.message : String(err);
    }
  }

  if (Object.keys(data).length === 0) return item;
  return prisma.contentItem.update({ where: { id: contentItemId }, data });
}
