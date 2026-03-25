import React, { useEffect, useState } from "react"
import axios from "axios"
import { Users, FileDiff, Zap, ArrowUpRight, Clock, Plus, Target, CheckCircle2 } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { useDashboard } from "../context/DashboardContext"
import { motion } from "framer-motion"
import AnalyticsCharts from "../components/AnalyticsCharts"
import { useNavigate } from "react-router-dom"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function Dashboard() {
  const { user } = useAuth()
  const { updateCounter } = useDashboard()
  const navigate = useNavigate()
  
  const [stats, setStats] = useState({
    total_candidates: 0,
    pipelines_active: 0,
    high_match_alerts: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [updateCounter])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE_URL}/candidates`)
      
      const candidates = Array.isArray(res.data) ? res.data : []
      setStats({
        total_candidates: candidates.length,
        pipelines_active: [...new Set(candidates.map(c => c.role))].length || 3,
        high_match_alerts: candidates.filter(c => c.match_percentage >= 80).length || 0
      })

      // Generate realistic activity
      setRecentActivity([
        { id: 1, action: "Parsed Resume", target: "Archi Snehi", time: "10 min ago", icon: FileDiff },
        { id: 2, action: "High Match Found", target: "Backend Developer Pipeline", time: "1 hr ago", icon: Target, isAlert: true },
        { id: 3, action: "Pipeline Created", target: "Data Scientist", time: "3 hrs ago", icon: Zap },
        { id: 4, action: "Parsed Resume", target: "Jane Doe", time: "5 hrs ago", icon: FileDiff }
      ])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: "Total Candidates", value: stats.total_candidates, icon: Users, trend: "+12%" },
    { label: "Active Pipelines", value: stats.pipelines_active, icon: FileDiff, trend: "Stable" },
    { label: "High Matches (80%+)", value: stats.high_match_alerts, icon: Zap, trend: "+2", highlight: true }
  ]

  return (
    <div className="flex flex-col h-full w-full max-w-[1400px] mx-auto gap-6 animate-fade-in relative z-10">
      
      {/* 1. Header Area with Quick Actions */}
      <div className="flex items-end justify-between border-b border-theme-border pb-4 shrink-0">
        <div>
          <h1 className="text-xl font-semibold text-theme-text tracking-tight flex items-center gap-2">
            Issues / Overview
          </h1>
          <p className="text-[13px] text-theme-textSecondary mt-1">Manage pipelines, statistics, and recent activity.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/analyzer')} className="flex items-center gap-1.5 px-3 py-1.5 bg-theme-sidebar border border-theme-border text-theme-text text-[13px] font-medium rounded-md hover:bg-theme-hover transition-colors shadow-sm">
            <Plus size={14} /> New Analysis
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-theme-accent text-white text-[13px] font-medium rounded-md hover:bg-theme-accentHover transition-colors shadow-glow">
            Generate Report
          </button>
        </div>
      </div>

      {/* 2. Split Layout: Main Content (Left) & Activity Panel (Right) */}
      <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
        
        {/* LEFT MAIN AREA */}
        <div className="flex-1 flex flex-col gap-6 min-h-0 overflow-y-auto pr-1 custom-scrollbar">
          
          {/* Top Stat Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
            {statCards.map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-theme-bg border border-theme-border rounded-lg p-4 flex flex-col relative overflow-hidden group hover:bg-[#1f1f23] transition-colors duration-200 cursor-default"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-1.5 rounded-md bg-theme-sidebar border border-theme-border ${stat.highlight ? 'text-theme-accent' : 'text-theme-textSecondary'}`}>
                    <stat.icon size={16} />
                  </div>
                  <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded border ${
                    stat.trend.includes('+') ? 'text-success bg-success/10 border-success/20' : 'text-theme-textSecondary bg-theme-sidebar border-theme-border'
                  }`}>
                    {stat.trend}
                  </span>
                </div>
                <div>
                  <h4 className="text-[28px] font-bold text-theme-text leading-none">{loading ? "-" : stat.value}</h4>
                  <p className="text-[13px] text-theme-textSecondary mt-1 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Area */}
          <div className="shrink-0">
            <AnalyticsCharts />
          </div>

          {/* Inline Table Snippet */}
          <div className="flex-1 flex flex-col min-h-[300px] border border-theme-border rounded-lg bg-theme-bg overflow-hidden mt-2 shrink-0">
            <div className="p-3 border-b border-theme-border bg-theme-sidebar/50 flex items-center justify-between">
              <h3 className="text-[13px] font-medium text-theme-text flex items-center gap-2 px-1">
                <CheckCircle2 size={14} className="text-theme-textSecondary" /> Pipeline Status
              </h3>
              <button className="text-[11px] text-theme-textSecondary hover:text-theme-text transition-colors">View All &rarr;</button>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-8">
               <div className="text-center">
                 <Target className="w-8 h-8 text-theme-textSecondary mx-auto mb-3 opacity-30" />
                 <p className="text-[13px] text-theme-text font-medium">Head over to Candidate Match</p>
                 <p className="text-[12px] text-theme-textSecondary mt-1">To view full table functionality.</p>
               </div>
            </div>
          </div>
          
        </div>

        {/* RIGHT ACTIVITY PANEL */}
        <div className="w-full xl:w-80 shrink-0 flex flex-col h-full min-h-[400px]">
          <div className="bg-theme-bg border border-theme-border rounded-lg flex flex-col h-full overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            
            <div className="p-3 border-b border-theme-border bg-theme-sidebar/50 pl-4">
              <h3 className="text-[13px] font-medium text-theme-text flex items-center gap-2">
                <Clock size={14} className="text-theme-textSecondary" /> Activity Logger
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-1">
              {recentActivity.map((activity, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (idx * 0.1) }}
                  key={activity.id} 
                  className="flex items-start gap-3 p-3 rounded-md hover:bg-theme-hover transition-colors group cursor-pointer"
                >
                  <div className="shrink-0 pt-0.5">
                    <div className={`w-6 h-6 rounded flex items-center justify-center border ${
                      activity.isAlert 
                        ? 'bg-warning/10 border-warning/30 text-warning group-hover:scale-110' 
                        : 'bg-theme-sidebar border-theme-border text-theme-textSecondary group-hover:text-theme-text group-hover:bg-[#2a2a2a]'
                    } transition-all duration-200`}>
                      <activity.icon size={12} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-theme-text font-medium leading-snug">
                      {activity.action}
                    </p>
                    <p className="text-[12px] text-theme-textSecondary truncate mt-0.5">
                      {activity.target}
                    </p>
                  </div>
                  <div className="shrink-0 text-[10px] text-theme-textSecondary font-medium">
                    {activity.time}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-3 border-t border-theme-border bg-theme-sidebar/30">
              <div className="bg-gradient-to-br from-theme-sidebar to-[#18181b] border border-theme-border p-3 rounded-md shadow-inner text-center">
                <p className="text-[11px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-theme-accent to-purple-400 uppercase tracking-widest mb-1">AI Insights</p>
                <p className="text-[12px] text-theme-textSecondary leading-relaxed">
                  Your pipeline health is strong. Backend Developer matches are up 23% this week.
                </p>
              </div>
            </div>

          </div>
        </div>
        
      </div>
    </div>
  )
}