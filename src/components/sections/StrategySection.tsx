"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { TrendingUp, Target, ArrowUpRight } from "lucide-react";

function AnimatedChart({ inView }: { inView: boolean }) {
  const [lineProgress, setLineProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timeout = setTimeout(() => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.02;
        setLineProgress(Math.min(progress, 1));
        if (progress >= 1) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, 400);
    return () => clearTimeout(timeout);
  }, [inView]);

  const w = 480;
  const h = 260;
  const pad = { t: 20, b: 40, l: 40, r: 20 };

  const data = [
    { x: 0, y: 140 }, { x: 40, y: 120 }, { x: 80, y: 150 }, { x: 120, y: 90 },
    { x: 160, y: 110 }, { x: 200, y: 70 }, { x: 240, y: 95 }, { x: 280, y: 60 },
    { x: 320, y: 80 }, { x: 360, y: 40 }, { x: 400, y: 55 }, { x: 440, y: 30 },
  ];

  const scaledData = data.map((d) => ({
    x: pad.l + (d.x / 440) * (w - pad.l - pad.r),
    y: pad.t + (d.y / 160) * (h - pad.t - pad.b),
  }));

  const pathD = scaledData
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  const totalLength = 600;
  const drawnLength = lineProgress * totalLength;

  // Support & resistance zones
  const supZoneY1 = pad.t + (90 / 160) * (h - pad.t - pad.b);
  const supZoneY2 = pad.t + (110 / 160) * (h - pad.t - pad.b);
  const resZoneY1 = pad.t + (30 / 160) * (h - pad.t - pad.b);
  const resZoneY2 = pad.t + (50 / 160) * (h - pad.t - pad.b);

  return (
    <div className="relative">
      <svg width="100%" viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
          <line
            key={pct}
            x1={pad.l}
            y1={pad.t + pct * (h - pad.t - pad.b)}
            x2={w - pad.r}
            y2={pad.t + pct * (h - pad.t - pad.b)}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
          />
        ))}

        {/* Support zone */}
        <motion.rect
          x={pad.l}
          y={supZoneY1}
          width={w - pad.l - pad.r}
          height={supZoneY2 - supZoneY1}
          fill="rgba(0,212,255,0.08)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
        />
        <motion.line
          x1={pad.l}
          y1={supZoneY1}
          x2={w - pad.r}
          y2={supZoneY1}
          stroke="#00D4FF"
          strokeWidth={1.5}
          strokeDasharray="6 4"
          opacity={0.5}
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ delay: 1, duration: 1 }}
        />
        <motion.text
          x={pad.l + 4}
          y={supZoneY1 - 4}
          fill="#00D4FF"
          fontSize={9}
          opacity={0.7}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.7 } : {}}
          transition={{ delay: 1.3 }}
        >
          SUPPORT ZONE
        </motion.text>

        {/* Resistance zone */}
        <motion.rect
          x={pad.l}
          y={resZoneY1}
          width={w - pad.l - pad.r}
          height={resZoneY2 - resZoneY1}
          fill="rgba(255,184,0,0.08)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
        />
        <motion.line
          x1={pad.l}
          y1={resZoneY2}
          x2={w - pad.r}
          y2={resZoneY2}
          stroke="#FFB800"
          strokeWidth={1.5}
          strokeDasharray="6 4"
          opacity={0.5}
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ delay: 1.2, duration: 1 }}
        />
        <motion.text
          x={pad.l + 4}
          y={resZoneY2 + 12}
          fill="#FFB800"
          fontSize={9}
          opacity={0.7}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.7 } : {}}
          transition={{ delay: 1.5 }}
        >
          RESISTANCE ZONE
        </motion.text>

        {/* Area fill */}
        <motion.path
          d={`${pathD} L ${scaledData[scaledData.length - 1].x} ${h - pad.b} L ${scaledData[0].x} ${h - pad.b} Z`}
          fill="url(#chartGradient)"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: lineProgress } : {}}
        />

        {/* Price line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ delay: 0.4, duration: 1.6, ease: "easeOut" }}
        />

        {/* Trade entry point */}
        <motion.circle
          cx={scaledData[5].x}
          cy={scaledData[5].y}
          r={6}
          fill="#00D4FF"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: 1.8, type: "spring" }}
        />
        <motion.text
          x={scaledData[5].x + 10}
          y={scaledData[5].y - 8}
          fill="#00D4FF"
          fontSize={9}
          fontWeight="600"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 2 }}
        >
          ENTRY
        </motion.text>

        {/* TP level */}
        <motion.circle
          cx={scaledData[11].x}
          cy={scaledData[11].y}
          r={6}
          fill="#00D4A0"
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ delay: 2, type: "spring" }}
        />
        <motion.text
          x={scaledData[11].x - 8}
          y={scaledData[11].y - 10}
          fill="#00D4A0"
          fontSize={9}
          fontWeight="600"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 2.2 }}
        >
          TP +247 pips
        </motion.text>

        {/* Defs */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#00D4A0" />
          </linearGradient>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

const strategies = [
  {
    name: "RSS Setup",
    desc: "Retail Sell Setup — identify institutional distribution zones and ride the move down with precision.",
    tag: "Bearish",
    color: "#FF4D6D",
  },
  {
    name: "SRR Setup",
    desc: "Support, Resistance, Rejection — trade retests with tight stops and explosive risk-reward ratios.",
    tag: "Bullish",
    color: "#00D4A0",
  },
  {
    name: "Order Blocks",
    desc: "Identify institutional order blocks on higher timeframes and execute entries with surgical precision.",
    tag: "SMC",
    color: "#00D4FF",
  },
];

export function StrategySection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="strategies" className="relative section-padding overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0D14]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-6">
                <Target className="w-3.5 h-3.5 text-[#FFB800]" />
                <span className="text-xs text-white/50 font-medium tracking-wide uppercase">
                  Strategy Showcase
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-syne font-bold text-white mb-5">
                Trade Like{" "}
                <span className="gradient-text-gold">Institutions</span>
              </h2>
              <p className="text-white/45 leading-relaxed mb-8">
                Learn the exact setups professional traders use every day. Our strategies
                are based on institutional order flow, supply & demand zones, and
                smart money concepts.
              </p>

              {/* Strategies */}
              <div className="space-y-4">
                {strategies.map((s, i) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, x: -30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + i * 0.12, duration: 0.7 }}
                    className="flex items-start gap-4 p-4 card-premium rounded-xl group cursor-pointer"
                  >
                    <div
                      className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                      style={{ background: s.color, boxShadow: `0 0 8px ${s.color}` }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-white">{s.name}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{ color: s.color, background: `${s.color}15` }}
                        >
                          {s.tag}
                        </span>
                      </div>
                      <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
                    </div>
                    <ArrowUpRight
                      className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      style={{ color: s.color }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — chart */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="card-premium rounded-2xl p-6 relative overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#00D4FF]" />
                  <span className="text-sm font-medium text-white">EUR/USD — Live Strategy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-emerald-400">Live</span>
                </div>
              </div>

              <AnimatedChart inView={inView} />

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/5">
                {[
                  { label: "Win Rate", value: "87%", color: "#00D4A0" },
                  { label: "Risk/Reward", value: "1:3.2", color: "#00D4FF" },
                  { label: "Total Pips", value: "+247", color: "#FFB800" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-lg font-syne font-bold" style={{ color: s.color }}>
                      {s.value}
                    </div>
                    <div className="text-xs text-white/30">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
