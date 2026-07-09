"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/raalhu/ui/button";
import { Input } from "@/components/raalhu/ui/input";
import { Label } from "@/components/raalhu/ui/label";
import { GoogleSignInButton } from "@/components/raalhu/auth/GoogleSignInButton";

export function RegisterForm({ googleConfigured }: { googleConfigured: boolean }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (res.status === 409) {
        throw new Error("An account with this email already exists.");
      }
      if (!res.ok) {
        throw new Error(
          "Could not create your account. Password must be at least 8 characters."
        );
      }
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!result?.ok) throw new Error("Account created — please sign in.");
      router.push("/raalhu/onboarding");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      {googleConfigured && (
        <>
          <GoogleSignInButton callbackUrl="/raalhu/onboarding" />
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            or
            <div className="h-px flex-1 bg-border" />
          </div>
        </>
      )}
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
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            autoComplete="name"
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading && <Loader2 className="animate-spin" />}
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </div>
  );
}
