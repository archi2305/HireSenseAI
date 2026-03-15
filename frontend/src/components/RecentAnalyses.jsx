import { useEffect, useState } from "react"
import axios from "axios"

const API_BASE_URL = "http://127.0.0.1:8001"

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

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-lg font-semibold mb-4">
        Recent Resume Analyses
      </h2>

      {loading && (
        <p className="text-gray-500 text-sm">Loading...</p>
      )}

      {error && !loading && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {!loading && !error && filteredData.length === 0 && (
        <p className="text-gray-500 text-sm">
          No analyses found.
        </p>
      )}

      <div className="space-y-3">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center border-b last:border-b-0 pb-2"
          >
            <div>
              <p className="font-medium">
                {item.resume_name}
              </p>
              <p className="text-xs text-gray-500">
                {item.job_role}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-indigo-600">
                {item.ats_score}%
              </p>
              <p className="text-xs text-gray-500">
                {item.date && new Date(item.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentAnalyses