import { useEffect, useState } from "react"
import axios from "axios"
import { Calendar, Briefcase, History as HistoryIcon, MoreHorizontal } from "lucide-react"

function History() {
  const [analyses, setAnalyses] = useState([])

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/analysis`)
      if (response.data && response.data.length > 0) {
        setAnalyses(response.data)
      } else {
        mockData()
      }
    } catch (error) {
      console.error("Failed to fetch history API, using mock.", error)
      mockData()
    }
  }

  const mockData = () => {
    setAnalyses([
      { id: "10123", ats_score: 85, job_role: "Software Engineer", date: "2026-03-15" },
      { id: "10124", ats_score: 92, job_role: "Frontend Developer", date: "2026-03-14" },
      { id: "10125", ats_score: 55, job_role: "Data Scientist", date: "2026-03-11" },
    ])
  }

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full pt-4">
      <div className="flex items-center gap-2 mb-6">
        <HistoryIcon className="w-5 h-5 text-theme-textSecondary" />
        <h1 className="text-xl font-semibold text-theme-text tracking-tight">Analysis History</h1>
      </div>

      <div className="bg-theme-bg border border-theme-border rounded-md shadow-sm flex flex-col overflow-hidden">
        {/* Header Row */}
        <div className="grid grid-cols-12 gap-4 p-3 border-b border-theme-border bg-theme-sidebar/50 text-[11px] font-medium text-theme-textSecondary uppercase tracking-wider">
          <div className="col-span-5 md:col-span-4 pl-2">Job Role</div>
          <div className="col-span-3 hidden md:block">ID</div>
          <div className="col-span-4 md:col-span-2 text-center">ATS Score</div>
          <div className="col-span-2 hidden md:block text-right">Date</div>
          <div className="col-span-3 md:col-span-1 text-right pr-2">Actions</div>
        </div>

        {/* List Content */}
        <div className="flex flex-col">
          {analyses.length > 0 ? analyses.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-12 gap-4 p-3 border-b border-theme-border last:border-0 hover:bg-theme-hover transition-colors duration-150 items-center group cursor-pointer"
            >
              
              <div className="col-span-5 md:col-span-4 flex items-center gap-3 pl-2">
                <div className="w-8 h-8 rounded border border-theme-border bg-theme-sidebar flex items-center justify-center shrink-0 group-hover:bg-theme-bg transition-colors">
                  <Briefcase className="w-4 h-4 text-theme-textSecondary" />
                </div>
                <h3 className="text-[13px] font-medium text-theme-text truncate">
                  {item.job_role || "Unknown Role"}
                </h3>
              </div>
              
              <div className="col-span-3 hidden md:block text-[12px] text-theme-textSecondary font-mono tracking-tight">
                #{item.id}
              </div>

              <div className="col-span-4 md:col-span-2 text-center">
                <span className={`text-[13px] font-bold ${item.ats_score > 80 ? 'text-success' : item.ats_score > 60 ? 'text-warning' : 'text-error'}`}>
                  {item.ats_score}%
                </span>
              </div>

              <div className="col-span-2 hidden md:block text-[12px] text-theme-textSecondary text-right">
                {item.date ? item.date : "—"}
              </div>

              <div className="col-span-3 md:col-span-1 text-right pr-2">
                <button className="p-1 text-theme-textSecondary hover:text-theme-text hover:bg-theme-border/50 rounded transition-colors opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 text-[13px] text-theme-textSecondary">
              No analysis data found
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default History