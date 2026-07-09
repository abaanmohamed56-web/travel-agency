"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/raalhu/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/raalhu/ui/card";
import { Input } from "@/components/raalhu/ui/input";
import { Label } from "@/components/raalhu/ui/label";
import { Switch } from "@/components/raalhu/ui/switch";
import { Badge } from "@/components/raalhu/ui/badge";

export interface AutopilotFormValues {
  enabled: boolean;
  postsPerDay: number;
  videosPerDay: number;
  channels: string[];
  lastRunAt: string | null;
  lastRunStatus: string | null;
  lastRunError: string | null;
}

const STATUS_VARIANT: Record<string, "success" | "destructive" | "outline"> = {
  SUCCEEDED: "success",
  FAILED: "destructive",
  SKIPPED: "outline",
};

export function AutopilotSettingsCard({
  initial,
  isAdmin,
  aiConfigured,
}: {
  initial: AutopilotFormValues;
  isAdmin: boolean;
  aiConfigured: boolean;
}) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initial.enabled);
  const [postsPerDay, setPostsPerDay] = useState(initial.postsPerDay);
  const [videosPerDay, setVideosPerDay] = useState(initial.videosPerDay);
  const [channels, setChannels] = useState(initial.channels.join(", "));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/raalhu/autopilot", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled,
          postsPerDay,
          videosPerDay,
          channels: channels
            .split(",")
            .map((c) => c.trim().toLowerCase())
            .filter(Boolean),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to save.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="text-base">Autopilot</CardTitle>
        <CardDescription>
          Runs once a day, drafts the batch on the Content Calendar, and never publishes on its
          own — you still review and hit Publish.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {!aiConfigured && (
          <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-400">
            Add <code className="font-mono">ANTHROPIC_API_KEY</code> to your environment before
            enabling Autopilot — it drives the same AI team as the Command Center chat.
          </p>
        )}

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Enable daily autopilot</p>
            <p className="text-xs text-muted-foreground">Runs once a day (08:00 UTC).</p>
          </div>
          <Switch checked={enabled} onCheckedChange={setEnabled} disabled={!isAdmin} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="postsPerDay">Posts per day</Label>
            <Input
              id="postsPerDay"
              type="number"
              min={0}
              max={10}
              value={postsPerDay}
              onChange={(e) => setPostsPerDay(Number(e.target.value))}
              disabled={!isAdmin}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videosPerDay">Videos per day</Label>
            <Input
              id="videosPerDay"
              type="number"
              min={0}
              max={5}
              value={videosPerDay}
              onChange={(e) => setVideosPerDay(Number(e.target.value))}
              disabled={!isAdmin}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="channels">Channels (optional)</Label>
          <Input
            id="channels"
            placeholder="instagram, tiktok, email"
            value={channels}
            onChange={(e) => setChannels(e.target.value)}
            disabled={!isAdmin}
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated. Leave blank to let the AI team choose based on your campaigns.
          </p>
        </div>

        {initial.lastRunAt && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              Last run {new Date(initial.lastRunAt).toLocaleString()}
            </span>
            {initial.lastRunStatus && (
              <Badge variant={STATUS_VARIANT[initial.lastRunStatus] ?? "outline"}>
                {initial.lastRunStatus.toLowerCase()}
              </Badge>
            )}
          </div>
        )}
        {initial.lastRunStatus && initial.lastRunStatus !== "SUCCEEDED" && initial.lastRunError && (
          <p className="text-xs text-red-400">{initial.lastRunError}</p>
        )}

        {error && <p className="text-sm text-red-400">{error}</p>}

        {isAdmin && (
          <Button onClick={save} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
            Save
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
