"use client";

import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Zap, BookOpen, Target,
  ArrowUpRight, ArrowDownRight, Activity, Clock, DollarSign,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";

const performanceData = [
  { month: "Jan", pips: 240, balance: 10200 },
  { month: "Feb", pips: -80, balance: 9950 },
  { month: "Mar", pips: 380, balance: 10580 },
  { month: "Apr", pips: 520, balance: 11200 },
  { month: "May", pips: 140, balance: 11420 },
  { month: "Jun", pips: 680, balance: 12340 },
  { month: "Jul", pips: -120, balance: 12100 },
  { month: "Aug", pips: 890, balance: 13200 },
];

const recentSignals = [
  { pair: "EUR/USD", type: "BUY", entry: "1.0820", tp: "1.0920", sl: "1.0770", pips: "+127", status: "active", time: "2h ago" },
  { pair: "GBP/USD", type: "SELL", entry: "1.2800", tp: "1.2650", sl: "1.2870", pips: "+180", status: "closed", time: "5h ago" },
  { pair: "USD/JPY", type: "BUY", entry: "149.50", tp: "150.80", sl: "148.90", pips: "+82", status: "active", time: "1d ago" },
  { pair: "AUD/USD", type: "SELL", entry: "0.6550", tp: "0.6420", sl: "0.6610", pips: "-35", status: "closed", time: "2d ago" },
];

const watchlist = [
  { pair: "EUR/USD", price: "1.0842", change: "+0.23%", up: true },
  { pair: "GBP/USD", price: "1.2734", change: "+0.41%", up: true },
  { pair: "USD/JPY", price: "149.82", change: "-0.18%", up: false },
  { pair: "GOLD", price: "2,345.80", change: "+0.87%", up: true },
  { pair: "BTC/USD", price: "67,420", change: "-1.24%", up: false },
];

function StatCard({ icon: Icon, label, value, sub, color, trend }: {
  icon: React.ElementType; label: string; value: string; sub: string;
  color: string; trend?: "up" | "down";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-premium rounded-2xl p-5 relative overflow-hidden group"
    >
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}10 0%, transparent 60%)` }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
            {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {sub}
          </div>
        )}
      </div>
      <div className="text-2xl font-syne font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-white/40">{label}</div>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-syne font-bold text-white">
            Good morning, John 👋
          </h1>
          <p className="text-sm text-white/40 mt-1">
            London session opens in 2h 34m · 3 active signals
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass border border-[#00D4FF]/20">
          <div className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
          <span className="text-sm text-[#00D4FF] font-medium">Pro Plan</span>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={DollarSign} label="Account Balance" value="$13,200" sub="+12.4%" color="#00D4FF" trend="up" />
        <StatCard icon={Activity} label="Monthly Pips" value="+890" sub="+24%" color="#00D4A0" trend="up" />
        <StatCard icon={Target} label="Win Rate" value="87%" sub="+3%" color="#FFB800" trend="up" />
        <StatCard icon={BookOpen} label="Lessons Completed" value="124" sub="14 this week" color="#A855F7" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 card-premium rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-syne font-semibold text-white">Account Performance</h3>
              <p className="text-xs text-white/40 mt-0.5">Balance growth over time</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              +32% YTD
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#1A1F2E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white" }}
                itemStyle={{ color: "#00D4FF" }}
              />
              <Area type="monotone" dataKey="balance" stroke="#00D4FF" strokeWidth={2} fill="url(#balanceGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Watchlist */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card-premium rounded-2xl p-5"
        >
          <h3 className="text-base font-syne font-semibold text-white mb-4">Watchlist</h3>
          <div className="space-y-3">
            {watchlist.map((item) => (
              <div key={item.pair} className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">{item.pair}</span>
                <div className="text-right">
                  <div className="text-sm font-mono text-white">{item.price}</div>
                  <div className={`text-xs ${item.up ? "text-emerald-400" : "text-red-400"}`}>
                    {item.up ? "▲" : "▼"} {item.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent signals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-premium rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-syne font-semibold text-white">Recent Signals</h3>
          <a href="/dashboard/signals" className="text-xs text-[#00D4FF] hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/30 text-xs border-b border-white/5">
                <th className="text-left pb-3 font-medium">Pair</th>
                <th className="text-left pb-3 font-medium">Type</th>
                <th className="text-left pb-3 font-medium">Entry</th>
                <th className="text-left pb-3 font-medium">TP / SL</th>
                <th className="text-left pb-3 font-medium">Result</th>
                <th className="text-left pb-3 font-medium">Status</th>
                <th className="text-right pb-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentSignals.map((signal, i) => (
                <tr key={i} className="text-white/70 hover:text-white transition-colors">
                  <td className="py-3 font-medium text-white">{signal.pair}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      signal.type === "BUY" ? "text-emerald-400 bg-emerald-400/10" : "text-red-400 bg-red-400/10"
                    }`}>
                      {signal.type}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-xs">{signal.entry}</td>
                  <td className="py-3 font-mono text-xs">
                    <span className="text-emerald-400">{signal.tp}</span>
                    {" / "}
                    <span className="text-red-400">{signal.sl}</span>
                  </td>
                  <td className={`py-3 font-mono text-xs font-semibold ${
                    signal.pips.startsWith("+") ? "text-emerald-400" : "text-red-400"
                  }`}>
                    {signal.pips} pips
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      signal.status === "active"
                        ? "bg-[#00D4FF]/10 text-[#00D4FF]"
                        : "bg-white/5 text-white/40"
                    }`}>
                      {signal.status}
                    </span>
                  </td>
                  <td className="py-3 text-right text-xs text-white/30">{signal.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
