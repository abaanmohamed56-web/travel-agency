import type { MembershipRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role?: string;
      /** Active Raalhu organization (hint — re-verified in the DB server-side). */
      raalhuOrgId?: string;
      raalhuRole?: MembershipRole;
    };
    /** Payload accepted by `useSession().update()` for the Raalhu org switcher. */
    raalhuOrgId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    raalhuOrgId?: string;
    raalhuRole?: MembershipRole;
  }
}
