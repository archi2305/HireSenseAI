import React from "react"
import { motion } from "framer-motion"
import { Plus, Zap, Target, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function QuickActionPanel() {
  const navigate = useNavigate()

  const actions = [
    { label: "Analyze", icon: Zap, path: "/analyzer", color: "bg-theme-accent" },
    { label: "Match", icon: Target, path: "/matching", color: "bg-theme-accent" },
    { label: "Search", icon: Search, path: "/dashboard", color: "bg-theme-accent" },
  ]

  return (
    <div className="fixed bottom-8 right-8 z-[60] flex flex-col-reverse items-center gap-3">
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 rounded-2xl bg-theme-accent text-white shadow-accent-glow flex items-center justify-center transition-all duration-300 relative group"
      >
        <Plus size={24} />
      </motion.button>
      
      <div className="flex flex-col-reverse items-center gap-3 pointer-events-none group-hover:pointer-events-auto opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        {actions.map((action, i) => (
          <motion.button
            key={i}
            whileHover={{ x: -10, scale: 1.05 }}
            onClick={() => navigate(action.path)}
            className={`flex items-center gap-3 px-4 py-2 rounded-xl border border-theme-border bg-theme-surface shadow-premium text-theme-text transition-all duration-300 pointer-events-auto`}
          >
            <action.icon size={16} className="text-theme-accent" />
            <span className="text-[12px] font-black uppercase tracking-widest leading-none">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
