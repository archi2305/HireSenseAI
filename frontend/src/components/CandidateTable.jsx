import React, { useState, useEffect } from "react"
import { 
  Users, Search, Filter, MoreHorizontal, Download, 
  ExternalLink, Mail, Phone, MapPin, Calendar, 
  ChevronRight, X, ArrowUpRight, Brain, Zap, Target
} from "lucide-react"
import api from "../services/api"
import { motion, AnimatePresence } from "framer-motion"
import ATSResultCard from "./ATSResultCard"

import { useDashboard } from "../context/DashboardContext"

export default function CandidateTable({ limit, hideFilters }) {
  const { candidates: contextCandidates, loading: contextLoading } = useDashboard()
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  
  const displayCandidates = limit ? contextCandidates.slice(0, limit) : contextCandidates
  const loading = contextLoading && displayCandidates.length === 0

  return (
    <div className="relative w-full">
      {!hideFilters && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
           <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-textSecondary group-focus-within:text-theme-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Filter global talent..." 
                className="linear-input pl-10 w-full md:w-[320px] bg-theme-surface/50 border-theme-border/60 focus:bg-theme-surface" 
              />
           </div>
           <div className="flex items-center gap-2">
              <button className="linear-btn-secondary px-4 py-2 flex items-center gap-2 text-[12px]">
                 <Filter size={14} />
                 <span>Filters</span>
              </button>
              <button className="linear-btn-secondary px-4 py-2 flex items-center gap-2 text-[12px]">
                 <Download size={14} />
                 <span>Export</span>
              </button>
           </div>
        </div>
      )}

      {/* Table Content */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-theme-border/60">
              <th className="px-6 py-4 text-left text-[11px] font-black text-theme-textSecondary uppercase tracking-[0.2em] opacity-50">Candidate Engine</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-theme-textSecondary uppercase tracking-[0.2em] opacity-50">Role Index</th>
              <th className="px-6 py-4 text-center text-[11px] font-black text-theme-textSecondary uppercase tracking-[0.2em] opacity-50">ATS Weight</th>
              <th className="px-6 py-4 text-left text-[11px] font-black text-theme-textSecondary uppercase tracking-[0.2em] opacity-50">Classification</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-border/40">
            {displayCandidates.map((candidate, idx) => (
              <motion.tr
                key={candidate.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelectedCandidate(candidate)}
                className="group hover:bg-theme-accent/[0.03] transition-all duration-300 cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-theme-accent/10 border border-theme-accent/20 flex items-center justify-center text-theme-accent group-hover:bg-theme-accent group-hover:text-white transition-all duration-500 shadow-sm">
                      {candidate.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-theme-text group-hover:text-theme-accent transition-colors">{candidate.name}</p>
                      <p className="text-[11px] text-theme-textSecondary font-medium">{candidate.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <p className="text-[13px] font-semibold text-theme-text">{candidate.role}</p>
                   <p className="text-[11px] text-theme-textSecondary opacity-60">Verified Credentials</p>
                </td>
                <td className="px-6 py-4 text-center">
                   <div className="inline-flex items-center justify-center px-2 py-1 rounded-lg bg-theme-bg border border-theme-border group-hover:border-theme-accent/30 transition-all duration-500">
                      <span className="text-[13px] font-black text-theme-accent">{candidate.score}%</span>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-current bg-opacity-10 
                     ${candidate.score >= 90 ? 'text-success border-success/30 bg-success' : 'text-warning border-warning/30 bg-warning'}`}>
                     {candidate.status}
                   </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <ChevronRight className="inline-block w-4 h-4 text-theme-textSecondary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-in Detail Drawer (Mixpanel Style) */}
      <AnimatePresence>
        {selectedCandidate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="fixed inset-0 bg-theme-bg/60 backdrop-blur-md z-[100] transition-all duration-500"
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 h-full w-full max-w-[500px] bg-theme-surface/95 backdrop-blur-3xl border-l border-white/5 shadow-2xl z-[101] overflow-y-auto"
            >
              <div className="p-8 space-y-8 min-h-full flex flex-col relative overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-theme-accent/10 blur-[80px] -mr-32 -mt-32 pointer-events-none" />

                <div className="flex items-center justify-between relative z-10">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-theme-accent shadow-accent-glow flex items-center justify-center text-white text-lg font-black">
                        {selectedCandidate.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-[20px] font-black text-theme-text tracking-tighter leading-tight">{selectedCandidate.name}</h2>
                        <div className="flex items-center gap-1.5 text-[11px] text-theme-accent font-bold uppercase tracking-widest">
                           <Zap size={10} fill="currentColor" />
                           <span>AI Recruiter Profile</span>
                        </div>
                      </div>
                   </div>
                   <button 
                     onClick={() => setSelectedCandidate(null)}
                     className="p-2 rounded-full hover:bg-theme-hover border border-transparent hover:border-theme-border transition-all duration-300 active:scale-90"
                   >
                     <X size={20} className="text-theme-textSecondary hover:text-theme-text" />
                   </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-2xl bg-theme-bg/50 border border-theme-border backdrop-blur-sm">
                      <p className="text-[10px] font-black text-theme-textSecondary uppercase tracking-widest mb-1">Status Code</p>
                      <p className="text-[13px] font-bold text-theme-text">{selectedCandidate.status}</p>
                   </div>
                   <div className="p-4 rounded-2xl bg-theme-accent/5 border border-theme-accent/20 backdrop-blur-sm">
                      <p className="text-[10px] font-black text-theme-accent uppercase tracking-widest mb-1">Engine Match</p>
                      <p className="text-[13px] font-black text-theme-accent">{selectedCandidate.score}% Efficiency</p>
                   </div>
                </div>

                <div className="space-y-6 flex-1">
                   <ATSResultCard compact={true} />
                   
                   <div className="space-y-4">
                      <h4 className="text-[11px] font-black text-theme-text uppercase tracking-[0.2em] opacity-50 flex items-center gap-2">
                        <Users size={12} /> Contact Intelligence
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-theme-surface border border-theme-border group hover:border-theme-accent/30 transition-all duration-300 cursor-pointer">
                           <Mail className="w-4 h-4 text-theme-textSecondary group-hover:text-theme-accent transition-colors" />
                           <span className="text-[13px] font-medium text-theme-textSecondary group-hover:text-theme-text">{selectedCandidate.email}</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-theme-surface border border-theme-border group hover:border-theme-accent/30 transition-all duration-300 cursor-pointer">
                           <Phone className="w-4 h-4 text-theme-textSecondary group-hover:text-theme-accent transition-colors" />
                           <span className="text-[13px] font-medium text-theme-textSecondary group-hover:text-theme-text">{selectedCandidate.phone}</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-theme-surface border border-theme-border group hover:border-theme-accent/30 transition-all duration-300 cursor-pointer">
                           <MapPin className="w-4 h-4 text-theme-textSecondary group-hover:text-theme-accent transition-colors" />
                           <span className="text-[13px] font-medium text-theme-textSecondary group-hover:text-theme-text">{selectedCandidate.location}</span>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="pt-8 mt-auto border-t border-theme-border flex gap-3 relative z-10 bg-theme-surface/95 backdrop-blur-xl">
                   <button className="flex-1 linear-btn-secondary py-3 flex items-center justify-center gap-2">
                      <Mail size={16} />
                      <span className="text-[13px] font-bold">Initiate Comms</span>
                   </button>
                   <button className="flex-1 linear-btn-primary py-3 flex items-center justify-center gap-2 shadow-accent-glow">
                      <ExternalLink size={16} />
                      <span className="text-[13px] font-bold">Full Profile</span>
                   </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
