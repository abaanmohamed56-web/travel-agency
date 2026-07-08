import { cn } from "@/lib/utils";

/** Raalhu ("wave" in Dhivehi) — stylized wave mark in ocean blue. */
export function RaalhuMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("size-7", className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="9" fill="url(#raalhu-mark-bg)" />
      <path
        d="M6 20.5c2.6 0 2.6-3.6 5.2-3.6s2.6 3.6 5.2 3.6 2.6-3.6 5.2-3.6 2.6 3.6 5.2 3.6"
        stroke="#07131F"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M6 13.5c2.6 0 2.6-3.6 5.2-3.6s2.6 3.6 5.2 3.6 2.6-3.6 5.2-3.6 2.6 3.6 5.2 3.6"
        stroke="#07131F"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <defs>
        <linearGradient
          id="raalhu-mark-bg"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#7FD0FF" />
          <stop offset="0.5" stopColor="#1EA7FF" />
          <stop offset="1" stopColor="#0B6FBF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function RaalhuLogo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <RaalhuMark />
      <span className="text-lg font-semibold tracking-tight text-foreground">
        Raalhu<span className="text-primary"> AI</span>
      </span>
    </span>
  );
}
