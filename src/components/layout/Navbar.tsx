"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, X, Menu, ChevronDown, Zap } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Strategies", href: "#strategies" },
  { label: "Pricing", href: "#pricing" },
  {
    label: "Learn",
    href: "#",
    children: [
      { label: "Forex Courses", href: "#courses" },
      { label: "Live Sessions", href: "#sessions" },
      { label: "Market Analysis", href: "#analysis" },
      { label: "Trading Psychology", href: "#psychology" },
    ],
  },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "py-3 glass-dark border-b border-white/5"
            : "py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0099CC] flex items-center justify-center shadow-glow-blue">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#00D4FF] to-[#0099CC] blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              </div>
              <span className="font-syne font-800 text-xl text-white tracking-tight">
                Skill<span className="gradient-text-blue">Pips</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 px-4 py-2 text-sm text-white/70 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5"
                  >
                    {link.label}
                    {link.children && (
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === link.label ? "rotate-180" : ""}`} />
                    )}
                  </Link>
                  {link.children && (
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-52 glass-dark rounded-xl border border-white/10 py-1 shadow-xl"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className="group flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-[#080A0F] rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#0099CC] hover:shadow-[0_0_20px_rgba(0,212,255,0.35)] transition-shadow duration-300"
              >
                <Zap className="w-3.5 h-3.5" />
                Join VIP
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-72 glass-dark border-l border-white/10 flex flex-col p-6 gap-2">
              <div className="flex items-center justify-between mb-6 mt-2">
                <span className="font-syne font-bold text-lg text-white">Menu</span>
                <button onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5 text-white/70" />
                </button>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-auto flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-center text-white/70 border border-white/10 rounded-lg hover:border-white/30 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-center text-[#080A0F] font-semibold bg-gradient-to-r from-[#00D4FF] to-[#0099CC] rounded-lg"
                >
                  Join VIP
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
