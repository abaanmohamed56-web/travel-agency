"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  Globe,
  Loader2,
  Mail,
  PenLine,
  Search,
  Send,
  Share2,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/raalhu/ui/button";
import { Card } from "@/components/raalhu/ui/card";
import { Textarea } from "@/components/raalhu/ui/textarea";
import {
  useAgentStream,
  type ActivityItem,
  type ChatTurn,
} from "@/components/raalhu/chat/useAgentStream";

const AGENT_META: Record<string, { name: string; icon: typeof Brain }> = {
  master: { name: "Master Agent", icon: Brain },
  "marketing-manager": { name: "Marketing Manager", icon: Target },
  research: { name: "Research Agent", icon: Search },
  seo: { name: "SEO Agent", icon: Globe },
  content: { name: "Content Writer", icon: PenLine },
  social: { name: "Social Media Agent", icon: Share2 },
  email: { name: "Email Agent", icon: Mail },
  analytics: { name: "Analytics Agent", icon: BarChart3 },
};

const SUGGESTIONS = [
  "Grow my business",
  "Plan next month's content",
  "Draft a campaign for our slow season",
  "How can we get more leads?",
];

function ActivityChip({ item }: { item: ActivityItem }) {
  const meta = AGENT_META[item.agentId] ?? {
    name: item.agentId,
    icon: Wrench,
  };
  const Icon = item.kind === "tool" ? Wrench : meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs",
        item.done
          ? "border-border text-muted-foreground"
          : "border-primary/40 bg-primary/10 text-primary"
      )}
    >
      {item.done ? (
        <Check className="size-3" />
      ) : (
        <Loader2 className="size-3 animate-spin" />
      )}
      <Icon className="size-3" />
      {item.kind === "agent" ? meta.name : item.label.replaceAll("_", " ")}
    </span>
  );
}

function Turn({ turn }: { turn: ChatTurn }) {
  if (turn.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary/15 px-4 py-2.5 text-sm">
          {turn.text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {(turn.activity?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {turn.activity!.map((a) => (
            <ActivityChip key={a.id} item={a} />
          ))}
        </div>
      )}
      {turn.text && (
        <div className="max-w-[92%] whitespace-pre-wrap rounded-2xl rounded-bl-md border border-border bg-card px-4 py-2.5 text-sm leading-relaxed">
          {turn.text}
        </div>
      )}
      {(turn.artifacts?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {turn.artifacts!.map((a) => (
            <Link
              key={a.id}
              href={a.href}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs text-primary transition-colors hover:bg-primary/20"
            >
              {a.title}
              <ArrowRight className="size-3" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function CommandCenterChat({ aiConfigured }: { aiConfigured: boolean }) {
  const router = useRouter();
  // Refreshes server-rendered data (stat cards, "Coming up") once a run
  // finishes, so newly created campaigns/content show up without a manual
  // page reload — router.refresh() re-fetches the page's server data only,
  // it doesn't reset this component's own chat state.
  const { turns, streaming, error, send } = useAgentStream(() => router.refresh());
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [turns]);

  function submit(text?: string) {
    const message = (text ?? input).trim();
    if (!message || streaming || !aiConfigured) return;
    setInput("");
    void send(message);
  }

  return (
    <Card variant="glass-deep" className="flex min-h-[520px] flex-col">
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto p-6">
        {turns.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-10 text-center">
            <span className="r-glow-soft flex size-12 items-center justify-center rounded-2xl bg-primary/12">
              <Sparkles className="size-6 text-primary" />
            </span>
            <h2 className="mt-5 text-lg font-medium">
              What should we work on?
            </h2>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              One sentence is enough — the Master Agent will brief the team,
              and you&rsquo;ll watch the work happen live.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={!aiConfigured || streaming}
                  onClick={() => submit(s)}
                  className="rounded-full border border-border px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          turns.map((turn, i) => <Turn key={i} turn={turn} />)
        )}
        {error && (
          <p
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>

      <div className="border-t border-border p-4">
        {!aiConfigured && (
          <p className="mb-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-400">
            Add <code className="font-mono">ANTHROPIC_API_KEY</code> to your
            environment to bring the AI team online.
          </p>
        )}
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={
              aiConfigured
                ? "Tell your AI team what you need…"
                : "AI team offline — configure the API key to begin"
            }
            disabled={!aiConfigured || streaming}
            rows={1}
            className="min-h-[44px] resize-none"
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Send"
            disabled={!aiConfigured || streaming || !input.trim()}
          >
            {streaming ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </form>
      </div>
    </Card>
  );
}
