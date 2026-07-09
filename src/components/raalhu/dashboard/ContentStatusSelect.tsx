"use client";

import type { BadgeProps } from "@/components/raalhu/ui/badge";
import { StatusSelect } from "@/components/raalhu/dashboard/StatusSelect";

const CONTENT_STATUSES = [
  "IDEA",
  "DRAFT",
  "REVIEW",
  "APPROVED",
  "SCHEDULED",
  "PUBLISHED",
] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

const STATUS_BADGE: Record<ContentStatus, BadgeProps["variant"]> = {
  IDEA: "outline",
  DRAFT: "secondary",
  REVIEW: "warning",
  APPROVED: "default",
  SCHEDULED: "default",
  PUBLISHED: "success",
};

export function ContentStatusSelect({
  contentId,
  status,
}: {
  contentId: string;
  status: ContentStatus;
}) {
  return (
    <StatusSelect
      id={contentId}
      status={status}
      options={CONTENT_STATUSES}
      badgeVariant={STATUS_BADGE}
      endpoint={(id) => `/api/raalhu/content/${id}`}
      field="status"
    />
  );
}
