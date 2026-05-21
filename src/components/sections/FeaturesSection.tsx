"use client";

import { useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  Zap, TrendingUp, BookOpen, BarChart2, Brain, Shield, Users, LineChart,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "VIP Signals",
    description:
      "Real-time trade alerts with precise entry, stop loss, and take profit levels. Our signals have a verified 87%+ win rate.",
    color: "#00D4FF",
    tag: "Live",
  },
  {
    icon: TrendingUp,
    title: "Live Trading Sessions",
    description:
      "Watch professional traders execute live in real markets. Learn trade setups, risk management, and decision-making in action.",
    color: "#FFB800",
    tag: "Daily",
  },
  {
    icon: BookOpen,
    title: "Forex Courses",
    description:
      "Structured learning paths from beginner to advanced. Over 1,000 lessons covering technical analysis, fundamentals, and more.",
    color: "#A855F7",
    tag: "1000+ Lessons",
  },
  {
    icon: BarChart2,
    title: "Market Analysis",
    description:
      "Daily forex market reports, economic calendar events, and institutional flow analysis delivered straight to your dashboard.",
    color: "#00D4A0",
    tag: "Daily Reports",
  },
  {
    icon: Brain,
    title: "Trading Psychology",
    description:
      "Master the mental game of trading. Emotional control, discipline frameworks, and building the trader's mindset that wins.",
    color: "#FF6B6B",
    tag: "Mindset",
  },
  {
    icon: Shield,
    title: "Risk Management",
    description:
      "Professional-grade risk frameworks. Position sizing, portfolio management, and protecting your capital in volatile markets.",
    color: "#4ECDC4",
    tag: "Protect Capital",
  },
  {
    icon: Users,
    title: "Community Access",
    description:
      "Join 20,000+ traders in our private community. Share trades, discuss setups, and grow alongside serious market participants.",
    color: "#45B7D1",
    tag: "20K+ Members",
  },
  {
    icon: LineChart,
    title: "Trading Journal",
    description:
      "Track every trade, analyze your performance metrics, identify patterns, and continuously refine your edge in the market.",
    color: "#96CEB4",
    tag: "Analytics",
  },
];

function FeatureCard({
  feature,
  index,
  inView,
}: {
  feature: (typeof features)[0];
  index: number;
  inView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-150, 150], [8, -8]);
  const rotateY = useTransform(mouseX, [-150, 150], [-8, 8]);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        delay: index * 0.08,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        style={{ rotateX: springRotateX, rotateY: springRotateY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative group h-full"
      >
        <div className="card-premium rounded-2xl p-6 h-full relative overflow-hidden cursor-default">
          {/* Glow on hover */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${feature.color}12 0%, transparent 60%)`,
            }}
          />

          {/* Top line on hover */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `linear-gradient(90deg, transparent, ${feature.color}60, transparent)`,
            }}
          />

          {/* Tag */}
          <div className="flex items-center justify-between mb-5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: `${feature.color}18`, border: `1px solid ${feature.color}30` }}
            >
              <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
            </div>
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full"
              style={{
                color: feature.color,
                background: `${feature.color}15`,
                border: `1px solid ${feature.color}25`,
              }}
            >
              {feature.tag}
            </span>
          </div>

          {/* Content */}
          <h3 className="text-lg font-syne font-semibold text-white mb-2 group-hover:text-white transition-colors">
            {feature.title}
          </h3>
          <p className="text-sm text-white/45 leading-relaxed">{feature.description}</p>

          {/* Arrow */}
          <div
            className="mt-5 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1"
            style={{ color: feature.color }}
          >
            Learn more →
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#080A0F]" />

      {/* Decorative */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.04)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-6">
            <Zap className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span className="text-xs text-white/50 font-medium tracking-wide uppercase">
              Everything You Need
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-syne font-bold text-white mb-4">
            The Complete{" "}
            <span className="gradient-text-gold">Trading Suite</span>
          </h2>
          <p className="text-white/40 max-w-2xl mx-auto text-base">
            SkillPips provides every tool, lesson, and resource you need to go from
            novice to consistently profitable trader.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} feature={feature} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
