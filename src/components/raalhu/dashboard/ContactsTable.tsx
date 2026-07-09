"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/raalhu/ui/avatar";
import { Badge } from "@/components/raalhu/ui/badge";
import { Card } from "@/components/raalhu/ui/card";

export interface ContactRow {
  id: string;
  name: string | null;
  email: string | null;
  company: string | null;
  stage: string;
  source: string | null;
  tags: string[];
  updatedAt: string;
}

const STAGES = ["ALL", "LEAD", "MQL", "SQL", "CUSTOMER", "CHURNED"] as const;

const STAGE_BADGE: Record<string, "default" | "secondary" | "success" | "warning" | "destructive" | "outline"> = {
  LEAD: "secondary",
  MQL: "default",
  SQL: "warning",
  CUSTOMER: "success",
  CHURNED: "outline",
};

export function ContactsTable({ contacts }: { contacts: ContactRow[] }) {
  const [stage, setStage] = useState<(typeof STAGES)[number]>("ALL");
  const filtered =
    stage === "ALL" ? contacts : contacts.filter((c) => c.stage === stage);

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {STAGES.map((s) => {
          const count =
            s === "ALL"
              ? contacts.length
              : contacts.filter((c) => c.stage === s).length;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setStage(s)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                stage === s
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {s === "ALL" ? "All" : s} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <Card variant="glass" className="flex flex-col items-center gap-3 p-12 text-center">
          <Users className="size-8 text-primary" />
          <h2 className="font-medium">No contacts here</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            {contacts.length === 0
              ? "Leads captured by forms, ads, and your AI team will appear here."
              : "No contacts in this stage yet."}
          </p>
        </Card>
      ) : (
        <Card variant="glass" className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Stage</th>
                <th className="px-5 py-3 font-medium">Source</th>
                <th className="px-5 py-3 font-medium">Tags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} className="size-8 text-[10px]" />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{c.name ?? "Unknown"}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {c.email ?? "—"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={STAGE_BADGE[c.stage] ?? "secondary"}>
                      {c.stage}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {c.source ?? "—"}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.length ? (
                        c.tags.map((t) => (
                          <Badge key={t} variant="outline">{t}</Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  );
}
