import { requireRaalhuContext } from "@/modules/raalhu/auth/context";
import {
  listUserMemberships,
  listNotifications,
} from "@/modules/raalhu/db/queries";
import { DashboardShell } from "@/components/raalhu/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, org, membership } = await requireRaalhuContext();
  const [memberships, notifications] = await Promise.all([
    listUserMemberships(user.id),
    listNotifications(org.id, user.id),
  ]);

  return (
    <DashboardShell
      user={{ name: user.name ?? null, email: user.email ?? null }}
      org={{ id: org.id, name: org.name, plan: org.plan }}
      role={membership.role}
      orgs={memberships.map((m) => ({
        id: m.organization.id,
        name: m.organization.name,
      }))}
      notifications={notifications.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        type: n.type,
        read: n.readAt !== null,
        createdAt: n.createdAt.toISOString(),
      }))}
    >
      {children}
    </DashboardShell>
  );
}
