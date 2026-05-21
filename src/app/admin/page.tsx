"use client";

import { motion } from "framer-motion";
import {
  Users, DollarSign, Zap, BookOpen, TrendingUp, ArrowUpRight, Activity,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 12400, users: 180 },
  { month: "Feb", revenue: 18200, users: 245 },
  { month: "Mar", revenue: 24800, users: 312 },
  { month: "Apr", revenue: 22100, users: 298 },
  { month: "May", revenue: 31400, users: 420 },
  { month: "Jun", revenue: 38900, users: 510 },
  { month: "Jul", revenue: 35200, users: 487 },
  { month: "Aug", revenue: 44800, users: 612 },
];

const recentUsers = [
  { name: "Marcus Chen", email: "marcus@example.com", plan: "VIP", joined: "2h ago", status: "active" },
  { name: "Sarah Williams", email: "sarah@example.com", plan: "Pro", joined: "5h ago", status: "active" },
  { name: "James Okafor", email: "james@example.com", plan: "Starter", joined: "1d ago", status: "trial" },
  { name: "Priya Sharma", email: "priya@example.com", plan: "VIP", joined: "2d ago", status: "active" },
  { name: "Tyler Rodriguez", email: "tyler@example.com", plan: "Pro", joined: "3d ago", status: "active" },
];

function StatCard({ icon: Icon, label, value, change, color }: {
  icon: React.ElementType; label: string; value: string; change: string; color: string;
}) {
  return (
    <div className="card-premium rounded-2xl p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400">
          <ArrowUpRight className="w-3 h-3" /> {change}
        </div>
      </div>
      <div className="text-2xl font-syne font-bold text-white mb-0.5">{value}</div>
      <div className="text-xs text-white/40">{label}</div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="space-y-6 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-syne font-bold text-white mb-1">Admin Overview</h1>
        <p className="text-sm text-white/40">Platform performance and management</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Members" value="20,482" change="+12.4%" color="#00D4FF" />
        <StatCard icon={DollarSign} label="Monthly Revenue" value="$44,800" change="+15.2%" color="#FFB800" />
        <StatCard icon={Zap} label="Signals Sent" value="48" change="this month" color="#00D4A0" />
        <StatCard icon={BookOpen} label="Active Courses" value="12" change="+2 new" color="#A855F7" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 card-premium rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-syne font-semibold text-white">Revenue Overview</h3>
              <p className="text-xs text-white/40">Monthly recurring revenue</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" /> +36% YTD
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFB800" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#FFB800" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1A1F2E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white" }} />
              <Area type="monotone" dataKey="revenue" stroke="#FFB800" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User growth */}
        <div className="card-premium rounded-2xl p-5">
          <h3 className="text-base font-syne font-semibold text-white mb-5">New Members</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1A1F2E", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "white" }} />
              <Bar dataKey="users" fill="#00D4FF" opacity={0.8} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent users */}
      <div className="card-premium rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-syne font-semibold text-white">Recent Registrations</h3>
          <a href="/admin/users" className="text-xs text-[#FFB800] hover:underline flex items-center gap-1">
            View all <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-white/30 text-xs border-b border-white/5">
                <th className="text-left pb-3 font-medium">User</th>
                <th className="text-left pb-3 font-medium">Email</th>
                <th className="text-left pb-3 font-medium">Plan</th>
                <th className="text-left pb-3 font-medium">Joined</th>
                <th className="text-left pb-3 font-medium">Status</th>
                <th className="text-right pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentUsers.map((user, i) => (
                <tr key={i} className="text-white/70">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#0099CC] flex items-center justify-center text-xs font-bold text-white">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-white text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-white/40">{user.email}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      user.plan === "VIP" ? "bg-[#A855F7]/10 text-[#A855F7]" :
                      user.plan === "Pro" ? "bg-[#FFB800]/10 text-[#FFB800]" :
                      "bg-[#00D4FF]/10 text-[#00D4FF]"
                    }`}>{user.plan}</span>
                  </td>
                  <td className="py-3 text-xs text-white/30">{user.joined}</td>
                  <td className="py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      user.status === "active" ? "bg-emerald-400/10 text-emerald-400" : "bg-yellow-400/10 text-yellow-400"
                    }`}>{user.status}</span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-xs text-[#FFB800] hover:underline">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
