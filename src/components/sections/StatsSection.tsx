"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, BookOpen, Star, Clock } from "lucide-react";

function useCounter(end: number, duration: number = 2000, inView: boolean = false) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [end, duration, inView]);

  return count;
}

const stats = [
  {
    icon: Users,
    value: 20000,
    suffix: "+",
    label: "Active Members",
    sublabel: "Traders worldwide",
    color: "#00D4FF",
  },
  {
    icon: BookOpen,
    value: 1000,
    suffix: "+",
    label: "Lessons",
    sublabel: "Expert-crafted content",
    color: "#FFB800",
  },
  {
    icon: Star,
    value: 95,
    suffix: "%",
    label: "Satisfaction Rate",
    sublabel: "From verified traders",
    color: "#00D4A0",
  },
  {
    icon: Clock,
    value: 24,
    suffix: "/7",
    label: "Community",
    sublabel: "Always-on support",
    color: "#A855F7",
  },
];

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCounter(stat.value, 2200, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      <div className="card-premium rounded-2xl p-8 text-center h-full relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${stat.color}10 0%, transparent 70%)`,
          }}
        />

        {/* Icon */}
        <div
          className="relative inline-flex w-14 h-14 rounded-xl items-center justify-center mb-6"
          style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}
        >
          <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: `0 0 20px ${stat.color}40` }}
          />
        </div>

        {/* Number */}
        <div
          className="text-5xl font-syne font-extrabold mb-2 leading-none"
          style={{ color: stat.color }}
        >
          {stat.value === 24 ? count : count.toLocaleString()}
          <span className="text-3xl">{stat.suffix}</span>
        </div>

        {/* Label */}
        <div className="text-base font-semibold text-white mb-1">{stat.label}</div>
        <div className="text-sm text-white/40">{stat.sublabel}</div>

        {/* Bottom line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${stat.color}60, transparent)` }}
        />
      </div>
    </motion.div>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#080A0F] via-[#0A0D14] to-[#080A0F]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-6">
            <span className="text-xs text-white/50 font-medium tracking-wide uppercase">
              Trusted by Traders Worldwide
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-syne font-bold text-white mb-4">
            Numbers That{" "}
            <span className="gradient-text-blue">Speak</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Join a thriving community of professional traders who have transformed
            their trading with SkillPips.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.8, duration: 1.2 }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-[#00D4FF]/30 to-transparent"
        />
      </div>
    </section>
  );
}
