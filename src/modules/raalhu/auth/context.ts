import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import type { Membership, MembershipRole, Organization } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface RaalhuContext {
  user: { id: string; name?: string | null; email?: string | null };
  org: Organization;
  membership: Membership;
}

const ROLE_RANK: Record<MembershipRole, number> = {
  VIEWER: 0,
  MEMBER: 1,
  ADMIN: 2,
  OWNER: 3,
};

/**
 * Resolves the signed-in user's active Raalhu organization. The JWT claim is
 * only a hint — membership is re-verified in the database on every call.
 * Returns null when there is no session or no membership at all.
 */
async function resolveContext(): Promise<RaalhuContext | null | "no-org"> {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) return null;

  const memberships = await prisma.membership.findMany({
    where: { userId },
    include: { organization: true },
    orderBy: { createdAt: "asc" },
  });
  if (memberships.length === 0) return "no-org";

  const active =
    memberships.find(
      (m) => m.organizationId === session.user.raalhuOrgId
    ) ?? memberships[0];

  return {
    user: {
      id: userId,
      name: session.user.name,
      email: session.user.email,
    },
    org: active.organization,
    membership: active,
  };
}

/** For Server Components / pages: redirects to login or onboarding as needed. */
export async function requireRaalhuContext(): Promise<RaalhuContext> {
  const ctx = await resolveContext();
  if (ctx === null) redirect("/raalhu/login?callbackUrl=/raalhu/dashboard");
  if (ctx === "no-org") redirect("/raalhu/onboarding");
  return ctx;
}

/** For route handlers: returns a Response instead of redirecting. */
export async function requireRaalhuApiContext(): Promise<
  RaalhuContext | Response
> {
  const ctx = await resolveContext();
  if (ctx === null) {
    return Response.json({ error: "unauthenticated" }, { status: 401 });
  }
  if (ctx === "no-org") {
    return Response.json({ error: "no_organization" }, { status: 403 });
  }
  return ctx;
}

/** Lets onboarding know whether the user already belongs to an organization. */
export async function getOptionalRaalhuContext(): Promise<RaalhuContext | null> {
  const ctx = await resolveContext();
  return ctx === null || ctx === "no-org" ? null : ctx;
}

export function hasRole(
  membership: Membership,
  minimum: MembershipRole
): boolean {
  return ROLE_RANK[membership.role] >= ROLE_RANK[minimum];
}

export function assertRole(
  membership: Membership,
  minimum: MembershipRole
): Response | null {
  if (!hasRole(membership, minimum)) {
    return Response.json({ error: "forbidden" }, { status: 403 });
  }
  return null;
}
