import React from "react"
import { Search, Filter, Calendar, ChevronDown, Sparkles } from "lucide-react"
import { useDashboard } from "../context/DashboardContext"
import { motion } from "framer-motion"

export default function FilterBar() {
  const { 
    searchTerm, setSearchTerm, 
    skillFilter, setSkillFilter, 
    minScoreFilter, setMinScoreFilter 
  } = useDashboard()

  const filterOptions = [
    { label: "Date Range", icon: Calendar, value: "All Time" },
    { label: "Job Role", icon: Sparkles, value: "All Roles" },
    { label: "Source", icon: Filter, value: "All Sources" },
  ]

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-theme-surface/80 backdrop-blur-xl border border-theme-border shadow-sm mb-8"
    >
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative group flex-1 md:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-textSecondary group-focus-within:text-theme-accent transition-colors" />
          <input
            type="text"
            placeholder="Global search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="linear-input pl-10 w-full md:w-[280px] bg-theme-bg/50 border-theme-border/50 focus:bg-theme-bg"
          />
        </div>
        
        <div className="h-6 w-px bg-theme-border mx-1 hidden md:block" />
        
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          {filterOptions.map((opt, i) => (
            <button 
              key={i}
              className="px-3 py-1.5 rounded-lg border border-theme-border bg-theme-bg/30 hover:bg-theme-hover transition-all flex items-center gap-2 shrink-0 group"
            >
              <opt.icon size={14} className="text-theme-textSecondary group-hover:text-theme-accent transition-colors" />
              <span className="text-[12px] font-semibold text-theme-textSecondary group-hover:text-theme-text">{opt.value}</span>
              <ChevronDown size={12} className="opacity-30 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
        <div className="flex items-center gap-2 rounded-lg bg-theme-bg p-1 border border-theme-border">
           <button className="px-3 py-1 rounded bg-theme-surface shadow-sm text-[11px] font-black uppercase tracking-widest text-theme-accent">Live Feed</button>
           <button className="px-3 py-1 text-[11px] font-black uppercase tracking-widest text-theme-textSecondary hover:text-theme-text transition-colors">Historical</button>
        </div>
      </div>
    </motion.div>
  )
}
