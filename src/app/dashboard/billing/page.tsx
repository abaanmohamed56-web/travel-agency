"use client";

import { motion } from "framer-motion";
import { CreditCard, Check, ArrowRight, Crown, Zap, Star, Calendar, Download } from "lucide-react";

const plans = [
  { id: "starter", name: "Starter", price: 29, color: "#00D4FF", icon: Star },
  { id: "pro", name: "Pro", price: 79, color: "#FFB800", icon: Zap, current: true },
  { id: "vip", name: "VIP", price: 149, color: "#A855F7", icon: Crown },
];

const invoices = [
  { date: "May 1, 2026", amount: "$79.00", plan: "Pro", status: "paid", id: "INV-2026-005" },
  { date: "Apr 1, 2026", amount: "$79.00", plan: "Pro", status: "paid", id: "INV-2026-004" },
  { date: "Mar 1, 2026", amount: "$79.00", plan: "Pro", status: "paid", id: "INV-2026-003" },
];

export default function BillingPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-syne font-bold text-white mb-1">Billing</h1>
        <p className="text-sm text-white/40">Manage your subscription and payment methods</p>
      </motion.div>

      {/* Current plan */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="card-premium rounded-2xl p-6 border border-[#FFB800]/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-syne font-semibold text-white">Current Plan</h3>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400">Active</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFB800]/15 flex items-center justify-center">
            <Zap className="w-6 h-6 text-[#FFB800]" />
          </div>
          <div>
            <div className="text-2xl font-syne font-bold text-[#FFB800]">Pro Plan</div>
            <div className="text-sm text-white/40 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              Renews June 1, 2026 · $79.00/month
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="px-4 py-2.5 rounded-xl text-sm font-medium text-white glass border border-white/10 hover:border-white/20 transition-all">
            Change Plan
          </button>
          <button className="px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/5 transition-all">
            Cancel Subscription
          </button>
        </div>
      </motion.div>

      {/* Plans */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card-premium rounded-2xl p-6">
        <h3 className="text-base font-syne font-semibold text-white mb-4">Available Plans</h3>
        <div className="grid grid-cols-3 gap-3">
          {plans.map((plan) => (
            <div key={plan.id}
              className={`relative p-4 rounded-xl border text-center transition-all ${
                plan.current ? "border-[#FFB800]/40 bg-[#FFB800]/5" : "border-white/8 hover:border-white/20"
              }`}>
              <div className="w-9 h-9 rounded-xl mx-auto mb-3 flex items-center justify-center"
                style={{ background: `${plan.color}18` }}>
                <plan.icon className="w-4 h-4" style={{ color: plan.color }} />
              </div>
              <div className="text-sm font-semibold text-white">{plan.name}</div>
              <div className="text-lg font-syne font-bold mt-1" style={{ color: plan.color }}>${plan.price}</div>
              <div className="text-xs text-white/30">/month</div>
              {plan.current && (
                <div className="mt-3 text-xs text-[#FFB800] font-medium flex items-center justify-center gap-1">
                  <Check className="w-3 h-3" /> Current
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Payment method */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="card-premium rounded-2xl p-6">
        <h3 className="text-base font-syne font-semibold text-white mb-4">Payment Method</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white/60" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Visa ending in 4242</div>
              <div className="text-xs text-white/30">Expires 12/27</div>
            </div>
          </div>
          <button className="text-sm text-[#00D4FF] hover:underline">Update</button>
        </div>
      </motion.div>

      {/* Invoices */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="card-premium rounded-2xl p-6">
        <h3 className="text-base font-syne font-semibold text-white mb-4">Billing History</h3>
        <div className="space-y-3">
          {invoices.map((inv) => (
            <div key={inv.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
              <div>
                <div className="text-sm text-white">{inv.date}</div>
                <div className="text-xs text-white/30">{inv.id} · {inv.plan} Plan</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-white">{inv.amount}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400">{inv.status}</span>
                <button className="text-white/30 hover:text-white"><Download className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
