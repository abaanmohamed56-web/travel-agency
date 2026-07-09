"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/raalhu/ui/button";

export function RemoveMemberButton({ membershipId }: { membershipId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    if (!confirm("Remove this member from the workspace?")) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/raalhu/members/${membershipId}`, {
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
      aria-label="Remove member"
    >
      {loading ? <Loader2 className="animate-spin" /> : <X />}
    </Button>
  );
}
