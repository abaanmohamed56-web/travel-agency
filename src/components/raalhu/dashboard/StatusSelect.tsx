"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge, type BadgeProps } from "@/components/raalhu/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/raalhu/ui/dropdown-menu";

/** Generic PATCH-backed status dropdown, shared by campaign and content status controls. */
export function StatusSelect<T extends string>({
  id,
  status,
  options,
  badgeVariant,
  endpoint,
  field,
}: {
  id: string;
  status: T;
  options: readonly T[];
  badgeVariant: Record<T, BadgeProps["variant"]>;
  endpoint: (id: string) => string;
  field: string;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState<T>(status);
  const [pending, startTransition] = useTransition();

  async function onSelect(next: T) {
    if (next === current) return;
    const prev = current;
    setCurrent(next);
    try {
      const res = await fetch(endpoint(id), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: next }),
      });
      if (!res.ok) throw new Error("failed");
      startTransition(() => router.refresh());
    } catch {
      setCurrent(prev);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center gap-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        disabled={pending}
      >
        <Badge variant={badgeVariant[current]} className="cursor-pointer">
          {current.toLowerCase()}
          {pending ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <ChevronDown className="size-3 opacity-60" />
          )}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((s) => (
          <DropdownMenuItem
            key={s}
            onSelect={() => onSelect(s)}
            className={cn(s === current && "text-primary")}
          >
            {s.toLowerCase()}
            {s === current && <Check className="ml-auto size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
