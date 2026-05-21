"use client";

import Link from "next/link";
import { TrendingUp, AtSign, Play, Camera, Share2, Send } from "lucide-react";
import { motion } from "framer-motion";

const footerLinks = {
  Platform: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Education: [
    { label: "Forex Courses", href: "#courses" },
    { label: "Live Sessions", href: "#sessions" },
    { label: "Market Analysis", href: "#analysis" },
    { label: "Trading Psychology", href: "#psychology" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Blog", href: "#blog" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#privacy" },
    { label: "Terms of Service", href: "#terms" },
    { label: "Risk Disclaimer", href: "#risk" },
    { label: "Cookie Policy", href: "#cookies" },
  ],
};

const socials = [
  { icon: AtSign, href: "#", label: "Twitter/X" },
  { icon: Play, href: "#", label: "YouTube" },
  { icon: Camera, href: "#", label: "Instagram" },
  { icon: Share2, href: "#", label: "LinkedIn" },
  { icon: Send, href: "#", label: "Telegram" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[#080A0F]">
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-[#00D4FF]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0099CC] flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="font-syne font-bold text-xl text-white">
                Skill<span className="gradient-text-blue">Pips</span>
              </span>
            </Link>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              The premium forex education platform for serious traders. Learn, trade, and grow with SkillPips.
            </p>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center text-white/40 hover:text-[#00D4FF] hover:border-[#00D4FF]/30 transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} SkillPips. All rights reserved.
          </p>
          <p className="text-xs text-white/20 text-center sm:text-right max-w-lg">
            Risk Disclaimer: Trading forex involves substantial risk of loss. Past performance is not indicative of future results. Only trade with funds you can afford to lose.
          </p>
        </div>
      </div>
    </footer>
  );
}
