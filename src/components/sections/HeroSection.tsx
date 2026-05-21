"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, TrendingUp, TrendingDown, Zap } from "lucide-react";

/* Candlestick data generator */
function generateCandles(count: number) {
  const candles = [];
  let price = 1.2850;
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.48) * 0.003;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 0.001;
    const low = Math.min(open, close) - Math.random() * 0.001;
    candles.push({ open, close, high, low, index: i });
    price = close;
  }
  return candles;
}

const ticker = [
  { pair: "EUR/USD", price: "1.0842", change: "+0.23%", up: true },
  { pair: "GBP/USD", price: "1.2734", change: "+0.41%", up: true },
  { pair: "USD/JPY", price: "149.82", change: "-0.18%", up: false },
  { pair: "AUD/USD", price: "0.6521", change: "+0.12%", up: true },
  { pair: "USD/CAD", price: "1.3612", change: "-0.09%", up: false },
  { pair: "NZD/USD", price: "0.6083", change: "+0.31%", up: true },
  { pair: "USD/CHF", price: "0.8974", change: "-0.05%", up: false },
  { pair: "EUR/GBP", price: "0.8521", change: "+0.07%", up: true },
];

function CandlestickChart() {
  const [candles] = useState(() => generateCandles(40));
  const svgRef = useRef<SVGSVGElement>(null);
  const [animatedCount, setAnimatedCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedCount((c) => Math.min(c + 1, candles.length));
    }, 80);
    return () => clearInterval(interval);
  }, [candles.length]);

  const candleWidth = 16;
  const gap = 8;
  const chartHeight = 220;
  const padding = { top: 20, bottom: 20, left: 10, right: 10 };

  const allPrices = candles.flatMap((c) => [c.high, c.low]);
  const minPrice = Math.min(...allPrices);
  const maxPrice = Math.max(...allPrices);
  const priceRange = maxPrice - minPrice;

  const scaleY = (price: number) =>
    padding.top + ((maxPrice - price) / priceRange) * (chartHeight - padding.top - padding.bottom);

  const svgWidth = candles.length * (candleWidth + gap) + padding.left + padding.right;

  return (
    <div className="relative overflow-hidden">
      {/* Fade out left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#080A0F] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#080A0F] to-transparent z-10" />

      <svg
        ref={svgRef}
        width={svgWidth}
        height={chartHeight}
        className="opacity-70"
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((pct) => (
          <line
            key={pct}
            x1={0}
            y1={padding.top + pct * (chartHeight - padding.top - padding.bottom)}
            x2={svgWidth}
            y2={padding.top + pct * (chartHeight - padding.top - padding.bottom)}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
          />
        ))}

        {/* Candles */}
        {candles.slice(0, animatedCount).map((candle, i) => {
          const isGreen = candle.close >= candle.open;
          const color = isGreen ? "#00D4A0" : "#FF4D6D";
          const x = padding.left + i * (candleWidth + gap) + candleWidth / 2;
          const bodyTop = scaleY(Math.max(candle.open, candle.close));
          const bodyHeight = Math.max(
            Math.abs(scaleY(candle.open) - scaleY(candle.close)),
            2
          );
          return (
            <g key={i}>
              {/* Wick */}
              <line
                x1={x}
                y1={scaleY(candle.high)}
                x2={x}
                y2={scaleY(candle.low)}
                stroke={color}
                strokeWidth={1.5}
                opacity={0.8}
              />
              {/* Body */}
              <rect
                x={padding.left + i * (candleWidth + gap)}
                y={bodyTop}
                width={candleWidth}
                height={bodyHeight}
                fill={color}
                opacity={0.9}
                rx={1}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Particle({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full bg-[#00D4FF]"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{
        y: [0, -40, 0],
        opacity: [0, 0.8, 0],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

const particles = Array.from({ length: 30 }, (_, i) => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: i * 0.2,
}));

export function HeroSection() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const bgX = useTransform(springX, [-500, 500], [-20, 20]);
  const bgY = useTransform(springY, [-400, 400], [-15, 15]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  const textVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.8, ease: "easeOut" as const },
    }),
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#080A0F]">
      {/* Radial gradient background */}
      <div className="absolute inset-0">
        <motion.div
          style={{ x: bgX, y: bgY }}
          className="absolute inset-0"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.12)_0%,transparent_70%)]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(255,184,0,0.06)_0%,transparent_70%)]" />
        </motion.div>
      </div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <Particle key={i} {...p} />
        ))}
      </div>

      {/* Light streaks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-[#00D4FF]/20 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              width: "100%",
            }}
            animate={{
              x: ["-100%", "200%"],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 4 + i,
              delay: i * 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Ticker tape */}
      <div className="absolute top-[72px] left-0 right-0 border-y border-white/5 bg-black/30 backdrop-blur-sm py-2 overflow-hidden z-10">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...ticker, ...ticker, ...ticker].map((item, i) => (
            <span key={i} className="ticker-item text-xs font-mono">
              <span className="text-white/40">{item.pair}</span>
              <span className="text-white/80 font-semibold">{item.price}</span>
              <span className={item.up ? "text-emerald-400" : "text-red-400"}>
                {item.up ? "▲" : "▼"} {item.change}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-4 pt-36 pb-20">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[#00D4FF]/20 mb-8"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] animate-pulse" />
          <span className="text-xs text-[#00D4FF] font-medium tracking-wide">
            20,000+ Active Traders
          </span>
          <Zap className="w-3 h-3 text-[#FFB800]" />
        </motion.div>

        {/* Headline */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            custom={1}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            className="text-5xl sm:text-6xl lg:text-8xl font-syne font-extrabold text-white leading-[0.95] tracking-tight max-w-5xl"
          >
            Master Forex.{" "}
            <br className="hidden sm:block" />
            <span className="gradient-text-blue">Trade With</span>
            <br className="hidden sm:block" />
            <span className="relative inline-block">
              Precision
              <span className="gradient-text-gold">.</span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00D4FF] to-[#FFB800]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </motion.h1>
        </div>

        {/* Subheadline */}
        <motion.p
          custom={2}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="text-base sm:text-lg text-white/50 max-w-2xl leading-relaxed mb-10"
        >
          Join SkillPips and learn professional trading strategies, live mentorship,
          signals, and market psychology. Built for traders who take it seriously.
        </motion.p>

        {/* Buttons */}
        <motion.div
          custom={3}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            href="/auth/register"
            className="group relative flex items-center gap-2 px-8 py-4 text-base font-semibold text-[#080A0F] rounded-xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF] to-[#0099CC]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#00D4FF] to-[#0099CC] blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 scale-110" />
            <span className="relative">Join VIP</span>
            <ArrowRight className="relative w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <button className="group flex items-center gap-3 px-6 py-4 text-base text-white/70 hover:text-white transition-colors">
            <div className="relative w-11 h-11 rounded-full glass border border-white/10 flex items-center justify-center group-hover:border-[#00D4FF]/40 transition-colors">
              <Play className="w-4 h-4 fill-current ml-0.5" />
              <div className="absolute inset-0 rounded-full bg-[#00D4FF]/0 group-hover:bg-[#00D4FF]/10 transition-colors" />
            </div>
            Watch Demo
          </button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          custom={4}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-8 mt-14 pt-8 border-t border-white/5"
        >
          {[
            { value: "20K+", label: "Members" },
            { value: "1000+", label: "Lessons" },
            { value: "95%", label: "Satisfaction" },
            { value: "24/7", label: "Community" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-syne font-bold gradient-text-blue">{stat.value}</div>
              <div className="text-xs text-white/30 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Chart visualization */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto w-full max-w-5xl px-4 pb-10"
      >
        <div className="relative glass rounded-2xl border border-white/10 overflow-hidden shadow-[0_0_80px_rgba(0,212,255,0.05)]">
          {/* Chart header */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <span className="text-xs text-white/40 font-mono">EUR/USD — 1H Chart</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs text-emerald-400 font-mono">+2.34%</span>
            </div>
          </div>
          {/* Chart body */}
          <div className="overflow-x-auto no-scrollbar p-4">
            <CandlestickChart />
          </div>
          {/* Overlay bottom gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0A0D14] to-transparent pointer-events-none" />
        </div>

        {/* Floating signal cards */}
        <motion.div
          className="absolute -left-4 top-8 glass rounded-xl border border-white/10 p-3 shadow-xl hidden lg:block"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/50">Live Signal</span>
          </div>
          <div className="text-sm font-semibold text-white">EUR/USD BUY</div>
          <div className="text-xs text-emerald-400">+127 pips</div>
        </motion.div>

        <motion.div
          className="absolute -right-4 top-16 glass rounded-xl border border-white/10 p-3 shadow-xl hidden lg:block"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="text-xs text-white/40 mb-1">Win Rate</div>
          <div className="text-2xl font-syne font-bold gradient-text-gold">87%</div>
          <div className="text-xs text-white/40">This month</div>
        </motion.div>
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#080A0F] to-transparent pointer-events-none z-30" />
    </section>
  );
}
