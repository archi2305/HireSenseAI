import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, CheckCircle, Info, Zap, X, ChevronRight } from "lucide-react"

const NotificationDropdown = ({ items, open }) => {
  if (!items || items.length === 0) {
    return (
      <div className="p-12 text-center opacity-30">
        <Bell className="w-8 h-8 mx-auto mb-3" />
        <p className="text-[11px] font-black uppercase tracking-widest">Silence Verified</p>
      </div>
    )
  }

  return (
    <div className="max-h-[400px] flex flex-col font-sans">
      <div className="px-6 py-4 border-b border-theme-border bg-theme-sidebar/50 backdrop-blur-sm flex items-center justify-between">
         <div className="flex items-center gap-2">
            <Zap size={14} className="text-theme-accent" />
            <h3 className="text-[11px] font-black text-theme-text uppercase tracking-widest leading-none">Intelligence Feed</h3>
         </div>
         <span className="px-2 py-0.5 rounded-full bg-theme-accent/10 text-theme-accent text-[9px] font-black uppercase tracking-widest">
           {items.length} Active
         </span>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-theme-border/30">
        {items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="p-5 hover:bg-theme-accent/[0.03] transition-all duration-300 group cursor-pointer relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-16 h-16 bg-theme-accent/5 blur-2xl pointer-events-none group-hover:opacity-100 opacity-0 transition-opacity" />
             
             <div className="flex gap-4 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-center text-theme-accent shrink-0 group-hover:bg-theme-accent group-hover:text-white transition-all duration-500 shadow-sm">
                   <Info size={18} />
                </div>
                <div className="flex-1 space-y-1">
                   <div className="flex items-center justify-between">
                      <p className="text-[13px] font-bold text-theme-text group-hover:text-theme-accent transition-colors">Neural Sync Complete</p>
                      <span className="text-[10px] text-theme-textSecondary opacity-40 font-black tracking-widest uppercase">2m ago</span>
                   </div>
                   <p className="text-[12px] text-theme-textSecondary leading-relaxed font-medium line-clamp-2 italic opacity-70">
                     {item.message} Intelligence framework successfully recalibrated against global matching standards.
                   </p>
                </div>
                <ChevronRight size={14} className="mt-1 text-theme-textSecondary opacity-0 group-hover:opacity-30 group-hover:translate-x-1 transition-all" />
             </div>
          </motion.div>
        ))}
      </div>

      <div className="p-3 border-t border-theme-border bg-theme-sidebar/30">
         <button className="w-full py-2.5 rounded-xl text-[11px] font-black text-theme-textSecondary uppercase tracking-[0.2em] hover:text-theme-text hover:bg-theme-surface transition-all duration-300 active:scale-95">
           Dismiss All Intel
         </button>
      </div>
    </div>
  )
}

export default NotificationDropdown
