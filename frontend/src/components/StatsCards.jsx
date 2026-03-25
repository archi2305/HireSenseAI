import { useEffect, useState } from "react"
import axios from "axios"
import { TrendingUp, FileCheck, Zap, CheckCircle, ArrowUpRight, ArrowDownRight } from "lucide-react"
import CountUp from "./CountUp"
import { motion } from "framer-motion"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function StatsCards() {
  const [stats, setStats] = useState({
    total_resumes: 0,
    avg_score: 0,
    total_analyses: 0,
    active_jobs: 12
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
      title: "Processed Files",
      value: stats.total_resumes ?? 0,
      change: "+12.5%",
      isPositive: true,
      icon: FileCheck,
      color: "text-theme-accent",
      glow: "bg-theme-accent/20"
    },
    {
      title: "Average Match",
      value: `${stats.avg_score ?? 0}%`,
      change: "-2.1%",
      isPositive: false,
      icon: TrendingUp,
      color: "text-success",
      glow: "bg-success/20"
    },
    {
      title: "System Throughput",
      value: stats.total_analyses ?? 0,
      change: "+5.1%",
      isPositive: true,
      icon: Zap,
      color: "text-warning",
      glow: "bg-warning/20"
    },
    {
      title: "Active Pipelines",
      value: stats.active_jobs,
      change: "Stable",
      isPositive: true,
      icon: CheckCircle,
      color: "text-blue-500",
      glow: "bg-blue-500/20"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, idx) => {
        const Icon = item.icon
        return (
          <motion.div
            key={idx}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group p-6 rounded-2xl bg-theme-surface border border-theme-border hover:border-theme-accent/30 transition-all duration-300 floating-layer cursor-default relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className={`absolute top-0 right-0 w-24 h-24 blur-[40px] rounded-full -mr-12 -mt-12 transition-opacity duration-500 opacity-20 group-hover:opacity-40 ${item.glow}`} />

            <div className="flex items-center justify-between mb-4 relative z-10">
               <div className={`p-2.5 rounded-xl bg-theme-bg border border-theme-border ${item.color} group-hover:shadow-accent-glow transition-all duration-300`}>
                 <Icon size={16} />
               </div>
               <div className={`flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-full border bg-theme-bg/50 ${item.isPositive ? 'text-success border-success/20' : 'text-error border-error/20'}`}>
                 {item.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                 {item.change}
               </div>
            </div>
            
            <p className="text-[13px] font-bold text-theme-textSecondary mb-1 relative z-10 opacity-70">
              {item.title}
            </p>
            <h2 className="text-[28px] font-black text-theme-text tracking-tighter relative z-10">
              {loading ? (
                <span className="skeleton w-20 h-8 inline-block" />
              ) : (
                <CountUp value={item.value} />
              )}
            </h2>
          </motion.div>
        )
      })}
    </div>
  )
}

export default StatsCards
