"use client";

import Link from "next/link";
import { LazyMotion, domAnimation, m } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/raalhu/ui/button";
import { cn } from "@/lib/utils";

const EXAMPLE_PROMPTS = [
  "Grow my guesthouse",
  "Make 30 Instagram posts",
  "Improve my SEO",
  "Run Facebook ads",
  "Create a funnel",
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.08 * i, ease: [0.21, 0.6, 0.35, 1] as const },
  }),
};

export function Hero() {
  return (
    <LazyMotion features={domAnimation}>
      <section className="r-hero-backdrop relative overflow-hidden pb-24 pt-36">
        <div className="r-grid-backdrop pointer-events-none absolute inset-0" />
        <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
          <m.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <span className="r-glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <Sparkles className="size-3.5 text-primary" />
              The autonomous marketing operating system
            </span>
          </m.div>

          <m.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-7 text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
          >
            Your marketing team,
            <br />
            <span className="r-gradient-text">run by AI.</span>
          </m.h1>

          <m.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground"
          >
            Type one sentence. Raalhu researches your business, builds the
            strategy, creates the campaigns and content, and keeps improving —
            a full marketing department working while you sleep.
          </m.p>

          <m.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row"
          >
            <Link
              href="/raalhu/register"
              className={cn(buttonVariants({ size: "lg" }), "group")}
            >
              Start growing
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#how"
              className={buttonVariants({ variant: "glass", size: "lg" })}
            >
              See how it works
            </Link>
          </m.div>

          <m.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-14 w-full"
          >
            <div className="r-glass-deep mx-auto max-w-2xl rounded-2xl p-2 shadow-2xl">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-input px-4 py-3.5 text-left">
                <span className="r-pulse-dot size-2 rounded-full bg-primary" />
                <span className="flex-1 truncate text-sm text-muted-foreground">
                  &ldquo;Grow my business.&rdquo;
                </span>
                <span className="rounded-md bg-primary/15 px-2 py-1 text-xs font-medium text-primary">
                  → 6 agents deployed
                </span>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2 px-2 pb-2 pt-1">
                {EXAMPLE_PROMPTS.map((prompt) => (
                  <span
                    key={prompt}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
                  >
                    {prompt}
                  </span>
                ))}
              </div>
            </div>
          </m.div>
        </div>
      </section>
    </LazyMotion>
  );
}
