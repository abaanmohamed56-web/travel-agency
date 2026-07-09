"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, KeyRound, Loader2, Plus } from "lucide-react";
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

export function CreateApiKeyDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [plaintextKey, setPlaintextKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/raalhu/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Could not create the key.");
      const { plaintextKey: key } = await res.json();
      setPlaintextKey(key);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function onCopy() {
    if (!plaintextKey) return;
    navigator.clipboard.writeText(plaintextKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function onOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setName("");
      setPlaintextKey(null);
      setError(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus /> New key
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {plaintextKey ? "Save your key" : "New API key"}
          </DialogTitle>
        </DialogHeader>

        {plaintextKey ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This is shown once. Store it somewhere safe — you won&apos;t be
              able to see it again.
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-input px-3.5 py-2.5">
              <KeyRound className="size-4 shrink-0 text-primary" />
              <code className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-sm">
                {plaintextKey}
              </code>
              <button
                type="button"
                onClick={onCopy}
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label="Copy key"
              >
                {copied ? (
                  <Check className="size-4 text-emerald-400" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </div>
            <DialogFooter>
              <Button onClick={() => onOpenChange(false)}>Done</Button>
            </DialogFooter>
          </div>
        ) : (
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
              <Label htmlFor="apikey-name">Name</Label>
              <Input
                id="apikey-name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="CI pipeline"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading || !name.trim()}>
                {loading && <Loader2 className="animate-spin" />}
                {loading ? "Creating…" : "Create key"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
