"use client";

import { useEffect, useRef, useState } from "react";
import { Film, ImagePlus, Loader2, RotateCw } from "lucide-react";
import { Button } from "@/components/raalhu/ui/button";

type MediaStatus = "NONE" | "PENDING" | "READY" | "FAILED";

interface MediaState {
  imageStatus: MediaStatus;
  imageUrl: string | null;
  videoStatus: MediaStatus;
  videoUrl: string | null;
  mediaError: string | null;
}

async function postJson(url: string) {
  const res = await fetch(url, { method: "POST" });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, data };
}

export function ContentMediaControls({
  contentId,
  mediaEnabled,
  initial,
}: {
  contentId: string;
  mediaEnabled: boolean;
  initial: MediaState;
}) {
  const [state, setState] = useState<MediaState>(initial);
  const [busy, setBusy] = useState<"image" | "video" | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pending = state.imageStatus === "PENDING" || state.videoStatus === "PENDING";

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
      });
    }, 3000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [pending, contentId]);

  if (!mediaEnabled && state.imageStatus === "NONE" && state.videoStatus === "NONE") {
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
    </div>
  );
}
