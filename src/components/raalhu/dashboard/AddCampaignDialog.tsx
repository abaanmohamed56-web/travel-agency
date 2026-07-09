"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
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
import { Textarea } from "@/components/raalhu/ui/textarea";

export function AddCampaignDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [objective, setObjective] = useState("");
  const [channels, setChannels] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/raalhu/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          objective: objective || undefined,
          channels: channels
            ? channels.split(",").map((c) => c.trim()).filter(Boolean)
            : undefined,
        }),
      });
      if (!res.ok) throw new Error("Could not create the campaign.");
      setName("");
      setObjective("");
      setChannels("");
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
          <Plus /> New campaign
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New campaign</DialogTitle>
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
            <Label htmlFor="campaign-name">Name</Label>
            <Input
              id="campaign-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Summer bookings push"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaign-objective">Objective</Label>
            <Textarea
              id="campaign-objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="What should this campaign achieve?"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="campaign-channels">Channels</Label>
            <Input
              id="campaign-channels"
              value={channels}
              onChange={(e) => setChannels(e.target.value)}
              placeholder="instagram, email, blog"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !name.trim()}>
              {loading && <Loader2 className="animate-spin" />}
              {loading ? "Creating…" : "Create campaign"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
