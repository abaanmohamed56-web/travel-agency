"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight, Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#080A0F] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.08)_0%,transparent_70%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        <div className="card-premium rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0099CC] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-syne font-bold text-xl text-white">
              Skill<span className="gradient-text-blue">Pips</span>
            </span>
          </div>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <h1 className="text-xl font-syne font-bold text-white mb-2">Check your email</h1>
              <p className="text-sm text-white/40 mb-8">
                We&apos;ve sent a password reset link to <strong className="text-white">{email}</strong>
              </p>
              <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm text-[#00D4FF] hover:underline">
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-syne font-bold text-white mb-1">Reset password</h1>
              <p className="text-sm text-white/40 mb-8">
                Enter your email and we&apos;ll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-[#080A0F] bg-gradient-to-r from-[#00D4FF] to-[#0099CC] disabled:opacity-70 hover:shadow-[0_0_20px_rgba(0,212,255,0.35)] transition-shadow duration-300"
                >
                  <span>{loading ? "Sending..." : "Send Reset Link"}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>
              <div className="mt-6 text-center">
                <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm text-white/40 hover:text-white">
                  <ArrowLeft className="w-4 h-4" /> Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
