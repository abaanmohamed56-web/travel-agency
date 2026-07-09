"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { RaalhuLogo } from "@/components/raalhu/RaalhuLogo";
import { Button } from "@/components/raalhu/ui/button";
import { Card } from "@/components/raalhu/ui/card";
import { Input } from "@/components/raalhu/ui/input";
import { Label } from "@/components/raalhu/ui/label";
import { Textarea } from "@/components/raalhu/ui/textarea";
import { slugify } from "@/modules/raalhu/lib/validation";

const GOAL_OPTIONS = [
  "More website traffic",
  "More leads",
  "More sales",
  "Grow social media",
  "Build brand awareness",
  "Launch a product",
];

export function OnboardingFlow() {
  const router = useRouter();
  const { update } = useSession();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [orgName, setOrgName] = useState("");
  const [industry, setIndustry] = useState("");
  const [description, setDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [brandVoice, setBrandVoice] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [goals, setGoals] = useState<string[]>([]);

  function toggleGoal(goal: string) {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/raalhu/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: orgName,
          slug: slugify(orgName),
          profile: {
            businessName: orgName,
            industry: industry || undefined,
            description: description || undefined,
            targetAudience: targetAudience || undefined,
            brandVoice: brandVoice || undefined,
            websiteUrl: websiteUrl || undefined,
            goals: goals.length ? goals : undefined,
          },
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.error === "validation_failed"
            ? "Please check the fields and try again."
            : "Something went wrong creating your workspace."
        );
      }
      const data = await res.json();
      // Write the new org into the session JWT, then enter the dashboard.
      await update({ raalhuOrgId: data.organization.id });
      router.push("/raalhu/dashboard");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  const canContinue = orgName.trim().length >= 2;

  return (
    <LazyMotion features={domAnimation}>
      <main className="r-hero-backdrop flex min-h-dvh flex-col items-center justify-center px-6 py-12">
        <RaalhuLogo className="mb-10" />
        <Card variant="glass-deep" className="w-full max-w-xl p-8">
          <div className="mb-6 flex items-center gap-2">
            {[0, 1].map((i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= step ? "bg-primary" : "bg-secondary"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {step === 0 ? (
              <m.div
                key="step-0"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Name your workspace
                  </h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Usually your business or brand name. Your AI team works
                    inside this workspace.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="orgName">Business name</Label>
                  <Input
                    id="orgName"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Villa Faru Guesthouse"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry (optional)</Label>
                  <Input
                    id="industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g. Hospitality, E-commerce, SaaS"
                  />
                </div>
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={() => setStep(1)}
                    disabled={!canContinue}
                    className="group"
                  >
                    Continue
                    <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </div>
              </m.div>
            ) : (
              <m.div
                key="step-1"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Teach the AI your business
                  </h1>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    Everything here shapes strategy, tone, and content. You can
                    refine it later in Settings.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">What do you do?</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. A 12-room beachfront guesthouse in the Maldives offering diving trips and local experiences."
                    rows={3}
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="audience">Target audience</Label>
                    <Input
                      id="audience"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g. Adventure travelers, couples"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="voice">Brand voice</Label>
                    <Input
                      id="voice"
                      value={brandVoice}
                      onChange={(e) => setBrandVoice(e.target.value)}
                      placeholder="e.g. Warm, personal, adventurous"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website (optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://…"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Goals</Label>
                  <div className="flex flex-wrap gap-2">
                    {GOAL_OPTIONS.map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => toggleGoal(goal)}
                        className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                          goals.includes(goal)
                            ? "border-primary/60 bg-primary/15 text-primary"
                            : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {goal}
                      </button>
                    ))}
                  </div>
                </div>
                {error && (
                  <p className="text-sm text-red-400" role="alert">
                    {error}
                  </p>
                )}
                <div className="flex justify-between pt-2">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(0)}
                    disabled={submitting}
                  >
                    <ArrowLeft />
                    Back
                  </Button>
                  <Button onClick={submit} disabled={submitting}>
                    {submitting && <Loader2 className="animate-spin" />}
                    {submitting ? "Creating workspace…" : "Launch my AI team"}
                  </Button>
                </div>
              </m.div>
            )}
          </AnimatePresence>
        </Card>
      </main>
    </LazyMotion>
  );
}
