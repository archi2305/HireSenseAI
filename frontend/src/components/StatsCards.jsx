import { useEffect, useState } from "react"
import axios from "axios"

const API_BASE_URL = "http://127.0.0.1:8001"

function StatsCards({ setPage }) {
  const [stats, setStats] = useState({
    total_resumes: 0,
    avg_score: 0,
    total_analyses: 0,
    system_status: "Loading..."
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/dashboard`)
        setStats(res.data)
      } catch (err) {
        console.error("Failed to load dashboard stats", err)
        setError("Failed to load")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const safeStats = stats || {}

  const handleNavigate = (target) => {
    if (typeof setPage === "function") {
      setPage(target)
    }
  }

  return (
    <div className="grid grid-cols-4 gap-6">

      <button
        type="button"
        onClick={() => handleNavigate("resumes")}
        className="bg-white p-6 rounded-xl shadow text-left hover:shadow-md transition"
      >
        <p className="text-gray-500">Total Resumes</p>
        <h2 className="text-2xl font-bold">
          {loading ? "Loading..." : safeStats.total_resumes ?? 0}
        </h2>
      </button>

      <button
        type="button"
        onClick={() => handleNavigate("analytics")}
        className="bg-white p-6 rounded-xl shadow text-left hover:shadow-md transition"
      >
        <p className="text-gray-500">Avg ATS Score</p>
        <h2 className="text-2xl font-bold">
          {loading ? "Loading..." : safeStats.avg_score ?? 0}
        </h2>
      </button>

      <button
        type="button"
        onClick={() => handleNavigate("history")}
        className="bg-white p-6 rounded-xl shadow text-left hover:shadow-md transition"
      >
        <p className="text-gray-500">Total Analyses</p>
        <h2 className="text-2xl font-bold">
          {loading ? "Loading..." : safeStats.total_analyses ?? 0}
        </h2>
      </button>

      <div className="bg-white p-6 rounded-xl shadow">
        <p className="text-gray-500">System Status</p>
        <h2 className="text-green-500 font-bold">
          {loading ? "Checking..." : error || safeStats.system_status}
        </h2>
      </div>

    </div>
  )
}

export default StatsCards