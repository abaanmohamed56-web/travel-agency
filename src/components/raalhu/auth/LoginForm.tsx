"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/raalhu/ui/button";
import { Input } from "@/components/raalhu/ui/input";
import { Label } from "@/components/raalhu/ui/label";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/raalhu/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.ok) {
      router.push(callbackUrl);
      router.refresh();
    } else {
      setError("Invalid email or password.");
      setLoading(false);
    }
  }

  return (
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading && <Loader2 className="animate-spin" />}
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
