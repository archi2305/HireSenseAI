import { useEffect, useState } from "react"
import axios from "axios"
import { Eye } from "lucide-react"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function RecentAnalyses({ searchQuery = "" }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/analyses`)
        setItems(res.data || [])
      } catch (err) {
        console.error("Failed to load recent analyses", err)
        setError("Failed to load")
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchAnalyses()
  }, [])

  const query = (searchQuery || "").toLowerCase()

  const filteredData = items.filter((item) => {
    const resume = (item.resume_name || "").toLowerCase()
    const role = (item.job_role || "").toLowerCase()
    return resume.includes(query) || role.includes(query)
  })

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-amber-600 bg-amber-100"
    return "text-red-600 bg-red-100"
  }

  return (
    <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100/50">
      <h2 className="text-lg font-bold text-slate-900 mb-6">
        Recent Resume Analyses
      </h2>

      {loading && (
        <p className="text-slate-500 text-sm py-8 text-center">Loading analyses...</p>
      )}

      {error && !loading && (
        <p className="text-red-500 text-sm py-8 text-center">{error}</p>
      )}

      {!loading && !error && filteredData.length === 0 && (
        <p className="text-slate-500 text-sm py-8 text-center">
          No analyses found.
        </p>
      )}

      {!loading && !error && filteredData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Resume
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Role
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
              {filteredData.map((item) => (
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
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(
                        item.ats_score
                      )}`}
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
                    <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-softPink to-lavender text-white text-sm font-medium hover:shadow-md transition-all hover:scale-105">
                      <Eye className="w-4 h-4" />
                      View
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

export default RecentAnalyses
