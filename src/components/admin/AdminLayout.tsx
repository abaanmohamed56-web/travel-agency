"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Zap, BookOpen, BarChart2,
  Settings, TrendingUp, Shield, Bell, Menu, X, LogOut, ChevronRight,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Signals", href: "/admin/signals", icon: Zap },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080A0F] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-white/5 glass-dark flex-col">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FFB800] to-[#FF8C00] flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-syne font-bold text-white">Admin Panel</div>
              <div className="text-[10px] text-[#FFB800]">SkillPips</div>
            </div>
          </div>
          <div className="h-px bg-white/5 mb-6 mt-4" />
          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/20"
                      : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                  {active && <ChevronRight className="w-3 h-3 ml-auto" />}
                </Link>
              );
            })}
          </nav>
          <div className="pt-4 border-t border-white/5">
            <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2.5 text-sm text-white/40 hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-red-400 hover:bg-red-500/5 transition-all">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 glass-dark border-b border-white/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#FFB800]" />
              <span className="font-syne font-semibold text-white">Admin Panel</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-white/40 hover:text-white">
                <Bell className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB800] to-[#FF8C00] flex items-center justify-center text-xs font-bold text-white">
                A
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
