import { useEffect, useState } from "react"
import axios from "axios"
import { TrendingUp, FileCheck, Zap, CheckCircle, ArrowUpRight, ArrowDownRight } from "lucide-react"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function StatsCards() {
  const [stats, setStats] = useState({
    total_resumes: 0,
    avg_score: 0,
    total_analyses: 0,
    active_jobs: 12 // Mocked for density
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/dashboard`)
        setStats(prev => ({ ...prev, ...res.data }))
      } catch (err) {
        console.error("Failed to load dashboard stats", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statItems = [
    {
      title: "Total Resumes",
      value: stats.total_resumes ?? 0,
      change: "+12.5%",
      isPositive: true,
      icon: FileCheck,
      color: "text-theme-accent"
    },
    {
      title: "Average Match",
      value: `${stats.avg_score ?? 0}%`,
      change: "-2.1%",
      isPositive: false,
      icon: TrendingUp,
      color: "text-success"
    },
    {
      title: "Total Analyses",
      value: stats.total_analyses ?? 0,
      change: "+5.1%",
      isPositive: true,
      icon: Zap,
      color: "text-warning"
    },
    {
      title: "Active Pipelines",
      value: stats.active_jobs,
      change: "Stable",
      isPositive: true,
      icon: CheckCircle,
      color: "text-theme-textSecondary"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, idx) => {
        const Icon = item.icon
        return (
          <div
            key={idx}
            className="group p-4 rounded-md bg-theme-surface border border-theme-border hover:border-theme-textSecondary/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
               <div className={`p-1.5 rounded bg-theme-bg border border-theme-border ${item.color}`}>
                 <Icon size={14} />
               </div>
               <div className={`flex items-center gap-0.5 text-[10px] font-bold ${item.isPositive ? 'text-success' : 'text-error'}`}>
                 {item.isPositive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                 {item.change}
               </div>
            </div>
            
            <p className="text-[12px] font-medium text-theme-textSecondary mb-1">
              {item.title}
            </p>
            <h2 className="text-[22px] font-bold text-theme-text tracking-tight">
              {loading ? <span className="skeleton w-16 h-7 inline-block" /> : item.value}
            </h2>
          </div>
        )
      })}
    </div>
  )
}

export default StatsCards
