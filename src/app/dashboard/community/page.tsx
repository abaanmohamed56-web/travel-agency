"use client";

import { motion } from "framer-motion";
import { Users, MessageSquare, Heart, TrendingUp, Pin } from "lucide-react";

const posts = [
  {
    id: 1, author: "Marcus Chen", avatar: "MC", plan: "VIP", time: "2h ago",
    content: "Just hit my TP2 on the EUR/USD long I posted yesterday. +247 pips! The order block on the 4H played out perfectly. Patience is truly the key 🔥",
    likes: 48, comments: 12, pinned: true,
    tag: "Trade Result",
  },
  {
    id: 2, author: "Sarah W.", avatar: "SW", plan: "Pro", time: "4h ago",
    content: "Quick reminder: NFP data drops tomorrow at 1:30 PM GMT. Suggest staying out of USD pairs 30 min before and after. Let the volatility settle before entering.",
    likes: 31, comments: 8, pinned: false,
    tag: "Market Reminder",
  },
  {
    id: 3, author: "James O.", avatar: "JO", plan: "Pro", time: "6h ago",
    content: "Question for the community: how do you handle the London-NY overlap? I've been struggling with the whipsaws during that 2-hour window. Any tips?",
    likes: 15, comments: 22, pinned: false,
    tag: "Question",
  },
  {
    id: 4, author: "Priya S.", avatar: "PS", plan: "VIP", time: "1d ago",
    content: "6 months ago I was about to give up trading. Today I closed my best month ever: +1,240 pips, 87% win rate. If you're struggling — don't quit. The breakthrough is coming.",
    likes: 124, comments: 35, pinned: false,
    tag: "Motivation",
  },
];

export default function CommunityPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-syne font-bold text-white mb-1">Community</h1>
        <p className="text-sm text-white/40">Connect with 20,000+ traders worldwide</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Members Online", value: "1,247", color: "#00D4A0" },
          { label: "Posts Today", value: "384", color: "#00D4FF" },
          { label: "Active Discussions", value: "56", color: "#FFB800" },
        ].map((s) => (
          <div key={s.label} className="card-premium rounded-xl p-3 text-center">
            <div className="text-xl font-syne font-bold" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs text-white/30">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`card-premium rounded-2xl p-5 ${post.pinned ? "border-[#00D4FF]/20" : ""}`}
          >
            {post.pinned && (
              <div className="flex items-center gap-1.5 text-xs text-[#00D4FF] mb-3">
                <Pin className="w-3 h-3" /> Pinned
              </div>
            )}
            <div className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#0099CC] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {post.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{post.author}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded text-[#FFB800] bg-[#FFB800]/10">{post.plan}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded text-white/30 bg-white/5">{post.tag}</span>
                </div>
                <div className="text-xs text-white/25 mt-0.5">{post.time}</div>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed mb-4">{post.content}</p>
            <div className="flex items-center gap-5 pt-3 border-t border-white/5">
              <button className="flex items-center gap-1.5 text-xs text-white/30 hover:text-red-400 transition-colors">
                <Heart className="w-4 h-4" /> {post.likes}
              </button>
              <button className="flex items-center gap-1.5 text-xs text-white/30 hover:text-[#00D4FF] transition-colors">
                <MessageSquare className="w-4 h-4" /> {post.comments}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
