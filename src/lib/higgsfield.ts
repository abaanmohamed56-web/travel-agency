import { higgsfield, config as configureHiggsfield } from "@higgsfield/client/v2";

const STATUS_ENDPOINT = "https://platform.higgsfield.ai/requests";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  const credentials = process.env.HF_CREDENTIALS;
  if (!credentials) throw new Error("HF_CREDENTIALS is not configured");
  configureHiggsfield({ credentials });
  configured = true;
}

export function isHiggsfieldConfigured(): boolean {
  return !!process.env.HF_CREDENTIALS;
}

export type HiggsfieldStatus =
  | "queued"
  | "in_progress"
  | "completed"
  | "failed"
  | "nsfw";

export interface HiggsfieldJobResult {
  status: HiggsfieldStatus;
  requestId: string;
  imageUrl?: string;
  videoUrl?: string;
}

interface RawV2Response {
  status: HiggsfieldStatus;
  request_id: string;
  images?: { url: string }[];
  video?: { url: string };
}

function toResult(response: RawV2Response): HiggsfieldJobResult {
  return {
    status: response.status,
    requestId: response.request_id,
    imageUrl: response.images?.[0]?.url,
    videoUrl: response.video?.url,
  };
}

/**
 * Kicks off a text-to-image generation and returns immediately (status will
 * usually be "queued" or "in_progress") — the caller polls
 * `checkGenerationStatus` for completion. Vercel serverless functions can't
 * hold a request open for the minutes a generation may take.
 */
export async function startImageGeneration(prompt: string): Promise<HiggsfieldJobResult> {
  ensureConfigured();
  const response = (await higgsfield.subscribe("/v1/text2image/soul", {
    input: {
      prompt,
      width_and_height: "1024x1024",
      quality: "1080p",
      batch_size: 1,
      enhance_prompt: true,
    },
    withPolling: false,
  })) as RawV2Response;
  return toResult(response);
}

/**
 * Animates an existing image into a short video. Higgsfield only supports
 * image-to-video, so an image must be generated first.
 */
export async function startVideoGeneration(
  imageUrl: string,
  prompt: string
): Promise<HiggsfieldJobResult> {
  ensureConfigured();
  const response = (await higgsfield.subscribe("/v1/image2video/dop", {
    input: {
      model: "dop-turbo",
      prompt,
      input_images: [{ type: "image_url", image_url: imageUrl }],
      enhance_prompt: true,
    },
    withPolling: false,
  })) as RawV2Response;
  return toResult(response);
}

/** Single (non-looping) status check for a previously started job. */
export async function checkGenerationStatus(requestId: string): Promise<HiggsfieldJobResult> {
  const credentials = process.env.HF_CREDENTIALS;
  if (!credentials) throw new Error("HF_CREDENTIALS is not configured");
  const res = await fetch(`${STATUS_ENDPOINT}/${requestId}/status`, {
    headers: { Authorization: `Key ${credentials}` },
  });
  if (!res.ok) {
    throw new Error(`Higgsfield status check failed with ${res.status}`);
  }
  const data = (await res.json()) as RawV2Response;
  return toResult(data);
}
