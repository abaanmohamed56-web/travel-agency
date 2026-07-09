"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquare, Repeat } from "lucide-react";
import { Button } from "@/components/raalhu/ui/button";
import { Card } from "@/components/raalhu/ui/card";
import { Textarea } from "@/components/raalhu/ui/textarea";

export interface ActivityRow {
  id: string;
  type: string;
  body: string | null;
  createdAt: string;
}

function formatTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function ContactActivityTimeline({
  contactId,
  activities,
}: {
  contactId: string;
  activities: ActivityRow[];
}) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/raalhu/contacts/${contactId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: note.trim() }),
      });
      if (!res.ok) throw new Error("Could not save the note.");
      setNote("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-2">
        {error && (
          <p
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note…"
          rows={3}
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={loading || !note.trim()}>
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Saving…" : "Add note"}
          </Button>
        </div>
      </form>

      {activities.length === 0 ? (
        <Card variant="glass" className="flex flex-col items-center gap-2 p-8 text-center">
          <MessageSquare className="size-6 text-primary" />
          <p className="text-sm text-muted-foreground">
            No activity yet. Notes and stage changes will show up here.
          </p>
        </Card>
      ) : (
        <ol className="space-y-3">
          {activities.map((a) => (
            <li key={a.id}>
              <Card variant="glass" className="flex items-start gap-3 p-4">
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                  {a.type === "STAGE_CHANGE" ? (
                    <Repeat className="size-3.5" />
                  ) : (
                    <MessageSquare className="size-3.5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{a.body ?? a.type}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatTimestamp(a.createdAt)}
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
