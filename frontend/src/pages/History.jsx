import { useEffect, useState } from "react"
import axios from "axios"
import { Calendar, Award, Briefcase } from "lucide-react"

function History() {
  const [analyses, setAnalyses] = useState([])

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/analysis") // Mocked API
      setAnalyses(response.data)
    } catch (error) {
      console.error(error)
      // Mock data for display purposes
      setAnalyses([
        { id: "10123", ats_score: 85, job_role: "Software Engineer", date: "2026-03-15" },
        { id: "10124", ats_score: 92, job_role: "Frontend Developer", date: "2026-03-14" },
      ])
    }
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Analysis History</h1>

      <div className="grid grid-cols-1 gap-4">
        {analyses.length > 0 ? analyses.map((item) => (
          <div
            key={item.id}
            className="bg-white p-6 rounded-xl shadow-md border border-slate-100 flex items-center justify-between hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mint to-pastelBlue flex items-center justify-center shadow-sm">
                <Briefcase className="w-5 h-5 text-slate-800" />
              </div>
              
              <div>
                <h3 className="font-bold text-slate-800 text-lg">
                  {item.job_role || "Unknown Role"}
                </h3>
                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-4 font-semibold text-slate-400">ID:</span> {item.id}
                  </span>
                  {item.date && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col text-right">
                <span className="text-xs text-slate-500 font-medium">ATS Score</span>
                <span className={`text-xl font-bold ${item.ats_score > 80 ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {item.ats_score}%
                </span>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.ats_score > 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                <Award className="w-5 h-5" />
              </div>
            </div>
          </div>
        )) : (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500">No analysis done yet</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default History