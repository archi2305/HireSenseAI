import React from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, AlertCircle, Lightbulb } from "lucide-react"

export default function InsightCards() {
  const insights = [
    { 
      title: "Skill Trending", 
      desc: "Python expertise is up 22% this week in your candidate pool.", 
      icon: TrendingUp, 
      color: "text-purple-500", 
      bg: "bg-purple-500/5", 
      border: "border-purple-500/10",
      pastel: "var(--pastel-purple)"
    },
    { 
      title: "Match Alert", 
      desc: "3 candidates matching 'Senior Architect' found in recent sync.", 
      icon: Sparkles, 
      color: "text-indigo-500", 
      bg: "bg-indigo-500/5", 
      border: "border-indigo-500/10",
      pastel: "var(--pastel-purple)"
    },
    { 
      title: "Drop Detected", 
      desc: "Response rate for 'Frontend' roles dipped by 5% yesterday.", 
      icon: AlertCircle, 
      color: "text-orange-500", 
      bg: "bg-orange-500/5", 
      border: "border-orange-500/10",
      pastel: "var(--pastel-blue)"
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {insights.map((insight, i) => (
        <motion.div
          key={i}
          whileHover={{ y: -4, scale: 1.01 }}
          className={`p-5 rounded-2xl border ${insight.border} bg-theme-surface shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer`}
          style={{ backgroundColor: insight.pastel }}
        >
          <div className="flex items-start gap-4 relative z-10">
            <div className={`p-2.5 rounded-xl ${insight.bg} ${insight.color} shrink-0`}>
              <insight.icon size={18} />
            </div>
            <div className="space-y-1">
              <h4 className="text-[14px] font-black text-theme-text tracking-tight flex items-center gap-2">
                {insight.title}
                <Lightbulb size={12} className="opacity-30" />
              </h4>
              <p className="text-[13px] text-theme-textSecondary leading-relaxed font-medium opacity-80">
                {insight.desc}
              </p>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/40 blur-3xl -mr-12 -mt-12 group-hover:bg-white/60 transition-colors" />
        </motion.div>
      ))}
    </div>
  )
}
