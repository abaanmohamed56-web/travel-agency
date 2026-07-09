"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/raalhu/ui/button";

export function DisconnectSocialButton({ provider }: { provider: "instagram" | "tiktok" }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  async function disconnect() {
    setLoading(true);
    await fetch(`/api/raalhu/social/${provider}`, { method: "DELETE" });
    setLoading(false);
    startTransition(() => router.refresh());
  }

  return (
    <Button variant="outline" size="sm" onClick={disconnect} disabled={loading || pending}>
      {loading || pending ? <Loader2 className="animate-spin" /> : null}
      Disconnect
    </Button>
  );
}
