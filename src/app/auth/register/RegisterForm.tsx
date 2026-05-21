"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, TrendingUp, ArrowRight, Mail, Lock, User, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  terms: z.boolean().refine((v) => v, "You must accept the terms"),
});

type FormData = z.infer<typeof schema>;

const plans = [
  { id: "starter", label: "Starter", price: "$29/mo", color: "#00D4FF" },
  { id: "pro", label: "Pro", price: "$79/mo", color: "#FFB800", popular: true },
  { id: "vip", label: "VIP", price: "$149/mo", color: "#A855F7" },
];

export function RegisterForm() {
  const searchParams = useSearchParams();
  const defaultPlan = searchParams.get("plan") || "pro";
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      await new Promise((r) => setTimeout(r, 1500));
      window.location.href = "/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080A0F] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.08)_0%,transparent_70%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg"
      >
        <div className="card-premium rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0099CC] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-syne font-bold text-xl text-white">
              Skill<span className="gradient-text-blue">Pips</span>
            </span>
          </div>

          <h1 className="text-2xl font-syne font-bold text-white mb-1">Create your account</h1>
          <p className="text-sm text-white/40 mb-6">Start your 7-day free trial. No credit card required.</p>

          {/* Plan selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {plans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-3 rounded-xl border text-center transition-all duration-200 ${
                  selectedPlan === plan.id
                    ? "border-[#00D4FF]/50 bg-[#00D4FF]/5"
                    : "border-white/8 hover:border-white/20"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] px-1.5 py-0.5 rounded-full bg-[#FFB800] text-[#080A0F] font-bold whitespace-nowrap">
                    Popular
                  </div>
                )}
                <div className="text-xs font-semibold text-white">{plan.label}</div>
                <div className="text-[10px] text-white/40">{plan.price}</div>
                {selectedPlan === plan.id && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-3 h-3 text-[#00D4FF]" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Google */}
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl glass border border-white/10 hover:border-white/20 transition-all text-sm font-medium text-white mb-5">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/8" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-[#1A1F2E] text-xs text-white/30">or sign up with email</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  {...register("name")}
                  type="text"
                  placeholder="John Smith"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                />
              </div>
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#00D4FF]/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-start gap-2">
              <input {...register("terms")} type="checkbox" id="terms" className="mt-0.5 w-4 h-4 rounded" />
              <label htmlFor="terms" className="text-xs text-white/40 leading-relaxed cursor-pointer">
                I agree to the{" "}
                <Link href="#terms" className="text-[#00D4FF] hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link href="#privacy" className="text-[#00D4FF] hover:underline">Privacy Policy</Link>
              </label>
            </div>
            {errors.terms && <p className="text-xs text-red-400">{errors.terms.message}</p>}

            <button
              type="submit"
              disabled={loading}
              className="group w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-[#080A0F] bg-gradient-to-r from-[#00D4FF] to-[#0099CC] disabled:opacity-70 hover:shadow-[0_0_20px_rgba(0,212,255,0.35)] transition-shadow duration-300"
            >
              <span>{loading ? "Creating account..." : "Start Free Trial"}</span>
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#00D4FF] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
