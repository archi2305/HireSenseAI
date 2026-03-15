import { useEffect, useState } from "react"
import axios from "axios"
import { Users, FileText, CheckCircle, TrendingUp } from "lucide-react"

const API_BASE_URL = "http://127.0.0.1:8001"

function Dashboard() {
  const [stats, setStats] = useState({
    totalResumes: 0,
    avgScore: 0,
    topRole: "-",
    recentMatches: 0
  })

  // Simulated fetch of stats or recent activity. In a real app we'd compute this from the actual analyses.
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/analyses`)
        const data = res.data || []
        
        let totalResumes = data.length
        let totalScore = data.reduce((acc, curr) => acc + (curr.ats_score || 0), 0)
        let avgScore = totalResumes > 0 ? Math.round(totalScore / totalResumes) : 0
        
        setStats({
          totalResumes,
          avgScore,
          topRole: "Software Engineer", // Mocked or calculated
          recentMatches: Math.min(data.length, 5)
        })
      } catch (error) {
        console.error("Failed to load analyses", error)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Resumes parsed",
      value: stats.totalResumes,
      icon: FileText,
      color: "from-mint to-pastelBlue",
      trend: "+12% this week"
    },
    {
      title: "Average ATS Score",
      value: `${stats.avgScore}%`,
      icon: TrendingUp,
      color: "from-softPink to-lavender",
      trend: "+5% vs last month"
    },
    {
      title: "Top Job Role",
      value: stats.topRole,
      icon: Users,
      color: "from-pastelBlue to-lavender",
      trend: "Based on frequency"
    },
    {
      title: "Recent High Matches",
      value: stats.recentMatches,
      icon: CheckCircle,
      color: "from-mint to-softPink",
      trend: "Scores over 80%"
    }
  ]

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100 flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-softPink to-pastelBlue rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome back, Recruiter! 👋</h1>
          <p className="text-slate-500">Here's what is happening with your candidate pipeline today.</p>
        </div>
        <button className="relative z-10 px-6 py-2.5 bg-gradient-to-r from-mint to-pastelBlue text-slate-800 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5">
          New Analysis
        </button>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm`}>
                  <Icon className="w-5 h-5 text-slate-800" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{stat.trend}</span>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          )
        })}
      </div>

      {/* Activity Overview (Mock Section) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Analysis Pipeline</h3>
          <div className="h-64 flex items-center justify-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-sm">Chart data visualization goes here...</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Alerts</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="flex gap-3 items-start border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                <div className="w-2 h-2 mt-2 rounded-full bg-softPink"></div>
                <div>
                  <p className="text-sm font-medium text-slate-700">High match found for Software Engineer</p>
                  <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Dashboard