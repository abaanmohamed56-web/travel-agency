"use client";

import type { BadgeProps } from "@/components/raalhu/ui/badge";
import { StatusSelect } from "@/components/raalhu/dashboard/StatusSelect";

const ASSIGNABLE_ROLES = ["ADMIN", "MEMBER", "VIEWER"] as const;
export type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

const ROLE_BADGE: Record<AssignableRole, BadgeProps["variant"]> = {
  ADMIN: "default",
  MEMBER: "secondary",
  VIEWER: "outline",
};

export function MemberRoleSelect({
  membershipId,
  role,
}: {
  membershipId: string;
  role: AssignableRole;
}) {
  return (
    <StatusSelect
      id={membershipId}
      status={role}
      options={ASSIGNABLE_ROLES}
      badgeVariant={ROLE_BADGE}
      endpoint={(id) => `/api/raalhu/members/${id}`}
      field="role"
    />
  );
}
