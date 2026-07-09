"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/raalhu/ui/badge";
import { Button } from "@/components/raalhu/ui/button";
import { Card } from "@/components/raalhu/ui/card";

export interface NotificationRow {
  id: string;
  title: string;
  body: string | null;
  type: string;
  createdAt: string;
  readAt: string | null;
}

const TYPE_BADGE: Record<string, "default" | "success" | "warning" | "destructive"> = {
  info: "default",
  success: "success",
  warning: "warning",
  error: "destructive",
};

export function MarkAllReadButton({ hasUnread }: { hasUnread: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    try {
      const res = await fetch("/api/raalhu/notifications/mark-all-read", {
        method: "POST",
      });
      if (!res.ok) throw new Error("failed");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  if (!hasUnread) return null;
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={loading}>
      {loading ? <Loader2 className="animate-spin" /> : <CheckCheck />}
      Mark all read
    </Button>
  );
}

export function NotificationsList({
  notifications,
}: {
  notifications: NotificationRow[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [markingId, setMarkingId] = useState<string | null>(null);

  async function markRead(id: string) {
    setMarkingId(id);
    try {
      const res = await fetch(`/api/raalhu/notifications/${id}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("failed");
      startTransition(() => router.refresh());
    } finally {
      setMarkingId(null);
    }
  }

  if (notifications.length === 0) {
    return (
      <Card variant="glass" className="flex flex-col items-center gap-3 p-12 text-center">
        <Bell className="size-8 text-primary" />
        <h2 className="font-medium">All quiet</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          Agent activity, approvals, and lead alerts will land here.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <Card
          key={n.id}
          variant="glass"
          className={cn(
            "p-4",
            n.readAt && "opacity-60",
            !n.readAt && "cursor-pointer transition-colors hover:border-primary/30"
          )}
          onClick={!n.readAt ? () => markRead(n.id) : undefined}
        >
          <div className="flex items-start gap-3">
            {markingId === n.id && pending ? (
              <Loader2 className="mt-1 size-3.5 shrink-0 animate-spin text-primary" />
            ) : (
              <span
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  n.readAt ? "bg-muted-foreground/40" : "r-pulse-dot bg-primary"
                )}
              />
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{n.title}</p>
                <Badge variant={TYPE_BADGE[n.type] ?? "default"}>{n.type}</Badge>
              </div>
              {n.body && (
                <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
              )}
              <p className="mt-1.5 text-xs text-muted-foreground">
                {new Date(n.createdAt).toLocaleString("en-US", {
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
  );
}
