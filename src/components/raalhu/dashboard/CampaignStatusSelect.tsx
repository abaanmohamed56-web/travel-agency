"use client";

import type { BadgeProps } from "@/components/raalhu/ui/badge";
import { StatusSelect } from "@/components/raalhu/dashboard/StatusSelect";

const CAMPAIGN_STATUSES = [
  "DRAFT",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "ARCHIVED",
] as const;
export type CampaignStatus = (typeof CAMPAIGN_STATUSES)[number];

const STATUS_BADGE: Record<CampaignStatus, BadgeProps["variant"]> = {
  DRAFT: "secondary",
  ACTIVE: "success",
  PAUSED: "warning",
  COMPLETED: "outline",
  ARCHIVED: "outline",
};

export function CampaignStatusSelect({
  campaignId,
  status,
}: {
  campaignId: string;
  status: CampaignStatus;
}) {
  return (
    <StatusSelect
      id={campaignId}
      status={status}
      options={CAMPAIGN_STATUSES}
      badgeVariant={STATUS_BADGE}
      endpoint={(id) => `/api/raalhu/campaigns/${id}`}
      field="status"
    />
  );
}
