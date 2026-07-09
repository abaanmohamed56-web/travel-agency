import { Bell } from "lucide-react";
import { requireRaalhuContext } from "@/modules/raalhu/auth/context";
import { listNotifications } from "@/modules/raalhu/db/queries";
import { PageHeader } from "@/components/raalhu/dashboard/PageHeader";
import { Badge } from "@/components/raalhu/ui/badge";
import { Card } from "@/components/raalhu/ui/card";
import { cn } from "@/lib/utils";

export const metadata = { title: "Notifications" };

const TYPE_BADGE: Record<string, "default" | "success" | "warning" | "destructive"> = {
  info: "default",
  success: "success",
  warning: "warning",
  error: "destructive",
};

export default async function NotificationsPage() {
  const { user, org } = await requireRaalhuContext();
  const notifications = await listNotifications(org.id, user.id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <PageHeader
        title="Notifications"
        description="What your AI team and workspace have been up to."
      />

      {notifications.length === 0 ? (
        <Card variant="glass" className="flex flex-col items-center gap-3 p-12 text-center">
          <Bell className="size-8 text-primary" />
          <h2 className="font-medium">All quiet</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Agent activity, approvals, and lead alerts will land here.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              variant="glass"
              className={cn("p-4", n.readAt && "opacity-60")}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    n.readAt ? "bg-muted-foreground/40" : "r-pulse-dot bg-primary"
                  )}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{n.title}</p>
                    <Badge variant={TYPE_BADGE[n.type] ?? "default"}>
                      {n.type}
                    </Badge>
                  </div>
                  {n.body && (
                    <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                  )}
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {n.createdAt.toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
