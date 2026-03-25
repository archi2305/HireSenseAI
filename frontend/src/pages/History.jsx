import { useEffect, useState } from "react"
import axios from "axios"
import { Calendar, Briefcase, History as HistoryIcon, MoreHorizontal, ArrowRight, Download, Trash2 } from "lucide-react"
import { motion } from "framer-motion"

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
    <div className="flex flex-col h-full max-w-[1200px] mx-auto w-full p-6 space-y-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-[22px] font-bold text-theme-text tracking-tight">Activity Log</h1>
            <p className="text-[13px] text-theme-textSecondary italic">Historical analysis and scoring audit.</p>
         </div>
         <button className="linear-btn-secondary px-3 py-1.5 flex items-center gap-2">
            <Download size={14} />
            <span className="text-[12px]">Export Logs</span>
         </button>
      </div>

      <div className="linear-card overflow-hidden shadow-linear-lg">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 p-3 border-b border-theme-border bg-theme-sidebar/40 text-[10px] font-bold text-theme-textSecondary uppercase tracking-widest opacity-70">
          <div className="col-span-4 pl-3">Job Role & Candidate</div>
          <div className="col-span-3">Unique ID</div>
          <div className="col-span-2 text-center">ATS Weight</div>
          <div className="col-span-2 text-right">Timestamp</div>
          <div className="col-span-1 text-right pr-3"></div>
        </div>

        {/* List Content */}
        <div className="flex flex-col divide-y divide-theme-border/50">
          {loading ? (
            [1, 2, 3, 4].map(i => <div key={i} className="h-14 bg-theme-surface animate-pulse opacity-10" />)
          ) : analyses.length > 0 ? analyses.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="grid grid-cols-12 gap-4 p-3 hover:bg-theme-hover transition-all duration-150 items-center group cursor-pointer"
            >
              <div className="col-span-4 flex items-center gap-3 pl-3">
                <div className="w-8 h-8 rounded-sm border border-theme-border bg-theme-bg flex items-center justify-center shrink-0 group-hover:border-theme-accent/30 transition-colors">
                  <Briefcase size={14} className="text-theme-textSecondary group-hover:text-theme-accent transition-colors" />
                </div>
                <div className="flex flex-col min-w-0">
                   <h3 className="text-[13px] font-bold text-theme-text truncate leading-tight mb-0.5">
                     {item.job_role || "Unknown Role"}
                   </h3>
                   <span className="text-[11px] text-theme-textSecondary truncate">{item.candidate || "Unnamed Candidate"}</span>
                </div>
              </div>
              
              <div className="col-span-3 text-[11px] text-theme-textSecondary font-mono opacity-60">
                HS-{item.id}
              </div>

              <div className="col-span-2 text-center">
                <span className={`text-[12px] font-black px-1.5 py-0.5 rounded border border-current bg-opacity-5 
                  ${item.ats_score >= 80 ? 'text-success border-success/20' : 'text-warning border-warning/20'}`}>
                  {item.ats_score}%
                </span>
              </div>

              <div className="col-span-2 text-[11px] text-theme-textSecondary/60 text-right font-mono">
                {item.date ? item.date : "—"}
              </div>

              <div className="col-span-1 text-right pr-3">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-1 group-hover:translate-x-0">
                  <button className="p-1.5 text-theme-textSecondary hover:text-theme-text hover:bg-theme-border rounded transition-colors">
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="text-center py-20 text-[13px] text-theme-textSecondary italic opacity-60 font-medium">
              Your intelligence history is currently empty.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default History