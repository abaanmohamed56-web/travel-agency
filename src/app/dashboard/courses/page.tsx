"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Play, CheckCircle, Lock, Clock, Star, Search } from "lucide-react";

const courses = [
  {
    id: 1, title: "Forex Fundamentals",
    desc: "Master the basics: currency pairs, pips, lots, and how the forex market works.",
    lessons: 24, duration: "4h 20m", progress: 100, completed: true, level: "Beginner",
    color: "#00D4FF", thumbnail: "FF",
  },
  {
    id: 2, title: "Technical Analysis Mastery",
    desc: "Chart patterns, indicators, support & resistance, and price action setups.",
    lessons: 48, duration: "9h 15m", progress: 67, completed: false, level: "Intermediate",
    color: "#FFB800", thumbnail: "TA",
  },
  {
    id: 3, title: "Smart Money Concepts",
    desc: "Institutional order flow, order blocks, FVG, BOS, and CHOCH explained.",
    lessons: 36, duration: "7h 40m", progress: 25, completed: false, level: "Advanced",
    color: "#A855F7", thumbnail: "SM",
  },
  {
    id: 4, title: "Risk Management Mastery",
    desc: "Position sizing, risk-per-trade, drawdown recovery, and capital preservation.",
    lessons: 18, duration: "3h 30m", progress: 0, completed: false, level: "All Levels",
    color: "#00D4A0", thumbnail: "RM",
  },
  {
    id: 5, title: "Trading Psychology",
    desc: "Emotional control, discipline, losing streaks, and the professional trader mindset.",
    lessons: 22, duration: "4h 10m", progress: 0, completed: false, level: "All Levels",
    color: "#FF6B6B", thumbnail: "TP",
  },
  {
    id: 6, title: "Live Trade Analysis",
    desc: "Real trades broken down in detail — entries, management, and post-trade reviews.",
    lessons: 60, duration: "15h 00m", progress: 0, completed: false, level: "Pro Only",
    color: "#4ECDC4", thumbnail: "LT", locked: true,
  },
];

export default function CoursesPage() {
  const [search, setSearch] = useState("");
  const filtered = courses.filter(
    (c) => c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-syne font-bold text-white mb-1">Courses</h1>
        <p className="text-sm text-white/40">1,000+ lessons from beginner to advanced</p>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#00D4FF]/40 max-w-md"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="card-premium rounded-2xl overflow-hidden group cursor-pointer"
          >
            {/* Thumbnail */}
            <div
              className="relative h-36 flex items-center justify-center text-3xl font-syne font-black"
              style={{ background: `linear-gradient(135deg, ${course.color}20, ${course.color}08)`, borderBottom: `1px solid ${course.color}20` }}
            >
              <span style={{ color: course.color }}>{course.thumbnail}</span>
              {course.locked && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Lock className="w-6 h-6 text-white/60" />
                    <span className="text-xs text-white/50">Upgrade to unlock</span>
                  </div>
                </div>
              )}
              {course.completed && (
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-emerald-400/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
              )}
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ color: course.color, background: `${course.color}15` }}
                >
                  {course.level}
                </span>
                <div className="flex items-center gap-1 text-[#FFB800]">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs text-white/40">4.9</span>
                </div>
              </div>

              <h3 className="text-base font-syne font-semibold text-white mb-1">{course.title}</h3>
              <p className="text-xs text-white/40 leading-relaxed mb-4">{course.desc}</p>

              <div className="flex items-center gap-3 text-xs text-white/30 mb-4">
                <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {course.lessons} lessons</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {course.duration}</span>
              </div>

              {/* Progress */}
              {course.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/40">Progress</span>
                    <span style={{ color: course.color }}>{course.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${course.progress}%`, background: course.color }}
                    />
                  </div>
                </div>
              )}

              <button
                disabled={!!course.locked}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  course.locked
                    ? "glass text-white/30 cursor-not-allowed"
                    : "text-white glass hover:border-white/20"
                }`}
              >
                {course.locked ? (
                  <><Lock className="w-3.5 h-3.5" /> Locked</>
                ) : course.completed ? (
                  <><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Review Course</>
                ) : course.progress > 0 ? (
                  <><Play className="w-3.5 h-3.5" fill="currentColor" /> Continue</>
                ) : (
                  <><Play className="w-3.5 h-3.5" fill="currentColor" /> Start Course</>
                )}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
