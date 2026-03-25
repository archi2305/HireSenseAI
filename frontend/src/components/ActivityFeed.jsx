import React from 'react'
import { motion } from 'framer-motion'
import { FileText, UserPlus, Star, CheckCircle } from 'lucide-react'

const MOCK_ACTIVITY = [
  { id: 1, type: 'parse', user: 'System', target: 'John_Doe_Resume.pdf', time: '2m ago', icon: FileText, color: 'text-theme-accent' },
  { id: 2, type: 'match', user: 'Recruiter', target: 'Senior Frontend', time: '15m ago', icon: Star, color: 'text-warning' },
  { id: 3, type: 'added', user: 'HireSense', target: 'Sarah Smith', time: '1h ago', icon: UserPlus, color: 'text-success' },
  { id: 4, type: 'system', user: 'Engine', target: 'Model Updated', time: '3h ago', icon: CheckCircle, color: 'text-theme-textSecondary' },
  { id: 5, type: 'parse', user: 'System', target: 'Mike_Ross.pdf', time: '5h ago', icon: FileText, color: 'text-theme-accent' },
]

export default function ActivityFeed() {
  return (
    <div className="flex flex-col h-full font-sans">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
           <h3 className="text-[11px] font-black text-theme-text uppercase tracking-[0.2em] leading-none">Live Neural Stream</h3>
        </div>
        <span className="text-[9px] font-black text-theme-accent uppercase tracking-widest bg-theme-accent/10 px-2 py-0.5 rounded-full">Real-time</span>
      </div>
      
      <div className="space-y-4">
        {MOCK_ACTIVITY.map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="flex gap-3 items-start group relative"
            >
              <div className="relative z-10">
                <div className={`p-1.5 rounded-full bg-theme-bg border border-theme-border ${item.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon size={12} />
                </div>
                {idx !== MOCK_ACTIVITY.length - 1 && (
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-px h-6 bg-theme-border group-hover:bg-theme-textSecondary/20 transition-colors" />
                )}
              </div>
              
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-[12px] text-theme-text leading-tight truncate">
                  <span className="font-semibold">{item.user}</span>
                  <span className="text-theme-textSecondary"> performed </span>
                  <span className="font-medium">{item.type}</span>
                </p>
                <p className="text-[11px] text-theme-textSecondary mt-0.5 truncate italic">
                   {item.target}
                </p>
                <p className="text-[10px] text-theme-textSecondary/50 mt-1 font-mono">{item.time}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      <button className="mt-8 text-[11px] font-semibold text-theme-textSecondary hover:text-theme-text transition-colors flex items-center gap-1.5 uppercase tracking-wider">
        View audit log →
      </button>
    </div>
  )
}
