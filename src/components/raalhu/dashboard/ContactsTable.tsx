"use client";

import { useState } from "react";
import Link from "next/link";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/raalhu/ui/avatar";
import { Card } from "@/components/raalhu/ui/card";
import { StageSelect, type LeadStage } from "@/components/raalhu/dashboard/StageSelect";

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
        <>
          {/* Mobile: card list — a 4-column table doesn't fit a phone width. */}
          <div className="space-y-2 sm:hidden">
            {filtered.map((c) => (
              <Card key={c.id} variant="glass" className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/raalhu/dashboard/crm/${c.id}`}
                    className="flex min-w-0 items-center gap-3"
                  >
                    <Avatar name={c.name} className="size-8 shrink-0 text-[10px]" />
                    <div className="min-w-0">
                      <p className="truncate font-medium hover:text-primary">
                        {c.name ?? "Unknown"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {c.email ?? "—"}
                      </p>
                    </div>
                  </Link>
                  <StageSelect contactId={c.id} stage={c.stage as LeadStage} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                  <span>{c.source ?? "—"}</span>
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {/* Desktop: full table. */}
          <Card variant="glass" className="hidden overflow-x-auto sm:block">
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
                      <Link
                        href={`/raalhu/dashboard/crm/${c.id}`}
                        className="flex items-center gap-3"
                      >
                        <Avatar name={c.name} className="size-8 text-[10px]" />
                        <div className="min-w-0">
                          <p className="truncate font-medium hover:text-primary">
                            {c.name ?? "Unknown"}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {c.email ?? "—"}
                          </p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-3">
                      <StageSelect contactId={c.id} stage={c.stage as LeadStage} />
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {c.source ?? "—"}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1">
                        {c.tags.length ? (
                          c.tags.map((t) => (
                            <span
                              key={t}
                              className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                            >
                              {t}
                            </span>
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
        </>
      )}
    </>
  );
}
