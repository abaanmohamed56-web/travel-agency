"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Filter, TrendingUp, TrendingDown, Clock, Target } from "lucide-react";

const signals = [
  { id: 1, pair: "EUR/USD", type: "BUY", entry: "1.0820", tp1: "1.0880", tp2: "1.0940", sl: "1.0770", rr: "1:2.4", pips: "+127", status: "active", time: "2h ago", confidence: "High", analysis: "Price bounced from key support zone at 1.0820. Institutional order block visible on 4H. London session momentum favoring bulls." },
  { id: 2, pair: "GBP/USD", type: "SELL", entry: "1.2800", tp1: "1.2720", tp2: "1.2650", sl: "1.2850", rr: "1:3.0", pips: "+180", status: "closed", time: "5h ago", confidence: "High", analysis: "Resistance rejection at 1.2800. BOS confirmed on 1H. Smart money distribution pattern visible." },
  { id: 3, pair: "USD/JPY", type: "BUY", entry: "149.50", tp1: "150.20", tp2: "151.00", sl: "148.90", rr: "1:2.0", pips: "+82", status: "active", time: "1d ago", confidence: "Medium", analysis: "Dollar strength narrative intact. Price consolidating above key 149.00 zone. BOJ intervention risk low at current levels." },
  { id: 4, pair: "XAU/USD", type: "BUY", entry: "2320.00", tp1: "2360.00", tp2: "2400.00", sl: "2295.00", rr: "1:3.2", pips: "+240", status: "active", time: "2d ago", confidence: "High", analysis: "Gold maintaining bullish structure. Geopolitical tensions supporting safe haven demand. Inflation concerns keeping upside pressure intact." },
  { id: 5, pair: "AUD/USD", type: "SELL", entry: "0.6550", tp1: "0.6490", tp2: "0.6420", sl: "0.6610", rr: "1:2.5", pips: "-35", status: "closed", time: "3d ago", confidence: "Medium", analysis: "Bearish continuation pattern. China slowdown weighing on AUD. Risk-off sentiment dominating." },
];

export default function SignalsPage() {
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "BUY" | "SELL">("all");

  const filtered = signals.filter((s) => {
    if (filter !== "all" && s.status !== filter) return false;
    if (typeFilter !== "all" && s.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-syne font-bold text-white mb-1">Trading Signals</h1>
        <p className="text-sm text-white/40">Professional trade setups with precise entry, TP, and SL levels</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Signals", value: "3", color: "#00D4FF", icon: Zap },
          { label: "Win Rate", value: "87%", color: "#00D4A0", icon: Target },
          { label: "Avg Pips/Signal", value: "+148", color: "#FFB800", icon: TrendingUp },
          { label: "This Month", value: "12", color: "#A855F7", icon: Clock },
        ].map((s) => (
          <div key={s.label} className="card-premium rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}18` }}>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-xl font-syne font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-white/30">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 glass rounded-xl border border-white/8 p-1">
          {(["all", "active", "closed"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                filter === f ? "bg-white/10 text-white" : "text-white/40"
              }`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-1 glass rounded-xl border border-white/8 p-1">
          {(["all", "BUY", "SELL"] as const).map((f) => (
            <button key={f} onClick={() => setTypeFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                typeFilter === f ? "bg-white/10 text-white" : "text-white/40"
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Signal cards */}
      <div className="space-y-4">
        {filtered.map((signal, i) => (
          <motion.div
            key={signal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card-premium rounded-2xl p-5"
          >
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex items-center gap-3 min-w-[120px]">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  signal.type === "BUY" ? "bg-emerald-400/10" : "bg-red-400/10"
                }`}>
                  {signal.type === "BUY"
                    ? <TrendingUp className="w-5 h-5 text-emerald-400" />
                    : <TrendingDown className="w-5 h-5 text-red-400" />}
                </div>
                <div>
                  <div className="text-base font-syne font-bold text-white">{signal.pair}</div>
                  <span className={`text-xs font-semibold ${signal.type === "BUY" ? "text-emerald-400" : "text-red-400"}`}>
                    {signal.type}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-sm flex-1">
                <div>
                  <div className="text-xs text-white/30 mb-0.5">Entry</div>
                  <div className="font-mono text-white">{signal.entry}</div>
                </div>
                <div>
                  <div className="text-xs text-white/30 mb-0.5">TP1 / TP2</div>
                  <div className="font-mono text-emerald-400">{signal.tp1} / {signal.tp2}</div>
                </div>
                <div>
                  <div className="text-xs text-white/30 mb-0.5">Stop Loss</div>
                  <div className="font-mono text-red-400">{signal.sl}</div>
                </div>
                <div>
                  <div className="text-xs text-white/30 mb-0.5">R:R</div>
                  <div className="font-mono text-[#FFB800]">{signal.rr}</div>
                </div>
                <div>
                  <div className="text-xs text-white/30 mb-0.5">Pips</div>
                  <div className={`font-mono font-semibold ${signal.pips.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>
                    {signal.pips}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  signal.confidence === "High"
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-yellow-400/10 text-yellow-400"
                }`}>
                  {signal.confidence} Confidence
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full ${
                  signal.status === "active"
                    ? "bg-[#00D4FF]/10 text-[#00D4FF]"
                    : "bg-white/5 text-white/30"
                }`}>
                  {signal.status}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 text-xs text-white/40 leading-relaxed">
              <span className="text-white/20 uppercase tracking-wide text-[10px] font-medium">Analysis: </span>
              {signal.analysis}
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-white/25 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {signal.time}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
