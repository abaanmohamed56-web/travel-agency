"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { UserPlus, GraduationCap, TrendingUp, ArrowRight } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Join SkillPips",
    description:
      "Create your account in under 2 minutes. Choose a plan that fits your goals and get instant access to the entire platform.",
    color: "#00D4FF",
    details: ["Instant account creation", "Choose your plan", "Access all resources immediately"],
  },
  {
    step: "02",
    icon: GraduationCap,
    title: "Learn Proven Strategies",
    description:
      "Follow structured learning paths taught by professional traders with 10+ years of experience in Forex markets.",
    color: "#FFB800",
    details: ["Structured learning paths", "Live mentorship sessions", "Strategy backtesting workshops"],
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Trade With Confidence",
    description:
      "Apply your knowledge in real markets with our live signals, daily analysis, and a community always by your side.",
    color: "#00D4A0",
    details: ["Live trading signals", "Daily market briefings", "Community trade reviews"],
  },
];

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#080A0F] via-[#0A0D14] to-[#080A0F]" />

      {/* BG grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,212,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-6">
            <span className="text-xs text-white/50 font-medium tracking-wide uppercase">
              Your Trading Journey
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-syne font-bold text-white mb-4">
            How It{" "}
            <span className="gradient-text-blue">Works</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto">
            Three simple steps to transform your trading from uncertain to consistently profitable.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute top-16 left-[16.67%] right-[16.67%] h-px hidden lg:block">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-gradient-to-r from-[#00D4FF]/50 via-[#FFB800]/50 to-[#00D4A0]/50 origin-left"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col items-center text-center lg:items-start lg:text-left"
              >
                {/* Step number & icon */}
                <div className="relative mb-8">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
                    style={{
                      background: `linear-gradient(135deg, ${step.color}20, ${step.color}10)`,
                      border: `2px solid ${step.color}40`,
                    }}
                  >
                    <step.icon className="w-7 h-7" style={{ color: step.color }} />
                  </div>
                  {/* Glow */}
                  <div
                    className="absolute inset-0 rounded-2xl blur-xl"
                    style={{ background: step.color, opacity: 0.15 }}
                  />
                  {/* Step number */}
                  <div
                    className="absolute -top-3 -right-3 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center text-[#080A0F] z-20"
                    style={{ background: step.color }}
                  >
                    {i + 1}
                  </div>
                </div>

                {/* Step indicator */}
                <div className="text-xs font-mono mb-3" style={{ color: `${step.color}80` }}>
                  STEP {step.step}
                </div>

                <h3 className="text-2xl font-syne font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-white/45 leading-relaxed mb-6">{step.description}</p>

                {/* Details */}
                <ul className="space-y-2 w-full">
                  {step.details.map((detail) => (
                    <li key={detail} className="flex items-center gap-2 text-sm text-white/50">
                      <div
                        className="w-1 h-1 rounded-full flex-shrink-0"
                        style={{ background: step.color }}
                      />
                      {detail}
                    </li>
                  ))}
                </ul>

                {/* Arrow for desktop */}
                {i < steps.length - 1 && (
                  <div className="absolute -right-4 top-16 hidden lg:block z-20">
                    <ArrowRight className="w-4 h-4 text-white/20" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.7 }}
          className="text-center mt-16"
        >
          <a
            href="/auth/register"
            className="group inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-[#080A0F] bg-gradient-to-r from-[#00D4FF] to-[#0099CC] rounded-xl hover:shadow-glow-blue transition-all duration-300"
          >
            Start Your Journey Today
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
