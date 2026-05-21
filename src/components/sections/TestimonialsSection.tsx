"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Marcus Chen",
    role: "Full-time Trader",
    avatar: "MC",
    color: "#00D4FF",
    rating: 5,
    text: "SkillPips completely transformed my trading. Within 3 months I went from blowing accounts to consistently extracting profits. The VIP signals alone paid for my membership 10x over.",
    profit: "+$12,400",
    period: "First 3 months",
  },
  {
    name: "Sarah Blackwell",
    role: "Forex Educator",
    avatar: "SB",
    color: "#FFB800",
    rating: 5,
    text: "The institutional strategy content here is world-class. I've tried 5 other platforms and nothing comes close to the depth and quality of SkillPips courses.",
    profit: "+$8,200",
    period: "Month 2",
  },
  {
    name: "James Okafor",
    role: "Part-time Trader",
    avatar: "JO",
    color: "#00D4A0",
    rating: 5,
    text: "I started knowing absolutely nothing about forex. 6 months later I'm trading profitably part-time alongside my job. The community support is incredible.",
    profit: "+$4,800",
    period: "6 months",
  },
  {
    name: "Priya Sharma",
    role: "Hedge Fund Analyst",
    avatar: "PS",
    color: "#A855F7",
    rating: 5,
    text: "Even with my professional background, SkillPips taught me retail-specific tactics I'd never seen before. The psychology content is genuinely elite level.",
    profit: "+$31,200",
    period: "Year 1",
  },
  {
    name: "Tyler Rodriguez",
    role: "Swing Trader",
    avatar: "TR",
    color: "#FF6B6B",
    rating: 5,
    text: "The live sessions are the best investment I've ever made. Watching professional traders in real-time, explaining every decision — priceless education.",
    profit: "+$9,600",
    period: "4 months",
  },
  {
    name: "Emma Williams",
    role: "Ex-Retail Banker",
    avatar: "EW",
    color: "#4ECDC4",
    rating: 5,
    text: "Left a stressful banking career to trade full-time. SkillPips gave me the foundation, confidence, and community to make that leap successfully.",
    profit: "+$22,000",
    period: "8 months",
  },
  {
    name: "Kenji Tanaka",
    role: "Day Trader",
    avatar: "KT",
    color: "#00D4FF",
    rating: 5,
    text: "I've been trading for 5 years struggling to be consistent. After 2 months with SkillPips I found my edge and haven't looked back. Best decision I've made.",
    profit: "+$7,300",
    period: "2 months",
  },
  {
    name: "Aisha Mensah",
    role: "Entrepreneur",
    avatar: "AM",
    color: "#FFB800",
    rating: 5,
    text: "The risk management framework alone is worth the entire subscription. I used to blow accounts with 5% risk. Now I compound consistently with 1% risk rules.",
    profit: "+$15,800",
    period: "5 months",
  },
];

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div className="card-premium rounded-2xl p-6 min-w-[320px] max-w-[320px] flex flex-col gap-4 flex-shrink-0">
      {/* Quote icon */}
      <Quote className="w-6 h-6 opacity-20" style={{ color: t.color }} />

      {/* Stars */}
      <div className="flex gap-1">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
        ))}
      </div>

      {/* Text */}
      <p className="text-sm text-white/60 leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>

      {/* Profit badge */}
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold"
        style={{ color: t.color, background: `${t.color}15`, border: `1px solid ${t.color}25` }}
      >
        <span>{t.profit}</span>
        <span className="text-white/30">·</span>
        <span className="text-white/40">{t.period}</span>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-[#080A0F]"
          style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}80)` }}
        >
          {t.avatar}
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{t.name}</div>
          <div className="text-xs text-white/35">{t.role}</div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const row1 = testimonials.slice(0, 4);
  const row2 = testimonials.slice(4, 8);

  return (
    <section id="testimonials" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#080A0F]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative" ref={ref}>
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-6">
              <Star className="w-3.5 h-3.5 text-[#FFB800] fill-[#FFB800]" />
              <span className="text-xs text-white/50 font-medium tracking-wide uppercase">
                Trader Success Stories
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-syne font-bold text-white mb-4">
              Real Results From{" "}
              <span className="gradient-text-gold">Real Traders</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto">
              Join thousands of traders who have transformed their trading career with SkillPips.
            </p>
          </motion.div>
        </div>

        {/* Scrolling rows */}
        <div className="space-y-5 overflow-hidden">
          {/* Row 1 — left */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#080A0F] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#080A0F] to-transparent z-10 pointer-events-none" />
            <div className="flex gap-5 animate-scroll-left">
              {[...row1, ...row1, ...row1].map((t, i) => (
                <TestimonialCard key={i} t={t} />
              ))}
            </div>
          </div>

          {/* Row 2 — right */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#080A0F] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#080A0F] to-transparent z-10 pointer-events-none" />
            <div className="flex gap-5 animate-scroll-right">
              {[...row2, ...row2, ...row2].map((t, i) => (
                <TestimonialCard key={i} t={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
