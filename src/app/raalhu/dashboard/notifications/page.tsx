import { requireRaalhuContext } from "@/modules/raalhu/auth/context";
import { listNotifications } from "@/modules/raalhu/db/queries";
import { PageHeader } from "@/components/raalhu/dashboard/PageHeader";
import {
  MarkAllReadButton,
  NotificationsList,
} from "@/components/raalhu/dashboard/NotificationsList";

export const metadata = { title: "Notifications" };

export default async function NotificationsPage() {
  const { user, org } = await requireRaalhuContext();
  const notifications = await listNotifications(org.id, user.id);
  const hasUnread = notifications.some((n) => !n.readAt);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <PageHeader
        title="Notifications"
        description="What your AI team and workspace have been up to."
        actions={<MarkAllReadButton hasUnread={hasUnread} />}
      />

      <NotificationsList
        notifications={notifications.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          type: n.type,
          createdAt: n.createdAt.toISOString(),
          readAt: n.readAt ? n.readAt.toISOString() : null,
        }))}
      />
    </main>
  );
}
