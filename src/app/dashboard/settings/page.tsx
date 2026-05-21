"use client";

import { motion } from "framer-motion";
import { Bell, Shield, Smartphone, Globe, Moon, Trash2 } from "lucide-react";
import { useState } from "react";

function Toggle({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn(!on)}
      className={`relative w-11 h-6 rounded-full transition-all duration-200 ${on ? "bg-[#00D4FF]" : "bg-white/10"}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all duration-200 ${on ? "left-5.5 translate-x-0.5" : "left-0.5"}`} />
    </button>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
      <div>
        <div className="text-sm font-medium text-white">{label}</div>
        {desc && <div className="text-xs text-white/35 mt-0.5">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-syne font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-white/40">Manage your preferences and account settings</p>
      </motion.div>

      {/* Notifications */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="card-premium rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-4 h-4 text-[#00D4FF]" />
          <h3 className="text-base font-syne font-semibold text-white">Notifications</h3>
        </div>
        <SettingRow label="Signal Alerts" desc="Get notified when new signals are posted"><Toggle defaultOn /></SettingRow>
        <SettingRow label="Live Session Reminders" desc="15 min before sessions start"><Toggle defaultOn /></SettingRow>
        <SettingRow label="Community Activity" desc="Replies and mentions"><Toggle /></SettingRow>
        <SettingRow label="Weekly Report" desc="Performance summary every Monday"><Toggle defaultOn /></SettingRow>
        <SettingRow label="Marketing Emails" desc="Tips, updates, and offers"><Toggle /></SettingRow>
      </motion.div>

      {/* Security */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card-premium rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-4 h-4 text-[#FFB800]" />
          <h3 className="text-base font-syne font-semibold text-white">Security</h3>
        </div>
        <SettingRow label="Two-Factor Authentication" desc="Add an extra layer of security"><Toggle /></SettingRow>
        <SettingRow label="Login Notifications" desc="Email when new device logs in"><Toggle defaultOn /></SettingRow>
        <div className="pt-4">
          <button className="px-4 py-2.5 rounded-xl text-sm font-medium glass border border-white/10 hover:border-white/20 text-white/60 hover:text-white transition-all">
            Change Password
          </button>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="card-premium rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-4 h-4 text-[#A855F7]" />
          <h3 className="text-base font-syne font-semibold text-white">Preferences</h3>
        </div>
        <SettingRow label="Dark Mode" desc="Always on for SkillPips"><Toggle defaultOn /></SettingRow>
        <SettingRow label="Compact View" desc="Reduce spacing in dashboard"><Toggle /></SettingRow>
        <SettingRow label="24h Time Format" desc="Display times in 24h format"><Toggle defaultOn /></SettingRow>
      </motion.div>

      {/* Danger zone */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="card-premium rounded-2xl p-6 border-red-500/10">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="w-4 h-4 text-red-400" />
          <h3 className="text-base font-syne font-semibold text-red-400">Danger Zone</h3>
        </div>
        <p className="text-xs text-white/40 mb-4">Once you delete your account, there is no going back. All data will be permanently removed.</p>
        <button className="px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 border border-red-500/20 hover:bg-red-500/5 transition-all">
          Delete Account
        </button>
      </motion.div>
    </div>
  );
}
