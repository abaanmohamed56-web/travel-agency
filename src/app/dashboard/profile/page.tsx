"use client";

import { motion } from "framer-motion";
import { User, Camera, MapPin, Globe, AtSign, Save } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-syne font-bold text-white mb-1">Profile</h1>
        <p className="text-sm text-white/40">Manage your public profile and personal details</p>
      </motion.div>

      {/* Avatar section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="card-premium rounded-2xl p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#0099CC] flex items-center justify-center text-2xl font-bold text-white">
              JD
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full glass border border-white/20 flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-white/60" />
            </button>
          </div>
          <div>
            <div className="text-lg font-syne font-semibold text-white">John Doe</div>
            <div className="text-sm text-white/40">Pro Member · Joined May 2026</div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400">Active Subscription</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card-premium rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-syne font-semibold text-white mb-2">Personal Information</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">First Name</label>
            <input defaultValue="John" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D4FF]/40" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Last Name</label>
            <input defaultValue="Doe" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D4FF]/40" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Email</label>
          <input defaultValue="john@example.com" type="email" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#00D4FF]/40" />
        </div>

        <div>
          <label className="block text-xs text-white/40 mb-1.5">Bio</label>
          <textarea rows={3} placeholder="Tell the community about yourself..." className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#00D4FF]/40 resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</label>
            <input placeholder="New York, USA" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#00D4FF]/40" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5 flex items-center gap-1"><AtSign className="w-3 h-3" /> Twitter/X</label>
            <input placeholder="@username" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#00D4FF]/40" />
          </div>
        </div>

        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-[#080A0F] bg-gradient-to-r from-[#00D4FF] to-[#0099CC]">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </motion.div>
    </div>
  );
}
