"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * Void-black tile background, reusing the same radial blue glow as the
 * app's own hero backdrop (r-hero-backdrop) so the mark reads as native to
 * the site rather than a pasted-on asset.
 */
function TileBackground({ bgId, glowId }: { bgId: string; glowId: string }) {
  return (
    <>
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0b1420" />
          <stop offset="1" stopColor="#05070a" />
        </linearGradient>
        <radialGradient id={glowId} cx="0.5" cy="0.08" r="0.75">
          <stop offset="0" stopColor="#1ea7ff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#1ea7ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" rx="10%" fill={`url(#${bgId})`} />
      <rect width="100%" height="100%" rx="10%" fill={`url(#${glowId})`} />
    </>
  );
}

const SERIF = "Georgia, 'Times New Roman', Times, serif";

/** Full wordmark tile — RAALHU over AI, wide-tracked serif on the app's void-black. */
export function RaalhuLogo({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 240 140"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-10 w-auto", className)}
      role="img"
      aria-label="Raalhu AI"
    >
      <TileBackground bgId={`${id}-bg`} glowId={`${id}-glow`} />
      <text
        x="120"
        y="70"
        textAnchor="middle"
        fontFamily={SERIF}
        fontSize="34"
        letterSpacing="7"
        fill="#f2f7fb"
      >
        RAALHU
      </text>
      <text
        x="121"
        y="102"
        textAnchor="middle"
        fontFamily={SERIF}
        fontSize="19"
        letterSpacing="8"
        fill="#7fc8ff"
      >
        AI
      </text>
    </svg>
  );
}

/** Compact monogram for tight slots (org switcher, favicon-adjacent icons). */
export function RaalhuMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-7", className)}
      role="img"
      aria-label="Raalhu AI"
    >
      <TileBackground bgId={`${id}-bg`} glowId={`${id}-glow`} />
      <text
        x="16.5"
        y="22.5"
        textAnchor="middle"
        fontFamily={SERIF}
        fontSize="18"
        fill="#f2f7fb"
      >
        R
      </text>
    </svg>
  );
}
