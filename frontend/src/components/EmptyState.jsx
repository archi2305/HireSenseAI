import React from 'react'
import { motion } from 'framer-motion'
import { Search, Inbox, Sparkles } from 'lucide-react'

export default function EmptyState({ title, description, icon: Icon = Inbox }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-theme-bg border border-theme-border flex items-center justify-center text-theme-textSecondary/30 shadow-sm relative overflow-hidden group">
        <Icon size={28} className="relative z-10 group-hover:text-theme-accent transition-colors duration-500" />
        <div className="absolute inset-0 bg-theme-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="space-y-1">
        <h3 className="text-[14px] font-black text-theme-text uppercase tracking-widest leading-none">
          {title || "No Neural Data Found"}
        </h3>
        <p className="text-[12px] text-theme-textSecondary max-w-[240px] leading-relaxed font-medium opacity-60">
          {description || "The intelligence engine is currently waiting for new ingestion parameters."}
        </p>
      </div>
      <button className="linear-btn-secondary px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 group">
        <Sparkles size={12} className="text-theme-accent" />
        <span>Initiate Sync</span>
      </button>
    </motion.div>
  )
}
