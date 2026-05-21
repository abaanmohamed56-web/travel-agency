"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

function FloatingParticle({ x, y, size, delay, color }: {
  x: number; y: number; size: number; delay: number; color: string;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: color,
        filter: `blur(${size / 2}px)`,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.3, 0.8, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 4 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

const ctaParticles = Array.from({ length: 20 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 4 + Math.random() * 8,
  delay: i * 0.3,
  color: i % 2 === 0 ? "rgba(0,212,255,0.5)" : "rgba(255,184,0,0.4)",
}));

export function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#080A0F]" />

      {/* Gradient bg */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(0,212,255,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(255,184,0,0.06)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(168,85,247,0.04)_0%,transparent_50%)]" />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {ctaParticles.map((p, i) => <FloatingParticle key={i} {...p} />)}
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00D4FF]/20 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" ref={ref}>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[#00D4FF]/20 mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
          <span className="text-xs text-[#00D4FF] font-medium">Join 20,000+ traders today</span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-syne font-extrabold text-white leading-tight mb-6"
        >
          Start Your
          <br />
          <span className="gradient-text-blue">Trading Journey</span>
          <br />
          <span className="gradient-text-gold">Today.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-lg text-white/40 max-w-xl mx-auto mb-10"
        >
          No experience needed. Join SkillPips and get instant access to everything
          you need to trade forex professionally.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Link
            href="/auth/register"
            className="group relative flex items-center gap-2 px-10 py-5 text-base font-bold text-[#080A0F] rounded-xl overflow-hidden min-w-[220px] justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF] to-[#0099CC]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF] to-[#0099CC] blur-xl opacity-0 group-hover:opacity-60 transition-opacity scale-110" />
            <Zap className="relative w-4 h-4" />
            <span className="relative">Join SkillPips</span>
            <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="#pricing"
            className="flex items-center gap-2 px-8 py-5 text-base font-medium text-white/70 hover:text-white glass rounded-xl border border-white/10 hover:border-white/20 transition-all min-w-[180px] justify-center"
          >
            View Pricing
          </Link>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/25"
        >
          {[
            "✓ 7-day free trial",
            "✓ No credit card required",
            "✓ Cancel anytime",
            "✓ 30-day money-back guarantee",
          ].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
