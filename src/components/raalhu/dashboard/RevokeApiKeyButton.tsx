"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/raalhu/ui/button";

export function RevokeApiKeyButton({ apiKeyId }: { apiKeyId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (!confirm("Revoke this API key? This can't be undone.")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/raalhu/api-keys/${apiKeyId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("failed");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      disabled={loading}
      aria-label="Revoke key"
    >
      {loading ? <Loader2 className="animate-spin" /> : <Trash2 />}
    </Button>
  );
}
