import * as React from "react";
import { cn } from "@/lib/utils";

/** Initials-based avatar; no Radix avatar dep is installed, and image avatars are not needed yet. */
function Avatar({
  name,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { name?: string | null }) {
  const initials = (name ?? "?")
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex size-9 shrink-0 select-none items-center justify-center rounded-full border border-border bg-secondary text-xs font-semibold text-foreground",
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
}

export { Avatar };
