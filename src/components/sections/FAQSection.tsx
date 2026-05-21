"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "Do I need prior trading experience to join SkillPips?",
    a: "Not at all. SkillPips is designed for complete beginners through advanced traders. Our structured learning paths start from the very basics — what forex is, how currency pairs work — and progress all the way to institutional-level strategies.",
  },
  {
    q: "What's included in the VIP Signals?",
    a: "VIP Signals include precise entry price, stop loss, take profit levels, the reasoning behind each trade, risk percentage recommendation, and trade management updates. Signals are posted in real-time and accompanied by chart analysis in our private channel.",
  },
  {
    q: "How often are live trading sessions?",
    a: "Pro and VIP members get access to daily live trading sessions Monday–Friday. Sessions typically last 1-2 hours during the London and New York trading sessions — the highest volume periods of the forex market.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Absolutely. There are no long-term contracts and no cancellation fees. You can cancel from your dashboard settings at any time. You'll retain access until the end of your current billing period.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes, all plans come with a 7-day free trial. You get full access to all features of your chosen plan. No credit card required to start the trial.",
  },
  {
    q: "Are the trading strategies suitable for all currency pairs?",
    a: "Yes. Our strategies — including order blocks, supply & demand, and RSS/SRR setups — work across all major, minor, and exotic pairs. We primarily focus on major pairs like EUR/USD, GBP/USD, and USD/JPY in our live sessions.",
  },
  {
    q: "Do you guarantee profits from the signals?",
    a: "No. Trading forex involves significant risk and no one can guarantee profits. Our signals are based on professional analysis with a verified historical win rate, but past performance does not guarantee future results. Always trade responsibly.",
  },
  {
    q: "What's the difference between the Pro and VIP plans?",
    a: "The main differences are: VIP includes 1-on-1 monthly mentorship calls, a higher-volume private signal channel (15-20 signals/week vs 5-10), access to a private VIP community, WhatsApp group, personal trading plan reviews, and funded account guidance.",
  },
];

function FAQItem({ faq, index }: { faq: (typeof faqs)[0]; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className={`border rounded-xl overflow-hidden transition-all duration-300 ${
        open
          ? "border-[#00D4FF]/30 bg-[#00D4FF]/5"
          : "border-white/8 bg-transparent hover:border-white/15"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="text-sm font-medium text-white">{faq.q}</span>
        <div
          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
            open ? "bg-[#00D4FF]/20 text-[#00D4FF]" : "bg-white/5 text-white/40"
          }`}
        >
          {open ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="px-5 pb-5">
              <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0D14]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-6">
            <HelpCircle className="w-3.5 h-3.5 text-[#00D4FF]" />
            <span className="text-xs text-white/50 font-medium tracking-wide uppercase">
              Got Questions?
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-syne font-bold text-white mb-4">
            Frequently Asked{" "}
            <span className="gradient-text-blue">Questions</span>
          </h2>
          <p className="text-white/40">
            Everything you need to know about SkillPips. Can&apos;t find your answer?{" "}
            <a href="#contact" className="text-[#00D4FF] hover:underline">
              Contact us
            </a>
            .
          </p>
        </motion.div>

        {/* FAQ list */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} faq={faq} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
