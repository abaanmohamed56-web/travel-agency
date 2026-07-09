"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil } from "lucide-react";
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

export interface ProfileFormValues {
  businessName: string;
  industry: string;
  description: string;
  targetAudience: string;
  brandVoice: string;
  websiteUrl: string;
  goals: string[];
}

export function EditProfileDialog({ profile }: { profile: ProfileFormValues }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState(profile.businessName);
  const [industry, setIndustry] = useState(profile.industry);
  const [description, setDescription] = useState(profile.description);
  const [targetAudience, setTargetAudience] = useState(profile.targetAudience);
  const [brandVoice, setBrandVoice] = useState(profile.brandVoice);
  const [websiteUrl, setWebsiteUrl] = useState(profile.websiteUrl);
  const [goals, setGoals] = useState(profile.goals.join(", "));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/raalhu/business-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          industry: industry || undefined,
          description: description || undefined,
          targetAudience: targetAudience || undefined,
          brandVoice: brandVoice || undefined,
          websiteUrl: websiteUrl || undefined,
          goals: goals
            ? goals.split(",").map((g) => g.trim()).filter(Boolean)
            : undefined,
        }),
      });
      if (!res.ok) throw new Error("Could not save the profile.");
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
        <Button variant="outline" size="sm">
          <Pencil /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Business profile</DialogTitle>
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
            <Label htmlFor="profile-name">Business name</Label>
            <Input
              id="profile-name"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-industry">Industry</Label>
            <Input
              id="profile-industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-description">Description</Label>
            <Textarea
              id="profile-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-audience">Target audience</Label>
            <Textarea
              id="profile-audience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-voice">Brand voice</Label>
            <Textarea
              id="profile-voice"
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-website">Website</Label>
            <Input
              id="profile-website"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-goals">Goals</Label>
            <Input
              id="profile-goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              placeholder="More leads, Grow social media"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !businessName.trim()}>
              {loading && <Loader2 className="animate-spin" />}
              {loading ? "Saving…" : "Save profile"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
