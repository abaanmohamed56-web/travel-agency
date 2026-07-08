"use client";

import Link from "next/link";
import { LazyMotion, domAnimation, m } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Calendar,
  Globe,
  Mail,
  Megaphone,
  MessageSquare,
  PenLine,
  Search,
  Share2,
  Target,
  Users,
} from "lucide-react";
import { buttonVariants } from "@/components/raalhu/ui/button";
import { RaalhuLogo } from "@/components/raalhu/RaalhuLogo";
import { cn } from "@/lib/utils";

const AGENTS = [
  { icon: Brain, name: "Master Agent", role: "Understands your goal and orchestrates the whole team" },
  { icon: Target, name: "Marketing Manager", role: "Turns research into strategy and delegates the work" },
  { icon: Search, name: "Research Agent", role: "Studies your business, market, and competitors" },
  { icon: Globe, name: "SEO Agent", role: "Keywords, technical SEO, and content optimization" },
  { icon: PenLine, name: "Content Writer", role: "Blogs, captions, scripts — always in your brand voice" },
  { icon: Share2, name: "Social Media Agent", role: "Plans and schedules posts across every channel" },
  { icon: Mail, name: "Email Agent", role: "Campaigns, sequences, and lifecycle messaging" },
  { icon: BarChart3, name: "Analytics Agent", role: "Measures results and feeds learnings back in" },
];

const STEPS = [
  { step: "01", title: "Tell Raalhu your goal", body: "One sentence is enough. “Grow my guesthouse.” “Increase bookings.” The Master Agent takes it from there." },
  { step: "02", title: "The team researches", body: "Your business, audience, competitors, and trends are analyzed to find real opportunities." },
  { step: "03", title: "Strategy becomes work", body: "Campaigns, content calendars, and creative briefs are drafted by specialist agents — for your approval." },
  { step: "04", title: "Learn and repeat", body: "Results flow back into the system. Every week the strategy gets sharper, automatically." },
];

const FEATURES = [
  { icon: MessageSquare, title: "AI command center", body: "A chat that does the work: ask for strategy, content, or reports and watch agents execute in real time." },
  { icon: Megaphone, title: "Campaigns", body: "Multi-channel campaign drafts with objectives, budgets, and briefs — generated and tracked in one place." },
  { icon: Calendar, title: "Content calendar", body: "A full publishing schedule created for you, visualized month by month." },
  { icon: Users, title: "CRM built in", body: "Leads, pipeline stages, and customer profiles connected to every campaign." },
  { icon: BarChart3, title: "Live analytics", body: "Revenue, traffic, engagement, and growth — one dashboard, always current." },
  { icon: Brain, title: "Learns your brand", body: "Tone, audience, and goals are captured once and honored by every agent, in every artifact." },
];

const sectionReveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.21, 0.6, 0.35, 1] as const } },
};

function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <m.div
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </m.div>
  );
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-4 text-pretty text-muted-foreground">{body}</p>
    </Reveal>
  );
}

export function LandingSections() {
  return (
    <LazyMotion features={domAnimation}>
      <section id="agents" className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow="The team"
          title="A department of specialists, on demand"
          body="Every agent has a job, a brief, and your brand voice. The Master Agent coordinates them so you don't have to."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AGENTS.map((agent, i) => (
            <Reveal key={agent.name} delay={i * 0.05}>
              <div className="r-glass group h-full rounded-xl p-5 transition-colors duration-300 hover:border-primary/30">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <agent.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-medium">{agent.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{agent.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="r-divider mx-auto max-w-5xl" />

      <section id="how" className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow="How it works"
          title="From one sentence to a running strategy"
          body="Raalhu compresses weeks of marketing work into a continuous, self-improving loop."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item, i) => (
            <Reveal key={item.step} delay={i * 0.06}>
              <div className="relative h-full rounded-xl border border-border bg-card p-6">
                <span className="text-sm font-semibold text-primary">{item.step}</span>
                <h3 className="mt-3 font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="r-divider mx-auto max-w-5xl" />

      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <SectionHeading
          eyebrow="Platform"
          title="Everything growth needs, in one place"
          body="Not another tool to manage — an operating system that manages the work itself."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.05}>
              <div className="h-full rounded-xl border border-border bg-card p-6 transition-colors duration-300 hover:border-primary/30">
                <feature.icon className="size-5 text-primary" />
                <h3 className="mt-4 font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="px-6 pb-28 pt-8">
        <Reveal className="mx-auto max-w-4xl">
          <div className="r-glass-deep r-glow-soft relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-10%,rgba(30,167,255,0.18),transparent)]" />
            <h2 className="relative text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to hand off the busywork?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
              Set up your business profile in two minutes. Your AI marketing team takes it from there.
            </p>
            <Link
              href="/auth/register"
              className={cn(buttonVariants({ size: "lg" }), "group relative mt-8")}
            >
              Get started free
              <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
          <RaalhuLogo />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Raalhu AI. Autonomous marketing, human results.
          </p>
        </div>
      </footer>
    </LazyMotion>
  );
}
