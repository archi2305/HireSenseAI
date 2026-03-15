import { useEffect, useState } from "react"
import axios from "axios"
import { History as HistoryIcon, Trash2 } from "lucide-react"

const API_BASE_URL = "http://127.0.0.1:8001"

function History({ searchQuery = "" }) {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/analyses`)
        setAnalyses(response.data || [])
      } catch (err) {
        console.error("Failed to load history", err)
        setError("Failed to load")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const query = (searchQuery || "").toLowerCase()
  const filtered = analyses.filter((item) => {
    const resume = (item.resume_name || "").toLowerCase()
    const role = (item.job_role || "").toLowerCase()
    return resume.includes(query) || role.includes(query)
  })

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-amber-100"
    return "bg-red-100"
  }

  const getScoreTextColor = (score) => {
    if (score >= 80) return "text-green-700"
    if (score >= 60) return "text-amber-700"
    return "text-red-700"
  }

  return (
    <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-md border border-slate-100/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-softPink to-lavender flex items-center justify-center">
          <HistoryIcon size={20} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Resume Analysis History
        </h2>
      </div>

      {loading && (
        <p className="text-slate-500 text-sm py-8 text-center">Loading history...</p>
      )}

      {error && !loading && (
        <p className="text-red-500 text-sm py-8 text-center">{error}</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-slate-500 text-sm py-8 text-center">
          No analysis history found.
        </p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Resume
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Job Role
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  ATS Score
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <p className="font-medium text-slate-900 text-sm">
                      {item.resume_name}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-slate-600 text-sm">
                      {item.job_role}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(
                        item.ats_score
                      )} ${getScoreTextColor(item.ats_score)}`}
                    >
                      {item.ats_score}%
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-slate-500 text-sm">
                      {item.date &&
                        new Date(item.date).toLocaleDateString()}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <button className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default History
