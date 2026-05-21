"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookMarked, Plus, TrendingUp, TrendingDown, Target, BarChart2 } from "lucide-react";

const entries = [
  { id: 1, pair: "EUR/USD", type: "BUY", entry: 1.082, exit: 1.092, pips: 100, rr: "1:2.5", mood: "😊", notes: "Clean order block entry. Waited patiently for confirmation. Solid trade.", tags: ["SMC", "London"], date: "2026-05-21" },
  { id: 2, pair: "GBP/USD", type: "SELL", entry: 1.28, exit: 1.265, pips: 150, rr: "1:3.0", mood: "🔥", notes: "Perfect BOS confirmation on 1H. Held through drawdown, rewarded.", tags: ["SMC", "NY Session"], date: "2026-05-20" },
  { id: 3, pair: "USD/JPY", type: "BUY", entry: 149.5, exit: 148.9, pips: -60, rr: "1:-1.2", mood: "😔", notes: "Entered too early. Didn't wait for proper confirmation. Lesson learned.", tags: ["Early entry", "Mistake"], date: "2026-05-18" },
];

export default function JournalPage() {
  const [showForm, setShowForm] = useState(false);

  const stats = {
    total: entries.length,
    wins: entries.filter((e) => e.pips > 0).length,
    pips: entries.reduce((s, e) => s + e.pips, 0),
    winRate: Math.round((entries.filter((e) => e.pips > 0).length / entries.length) * 100),
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-syne font-bold text-white mb-1">Trading Journal</h1>
          <p className="text-sm text-white/40">Track and analyze every trade</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-[#080A0F] bg-gradient-to-r from-[#00D4FF] to-[#0099CC]"
        >
          <Plus className="w-4 h-4" /> Log Trade
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Trades", value: stats.total, color: "#00D4FF", icon: BookMarked },
          { label: "Win Rate", value: `${stats.winRate}%`, color: "#00D4A0", icon: Target },
          { label: "Total Pips", value: `${stats.pips > 0 ? "+" : ""}${stats.pips}`, color: stats.pips > 0 ? "#00D4A0" : "#FF4D6D", icon: BarChart2 },
          { label: "Win/Loss", value: `${stats.wins}/${stats.total - stats.wins}`, color: "#FFB800", icon: TrendingUp },
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

      {/* Entries */}
      <div className="space-y-4">
        {entries.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card-premium rounded-2xl p-5"
          >
            <div className="flex flex-wrap items-start gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${entry.type === "BUY" ? "bg-emerald-400/10" : "bg-red-400/10"}`}>
                  {entry.type === "BUY" ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
                </div>
                <div>
                  <div className="text-base font-syne font-bold text-white">{entry.pair}</div>
                  <div className={`text-xs font-semibold ${entry.type === "BUY" ? "text-emerald-400" : "text-red-400"}`}>{entry.type}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 text-sm flex-1">
                <div><div className="text-xs text-white/30">Entry</div><div className="font-mono text-white">{entry.entry}</div></div>
                <div><div className="text-xs text-white/30">Exit</div><div className="font-mono text-white">{entry.exit}</div></div>
                <div>
                  <div className="text-xs text-white/30">Pips</div>
                  <div className={`font-mono font-semibold ${entry.pips > 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {entry.pips > 0 ? "+" : ""}{entry.pips}
                  </div>
                </div>
                <div><div className="text-xs text-white/30">R:R</div><div className="font-mono text-[#FFB800]">{entry.rr}</div></div>
                <div><div className="text-xs text-white/30">Mood</div><div className="text-lg">{entry.mood}</div></div>
              </div>

              <div className="text-xs text-white/25">{entry.date}</div>
            </div>

            <p className="mt-3 text-xs text-white/40">{entry.notes}</p>

            <div className="flex gap-2 mt-3">
              {entry.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/30">{tag}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
