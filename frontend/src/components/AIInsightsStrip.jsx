import React, { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, Zap, AlertTriangle, Star, ChevronRight } from "lucide-react"

const INSIGHTS = [
  {
    icon: TrendingUp,
    label: "Trending Skill",
    value: "Python up 34%",
    color: "#6366f1",
    bg: "linear-gradient(135deg, rgba(99,102,241,.12), rgba(99,102,241,.04))",
  },
  {
    icon: Star,
    label: "Match Rate",
    value: "Increased +12%",
    color: "#10b981",
    bg: "linear-gradient(135deg, rgba(16,185,129,.12), rgba(16,185,129,.04))",
  },
  {
    icon: AlertTriangle,
    label: "Candidate Drop",
    value: "−8% this week",
    color: "#f59e0b",
    bg: "linear-gradient(135deg, rgba(245,158,11,.12), rgba(245,158,11,.04))",
  },
  {
    icon: Zap,
    label: "AI Accuracy",
    value: "98.4% precision",
    color: "#8b5cf6",
    bg: "linear-gradient(135deg, rgba(139,92,246,.12), rgba(139,92,246,.04))",
  },
  {
    icon: TrendingUp,
    label: "Top Role",
    value: "Backend Engineer",
    color: "#3b82f6",
    bg: "linear-gradient(135deg, rgba(59,130,246,.12), rgba(59,130,246,.04))",
  },
]

export default function AIInsightsStrip() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (paused) return
    timerRef.current = setInterval(() => {
      setCurrentIdx(i => (i + 1) % INSIGHTS.length)
    }, 3500)
    return () => clearInterval(timerRef.current)
  }, [paused])

  return (
    <div style={{ marginBottom:24, overflow:"hidden" }}>
      {/* Desktop — show all */}
      <div
        style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:4 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {INSIGHTS.map((insight, i) => {
          const Icon = insight.icon
          return (
            <motion.div
              key={i}
              initial={{ opacity:0, y:10 }}
              animate={{ opacity:1, y:0 }}
              transition={{ delay: i*0.06 }}
              whileHover={{ y:-3, scale:1.01 }}
              style={{
                flex:"0 0 auto",
                minWidth:190,
                padding:"14px 18px",
                borderRadius:14,
                background: insight.bg,
                border:`1px solid ${insight.color}22`,
                cursor:"default",
                transition:"all .25s"
              }}
            >
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                <div style={{ background:`${insight.color}20`, borderRadius:8, padding:6 }}>
                  <Icon size={14} style={{ color:insight.color }} />
                </div>
                <span style={{ fontSize:10, fontWeight:800, color:insight.color, textTransform:"uppercase", letterSpacing:".08em" }}>
                  {insight.label}
                </span>
              </div>
              <p style={{ fontSize:15, fontWeight:800, color:"var(--text)", margin:0, letterSpacing:"-.01em" }}>
                {insight.value}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Mobile dot indicators */}
      <div style={{ display:"flex", gap:6, marginTop:10, justifyContent:"center" }}>
        {INSIGHTS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            style={{
              width: i===currentIdx ? 20 : 6,
              height:6, borderRadius:99,
              background: i===currentIdx ? "var(--accent)" : "var(--border)",
              border:"none", cursor:"pointer", padding:0,
              transition:"all .3s"
            }}
          />
        ))}
      </div>
    </div>
  )
}
