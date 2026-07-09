"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Film, ImagePlus, Loader2, RotateCw, Send } from "lucide-react";
import { Button } from "@/components/raalhu/ui/button";
import { Badge } from "@/components/raalhu/ui/badge";

type MediaStatus = "NONE" | "PENDING" | "READY" | "FAILED";
type Provider = "INSTAGRAM" | "TIKTOK";

interface MediaState {
  imageStatus: MediaStatus;
  imageUrl: string | null;
  videoStatus: MediaStatus;
  videoUrl: string | null;
  mediaError: string | null;
  publishStatus: MediaStatus;
  externalPostUrl: string | null;
  publishError: string | null;
}

async function postJson(url: string) {
  const res = await fetch(url, { method: "POST" });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

function channelToProvider(channel: string | null): Provider | null {
  const c = (channel ?? "").toLowerCase();
  if (c.includes("instagram")) return "INSTAGRAM";
  if (c.includes("tiktok")) return "TIKTOK";
  return null;
}

export function ContentMediaControls({
  contentId,
  channel,
  mediaEnabled,
  connectedProviders,
  initial,
}: {
  contentId: string;
  channel: string | null;
  mediaEnabled: boolean;
  connectedProviders: Provider[];
  initial: MediaState;
}) {
  const [state, setState] = useState<MediaState>(initial);
  const [busy, setBusy] = useState<"image" | "video" | "publish" | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pending =
    state.imageStatus === "PENDING" ||
    state.videoStatus === "PENDING" ||
    state.publishStatus === "PENDING";

  useEffect(() => {
    if (!pending) {
      if (pollRef.current) clearInterval(pollRef.current);
      return;
    }
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/raalhu/content/${contentId}/media-status`);
      if (!res.ok) return;
      const { contentItem } = await res.json();
      setState({
        imageStatus: contentItem.imageStatus,
        imageUrl: contentItem.imageUrl,
        videoStatus: contentItem.videoStatus,
        videoUrl: contentItem.videoUrl,
        mediaError: contentItem.mediaError,
        publishStatus: contentItem.publishStatus,
        externalPostUrl: contentItem.externalPostUrl,
        publishError: contentItem.publishError,
      });
    }, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [pending, contentId]);

  const provider = channelToProvider(channel);
  const providerConnected = provider ? connectedProviders.includes(provider) : false;
  const hasPublishableMedia =
    provider === "INSTAGRAM" ? !!(state.imageUrl || state.videoUrl) : provider === "TIKTOK" ? !!state.videoUrl : false;

  if (
    !mediaEnabled &&
    state.imageStatus === "NONE" &&
    state.videoStatus === "NONE" &&
    !providerConnected
  ) {
    return null;
  }

  async function generateImage() {
    setBusy("image");
    const { ok, data } = await postJson(`/api/raalhu/content/${contentId}/generate-image`);
    setBusy(null);
    if (ok && data.contentItem) {
      setState((s) => ({
        ...s,
        imageStatus: data.contentItem.imageStatus,
        imageUrl: data.contentItem.imageUrl,
        mediaError: data.contentItem.mediaError,
      }));
    }
  }

  async function generateVideo() {
    setBusy("video");
    const { ok, data } = await postJson(`/api/raalhu/content/${contentId}/generate-video`);
    setBusy(null);
    if (ok && data.contentItem) {
      setState((s) => ({
        ...s,
        videoStatus: data.contentItem.videoStatus,
        videoUrl: data.contentItem.videoUrl,
        mediaError: data.contentItem.mediaError,
      }));
    }
  }

  async function publish() {
    setBusy("publish");
    const { ok, data } = await postJson(`/api/raalhu/content/${contentId}/publish`);
    setBusy(null);
    if (ok && data.contentItem) {
      setState((s) => ({
        ...s,
        publishStatus: data.contentItem.publishStatus,
        externalPostUrl: data.contentItem.externalPostUrl,
        publishError: data.contentItem.publishError,
      }));
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {state.imageUrl ? (
        <div className="group relative size-12 shrink-0 overflow-hidden rounded-lg border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={state.imageUrl} alt="" className="size-full object-cover" />
          {mediaEnabled && (
            <button
              type="button"
              onClick={generateImage}
              disabled={busy !== null}
              aria-label="Regenerate image"
              className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
            >
              {busy === "image" ? (
                <Loader2 className="size-4 animate-spin text-white" />
              ) : (
                <RotateCw className="size-4 text-white" />
              )}
            </button>
          )}
        </div>
      ) : (
        mediaEnabled && (
          <Button
            variant="outline"
            size="sm"
            onClick={generateImage}
            disabled={busy !== null || state.imageStatus === "PENDING"}
          >
            {state.imageStatus === "PENDING" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <ImagePlus />
            )}
            {state.imageStatus === "PENDING" ? "Generating…" : "Generate image"}
          </Button>
        )
      )}

      {state.videoUrl ? (
        <video
          src={state.videoUrl}
          controls
          muted
          className="h-12 w-20 shrink-0 rounded-lg border border-border object-cover"
        />
      ) : (
        mediaEnabled &&
        state.imageUrl && (
          <Button
            variant="outline"
            size="sm"
            onClick={generateVideo}
            disabled={busy !== null || state.videoStatus === "PENDING"}
          >
            {state.videoStatus === "PENDING" ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Film />
            )}
            {state.videoStatus === "PENDING" ? "Animating…" : "Generate video"}
          </Button>
        )
      )}

      {state.mediaError && (
        <span className="text-xs text-red-400">{state.mediaError}</span>
      )}

      {providerConnected &&
        (state.publishStatus === "READY" ? (
          state.externalPostUrl ? (
            <a
              href={state.externalPostUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ExternalLink className="size-3" /> Published
            </a>
          ) : (
            <Badge variant="success">Published</Badge>
          )
        ) : (
          hasPublishableMedia && (
            <Button
              variant="outline"
              size="sm"
              onClick={publish}
              disabled={busy !== null || state.publishStatus === "PENDING"}
            >
              {state.publishStatus === "PENDING" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send />
              )}
              {state.publishStatus === "PENDING" ? "Publishing…" : `Publish to ${provider === "INSTAGRAM" ? "Instagram" : "TikTok"}`}
            </Button>
          )
        ))}

      {state.publishError && (
        <span className="text-xs text-red-400">{state.publishError}</span>
      )}
    </div>
  );
}
