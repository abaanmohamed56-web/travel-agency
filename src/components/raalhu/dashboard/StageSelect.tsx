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

const STAGES = ["LEAD", "MQL", "SQL", "CUSTOMER", "CHURNED"] as const;
export type LeadStage = (typeof STAGES)[number];

const STAGE_BADGE: Record<LeadStage, BadgeProps["variant"]> = {
  LEAD: "secondary",
  MQL: "default",
  SQL: "warning",
  CUSTOMER: "success",
  CHURNED: "outline",
};

export function StageSelect({
  contactId,
  stage,
}: {
  contactId: string;
  stage: LeadStage;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState<LeadStage>(stage);
  const [pending, startTransition] = useTransition();

  async function onSelect(next: LeadStage) {
    if (next === current) return;
    const prev = current;
    setCurrent(next);
    try {
      const res = await fetch(`/api/raalhu/contacts/${contactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: next }),
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
        <Badge variant={STAGE_BADGE[current]} className="cursor-pointer">
          {current}
          {pending ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <ChevronDown className="size-3 opacity-60" />
          )}
        </Badge>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {STAGES.map((s) => (
          <DropdownMenuItem
            key={s}
            onSelect={() => onSelect(s)}
            className={cn(s === current && "text-primary")}
          >
            {s}
            {s === current && <Check className="ml-auto size-3.5" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
