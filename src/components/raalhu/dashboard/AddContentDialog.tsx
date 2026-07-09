"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/raalhu/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/raalhu/ui/dialog";
import { Input } from "@/components/raalhu/ui/input";
import { Label } from "@/components/raalhu/ui/label";

const CONTENT_TYPES = [
  "SOCIAL_POST",
  "BLOG_POST",
  "EMAIL",
  "AD_COPY",
  "SCRIPT",
  "OTHER",
] as const;

const selectClass = cn(
  "flex h-10 w-full rounded-lg border border-border bg-input px-3.5 text-sm text-foreground transition-colors",
  "focus-visible:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
);

export function AddContentDialog({
  campaigns,
  defaultDate,
}: {
  campaigns: { id: string; name: string }[];
  defaultDate?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [contentType, setContentType] = useState<(typeof CONTENT_TYPES)[number]>("SOCIAL_POST");
  const [channel, setChannel] = useState("");
  const [scheduledAt, setScheduledAt] = useState(defaultDate ? `${defaultDate}T10:00` : "");
  const [campaignId, setCampaignId] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/raalhu/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          contentType,
          channel: channel || undefined,
          status: "SCHEDULED",
          scheduledAt: scheduledAt
            ? new Date(scheduledAt).toISOString()
            : undefined,
          campaignId: campaignId || undefined,
        }),
      });
      if (!res.ok) throw new Error("Could not schedule the content.");
      setTitle("");
      setChannel("");
      setCampaignId("");
      setOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus /> New content
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule content</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {error && (
            <p
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-red-400"
              role="alert"
            >
              {error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="content-title">Title</Label>
            <Input
              id="content-title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Behind-the-scenes reel"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="content-type">Type</Label>
              <select
                id="content-type"
                className={selectClass}
                value={contentType}
                onChange={(e) =>
                  setContentType(e.target.value as (typeof CONTENT_TYPES)[number])
                }
              >
                {CONTENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace("_", " ").toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content-channel">Channel</Label>
              <Input
                id="content-channel"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                placeholder="instagram"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content-scheduled">Scheduled for</Label>
            <Input
              id="content-scheduled"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>
          {campaigns.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="content-campaign">Campaign</Label>
              <select
                id="content-campaign"
                className={selectClass}
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
              >
                <option value="">No campaign</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" disabled={loading || !title.trim()}>
              {loading && <Loader2 className="animate-spin" />}
              {loading ? "Scheduling…" : "Schedule content"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
