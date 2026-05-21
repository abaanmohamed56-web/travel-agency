"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Check, Zap, Crown, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "starter",
    name: "Starter",
    icon: Star,
    monthlyPrice: 29,
    yearlyPrice: 19,
    color: "#00D4FF",
    description: "Perfect for beginners starting their forex journey.",
    popular: false,
    features: [
      "Access to beginner course library (50+ lessons)",
      "Community forum access",
      "Weekly market overview",
      "Trading psychology basics",
      "Mobile app access",
      "Email support",
    ],
    cta: "Start for Free",
    href: "/auth/register?plan=starter",
  },
  {
    id: "pro",
    name: "Pro",
    icon: Zap,
    monthlyPrice: 79,
    yearlyPrice: 59,
    color: "#FFB800",
    description: "For serious traders who want consistent profitability.",
    popular: true,
    features: [
      "Everything in Starter",
      "Full course library (1000+ lessons)",
      "Daily live trading sessions",
      "Real-time trade signals (5-10/week)",
      "Strategy deep-dives & analysis",
      "Trading journal with analytics",
      "Risk management toolkit",
      "Priority support",
    ],
    cta: "Go Pro",
    href: "/auth/register?plan=pro",
  },
  {
    id: "vip",
    name: "VIP",
    icon: Crown,
    monthlyPrice: 149,
    yearlyPrice: 99,
    color: "#A855F7",
    description: "The ultimate trading education and mentorship experience.",
    popular: false,
    features: [
      "Everything in Pro",
      "1-on-1 monthly mentorship calls",
      "VIP signal channel (15-20/week)",
      "Private VIP community",
      "Exclusive institutional strategies",
      "Personal trading plan review",
      "WhatsApp group access",
      "Funded account pathway guidance",
      "Priority 24/7 support",
    ],
    cta: "Join VIP",
    href: "/auth/register?plan=vip",
  },
];

function PricingCard({
  plan,
  yearly,
  index,
  inView,
}: {
  plan: (typeof plans)[0];
  yearly: boolean;
  index: number;
  inView: boolean;
}) {
  const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col rounded-2xl p-8 ${
        plan.popular
          ? "border-2 md:scale-[1.03]"
          : "border border-white/8"
      }`}
      style={{
        background: plan.popular
          ? `linear-gradient(135deg, rgba(255,184,0,0.08) 0%, rgba(10,13,20,0.9) 60%)`
          : "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        borderColor: plan.popular ? plan.color : undefined,
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Popular badge */}
      {plan.popular && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-[#080A0F]"
          style={{ background: plan.color }}
        >
          Most Popular
        </div>
      )}

      {/* Glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${plan.color}30 0%, transparent 60%)`,
        }}
      />

      {/* Top */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `${plan.color}20`, border: `1px solid ${plan.color}30` }}
          >
            <plan.icon className="w-5 h-5" style={{ color: plan.color }} />
          </div>
          {plan.popular && (
            <div
              className="text-xs font-medium px-2 py-1 rounded-full"
              style={{ color: plan.color, background: `${plan.color}15` }}
            >
              Best Value
            </div>
          )}
        </div>

        <h3 className="text-xl font-syne font-bold text-white mb-1">{plan.name}</h3>
        <p className="text-sm text-white/40">{plan.description}</p>
      </div>

      {/* Price */}
      <div className="mb-8">
        <div className="flex items-end gap-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={price}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="text-5xl font-syne font-extrabold"
              style={{ color: plan.color }}
            >
              ${price}
            </motion.div>
          </AnimatePresence>
          <div className="text-white/40 text-sm mb-2">/month</div>
        </div>
        {yearly && (
          <div className="text-xs text-emerald-400 mt-1">
            Save ${(plan.monthlyPrice - plan.yearlyPrice) * 12}/year
          </div>
        )}
      </div>

      {/* Features */}
      <ul className="space-y-3 flex-1 mb-8">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-white/60">
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${plan.color}20` }}
            >
              <Check className="w-2.5 h-2.5" style={{ color: plan.color }} />
            </div>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={plan.href}
        className={`group relative flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
          plan.popular
            ? "text-[#080A0F] hover:shadow-glow-gold"
            : "text-white border border-white/10 hover:border-white/30 glass"
        }`}
        style={
          plan.popular
            ? { background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)` }
            : {}
        }
      >
        {plan.cta}
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}

export function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#080A0F]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-6">
            <Crown className="w-3.5 h-3.5 text-[#FFB800]" />
            <span className="text-xs text-white/50 font-medium tracking-wide uppercase">
              Choose Your Plan
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-syne font-bold text-white mb-4">
            Invest In Your{" "}
            <span className="gradient-text-gold">Trading Future</span>
          </h2>
          <p className="text-white/40 max-w-xl mx-auto mb-10">
            All plans include a 7-day free trial. Cancel anytime. No hidden fees.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 p-1 glass rounded-xl border border-white/10">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                !yearly ? "bg-white/10 text-white" : "text-white/40"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                yearly ? "bg-white/10 text-white" : "text-white/40"
              }`}
            >
              Yearly
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                Save 30%
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
          {plans.map((plan, i) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              yearly={yearly}
              index={i}
              inView={inView}
            />
          ))}
        </div>

        {/* Money back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 text-sm text-white/30"
        >
          🔒 30-day money-back guarantee · Secure payments via Stripe · Cancel anytime
        </motion.div>
      </div>
    </section>
  );
}
