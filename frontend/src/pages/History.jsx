import { useEffect, useState } from "react"
import axios from "axios"
import { Calendar, Briefcase, History as HistoryIcon, MoreHorizontal, ArrowRight, Download, Trash2, Zap, Target } from "lucide-react"
import { motion } from "framer-motion"
import SectionReveal from "../components/SectionReveal"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function History() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/analysis`)
      if (response.data && response.data.length > 0) {
        setAnalyses(response.data)
      } else {
        mockData()
      }
    } catch (error) {
      console.error("Failed to fetch history API, using mock.", error)
      mockData()
    } finally {
      setLoading(false)
    }
  }

  const mockData = () => {
    setAnalyses([
      { id: "10123", ats_score: 85, job_role: "Software Engineer", date: "2026-03-15", candidate: "John Doe" },
      { id: "10124", ats_score: 92, job_role: "Frontend Developer", date: "2026-03-14", candidate: "Sarah Smith" },
      { id: "10125", ats_score: 55, job_role: "Data Scientist", date: "2026-03-11", candidate: "Mike Ross" },
    ])
  }

  return (
    <div className="flex flex-col h-full max-w-[1200px] mx-auto w-full p-8 space-y-12 font-sans">
      
      <SectionReveal direction="down">
        <div className="flex items-center justify-between">
           <div>
              <div className="flex items-center gap-2 text-theme-accent font-black text-[11px] uppercase tracking-[0.2em] mb-2">
                 <HistoryIcon size={14} />
                 <span>Audit Engine</span>
              </div>
              <h1 className="text-[32px] font-black text-theme-text tracking-tighter leading-none mb-1">Activity <span className="text-theme-accent">Log</span></h1>
              <p className="text-[14px] text-theme-textSecondary italic font-medium">Historical analysis and scoring audit.</p>
           </div>
           <button className="linear-btn-secondary px-5 py-2.5 flex items-center gap-2.5 group group-hover:shadow-accent-glow transition-all">
              <Download size={15} />
              <span className="text-[13px] font-bold">Export Logs</span>
           </button>
        </div>
      </SectionReveal>

      <SectionReveal delay={0.2} direction="up">
        <div className="linear-card overflow-hidden shadow-premium border-theme-accent/5 bg-theme-surface/50 backdrop-blur-sm">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-theme-border bg-theme-sidebar/40 text-[10px] font-black text-theme-textSecondary uppercase tracking-[0.2em] opacity-50">
            <div className="col-span-4">Job Role Index / Candidate</div>
            <div className="col-span-3">Unique Protocol ID</div>
            <div className="col-span-2 text-center">ATS Weight</div>
            <div className="col-span-2 text-right">Timestamp</div>
            <div className="col-span-1 text-right"></div>
          </div>

          {/* List Content */}
          <div className="flex flex-col divide-y divide-theme-border/30">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-16 bg-theme-surface animate-pulse opacity-10" />)
            ) : analyses.length > 0 ? analyses.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-theme-accent/[0.03] transition-all duration-300 items-center group cursor-pointer"
              >
                <div className="col-span-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl border border-theme-border bg-theme-bg flex items-center justify-center shrink-0 group-hover:border-theme-accent/30 group-hover:bg-theme-accent/5 transition-all duration-500">
                    <Briefcase size={16} className="text-theme-textSecondary group-hover:text-theme-accent transition-colors" />
                  </div>
                  <div className="flex flex-col min-w-0">
                     <h3 className="text-[14px] font-bold text-theme-text truncate leading-tight mb-0.5 group-hover:text-theme-accent transition-colors">
                       {item.job_role || "Unknown Role"}
                     </h3>
                     <span className="text-[11px] text-theme-textSecondary truncate font-medium">{item.candidate || "Unnamed Candidate"}</span>
                  </div>
                </div>
                
                <div className="col-span-3 text-[11px] text-theme-textSecondary font-black font-mono opacity-40 uppercase tracking-widest">
                  HS-PT-{item.id}
                </div>

                <div className="col-span-2 text-center">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border bg-theme-bg group-hover:bg-theme-surface transition-all duration-500 
                    ${item.ats_score >= 80 ? 'text-success border-success/20' : 'text-warning border-warning/20'}`}>
                    <Zap size={10} fill="currentColor" />
                    <span className="text-[12px] font-black">{item.ats_score}%</span>
                  </div>
                </div>

                <div className="col-span-2 text-[11px] text-theme-textSecondary/50 text-right font-black font-mono tracking-widest uppercase">
                   {item.date ? item.date.replace(/-/g, ' / ') : "—"}
                </div>

                <div className="col-span-1 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                    <div className="p-2 text-theme-accent hover:bg-theme-accent/10 rounded-full transition-colors">
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-24 text-[13px] text-theme-textSecondary italic opacity-40 font-bold uppercase tracking-widest">
                <Target size={48} className="mx-auto mb-4 opacity-20" />
                Intelligence History Empty
              </div>
            )}
          </div>
        </div>
      </SectionReveal>
    </div>
  )
}

export default History