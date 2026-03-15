import { useEffect, useState } from "react"
import axios from "axios"
import { TrendingUp, FileCheck, Zap, CheckCircle } from "lucide-react"

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

  const statCards = [
    {
      title: "Total Resumes",
      value: loading ? "..." : safeStats.total_resumes ?? 0,
      icon: FileCheck,
      onClick: () => handleNavigate("resumes"),
      gradient: "from-softPink to-lavender"
    },
    {
      title: "Avg ATS Score",
      value: loading ? "..." : `${safeStats.avg_score ?? 0}%`,
      icon: TrendingUp,
      onClick: () => handleNavigate("analytics"),
      gradient: "from-pastelBlue to-mint"
    },
    {
      title: "Total Analyses",
      value: loading ? "..." : safeStats.total_analyses ?? 0,
      icon: Zap,
      onClick: () => handleNavigate("history"),
      gradient: "from-lavender to-pastelBlue"
    },
    {
      title: "System Status",
      value: loading ? "..." : "Online",
      icon: CheckCircle,
      onClick: () => {},
      gradient: "from-mint to-softPink"
    }
  ]

  return (
    <div className="grid grid-cols-4 gap-6">
      {statCards.map((card, idx) => {
        const Icon = card.icon
        return (
          <button
            key={idx}
            onClick={card.onClick}
            className="group bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 text-left border border-slate-100/50"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-slate-600 text-sm font-medium">
              {card.title}
            </p>
            <h2 className="text-3xl font-bold text-slate-900 mt-2">
              {card.value}
            </h2>
          </button>
        )
      })}
    </div>
  )
}

export default StatsCards
