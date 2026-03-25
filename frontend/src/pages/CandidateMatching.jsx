import React, { useState } from "react"
import { Search, Target, Zap, ArrowRight, Brain, Briefcase, Filter, Sparkles } from "lucide-react"
import api from "../services/api"
import toast from "react-hot-toast"
import CandidateTable from "../components/CandidateTable"
import { motion, AnimatePresence } from "framer-motion"
import SectionReveal from "../components/SectionReveal"

export default function CandidateMatching() {
  const [jobDescription, setJobDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  const handleMatch = async () => {
    if (!jobDescription) return toast.error("Intel framework required.")
    setLoading(true)
    try {
      const res = await api.post("/match-candidates", { 
        job_description: jobDescription,
        top_n: 10
      })
      setResults(res.data)
      toast.success("Matching engine synchronized.")
    } catch {
      toast.error("Deep search failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full space-y-12 font-sans overflow-x-hidden">
      
      <SectionReveal direction="down">
        <div className="flex flex-col gap-2 mb-8">
           <div className="flex items-center gap-2 text-theme-accent font-black text-[11px] uppercase tracking-[0.2em]">
              <Target size={14} />
              <span>Matching Engine</span>
           </div>
           <h1 className="text-[32px] font-black text-theme-text tracking-tighter leading-none">
             Candidate <span className="text-theme-accent">Matching</span>
           </h1>
           <p className="text-[14px] text-theme-textSecondary max-w-xl font-medium leading-relaxed">
             Recursive semantic matching of global talent pools against high-intensity job specifications.
           </p>
        </div>
      </SectionReveal>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch">
        
        {/* Input Sidebar */}
        <SectionReveal direction="right" delay={0.2} className="lg:col-span-1 h-full">
          <div className="linear-card p-6 h-full flex flex-col relative overflow-hidden group border-theme-accent/5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-theme-accent/5 blur-2xl -mr-12 -mt-12 pointer-events-none group-hover:bg-theme-accent/10 transition-all duration-700" />
            
            <div className="space-y-6 relative z-10 flex-1">
               <div className="space-y-3">
                  <div className="flex items-center gap-2">
                     <Target size={14} className="text-theme-accent" />
                     <h3 className="text-[11px] font-black text-theme-text uppercase tracking-widest opacity-60">Specifications</h3>
                  </div>
                  <textarea 
                    placeholder="Enter protocol requirements..."
                    className="linear-input w-full min-h-[400px] resize-none bg-theme-bg/50 focus:bg-theme-surface"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
               </div>
            </div>

            <div className="pt-6">
               <button 
                onClick={handleMatch}
                disabled={loading}
                className="linear-btn-primary w-full py-3.5 flex items-center justify-center gap-2 shadow-accent-glow"
               >
                 {loading ? (
                   <>
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     <span className="text-[13px] font-black uppercase tracking-widest">Searching...</span>
                   </>
                 ) : (
                   <>
                     <Zap size={14} fill="white" />
                     <span className="text-[13px] font-black uppercase tracking-widest">Execute Search</span>
                   </>
                 )}
               </button>
            </div>
          </div>
        </SectionReveal>

        {/* Results Main */}
        <SectionReveal direction="left" delay={0.4} className="lg:col-span-3 h-full">
          <div className="linear-card p-4 h-full bg-theme-sidebar/20 relative overflow-hidden flex flex-col min-h-[600px] border-theme-accent/5">
             <div className="flex items-center justify-between px-4 py-3 border-b border-theme-border bg-theme-sidebar/30 relative z-10">
                <div className="flex items-center gap-2.5">
                   <Filter size={14} className="text-theme-accent" />
                   <h3 className="text-[13px] font-black text-theme-text uppercase tracking-widest">Weighted Matches</h3>
                </div>
                {results && (
                   <span className="text-[11px] font-black text-theme-textSecondary opacity-50 uppercase tracking-widest">
                     Found {results.length} Intel Points
                   </span>
                )}
             </div>

             <div className="flex-1 flex flex-col">
                <AnimatePresence mode="wait">
                   {loading ? (
                     <motion.div 
                       key="loading"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       exit={{ opacity: 0 }}
                       className="p-8 space-y-4"
                     >
                        {[1,2,3,4,5,6].map(i => (
                          <div key={i} className="flex gap-4 p-4 rounded-xl border border-theme-border/60 bg-theme-surface animate-pulse">
                             <div className="w-10 h-10 rounded-lg bg-theme-bg" />
                             <div className="flex-1 space-y-2 py-1">
                                <div className="h-3 bg-theme-bg rounded w-32" />
                                <div className="h-2 bg-theme-bg rounded w-full" />
                             </div>
                          </div>
                        ))}
                     </motion.div>
                   ) : results ? (
                     <motion.div 
                       key="results"
                       initial={{ opacity: 0, y: 10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="p-0 h-full"
                     >
                        <CandidateTable limit={10} hideFilters={true} />
                     </motion.div>
                   ) : (
                     <motion.div 
                       key="empty"
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       className="flex-1 flex flex-col items-center justify-center p-20 gap-4 opacity-30"
                     >
                        <Brain size={64} className="mb-2" />
                        <div className="text-center">
                           <p className="text-[14px] font-bold tracking-tighter uppercase mb-1">Awaiting Intel injection</p>
                           <p className="text-[11px] font-medium italic">Initialize search for high-fidelity candidate matching.</p>
                        </div>
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </div>
        </SectionReveal>

      </div>
    </div>
  )
}
