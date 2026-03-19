import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, FileText, CheckCircle, TrendingUp, UploadCloud, Copy, FileBarChart } from "lucide-react";
import AnalyticsCharts from "../components/AnalyticsCharts";
import AIInsights from "../components/AIInsights";
import CandidateTable from "../components/CandidateTable";

const API_BASE_URL = "http://127.0.0.1:8000";

function Dashboard() {
  const [stats, setStats] = useState({
    totalResumes: 0,
    avgScore: 0,
    recentMatches: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/analytics/overview`);
        setStats({
          totalResumes: res.data.total_resumes,
          avgScore: res.data.avg_score,
          recentMatches: res.data.recent_matches
        });
      } catch (error) {
        console.error("Failed to load overview", error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Resumes", value: stats.totalResumes, icon: FileText, color: "from-mint to-pastelBlue", trend: "+12% this week" },
    { title: "Average ATS Score", value: `${stats.avgScore}%`, icon: TrendingUp, color: "from-softPink to-lavender", trend: "+5% vs last month" },
    { title: "Top Job Role", value: "Software Engineer", icon: Users, color: "from-pastelBlue to-lavender", trend: "Based on frequency" },
    { title: "Recent High Matches", value: stats.recentMatches, icon: CheckCircle, color: "from-mint to-softPink", trend: "Scores over 80%" }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner & Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-softPink to-pastelBlue rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome back, Recruiter! 👋</h1>
          <p className="text-slate-500">Here's what is happening with your candidate pipeline today.</p>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="relative z-10 flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl shadow-sm hover:shadow hover:bg-slate-50 transition-all hover:-translate-y-0.5">
            <UploadCloud size={18} className="text-pastelBlue" /> Upload Resume
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl shadow-sm hover:shadow hover:bg-slate-50 transition-all hover:-translate-y-0.5">
            <Copy size={18} className="text-softPink" /> Bulk Upload
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-mint to-pastelBlue text-slate-800 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
            <FileBarChart size={18} /> Generate Report
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-slate-800" />
                </div>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">{stat.trend}</span>
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          );
        })}
      </div>

      {/* Analytics & Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2">
           <AnalyticsCharts />
        </div>
        <div className="xl:col-span-1 flex flex-col gap-6">
           <AIInsights />
           
           {/* Alerts Panel */}
           <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex-1 hover:shadow-md transition-shadow duration-300">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Alerts</h3>
             <div className="space-y-4">
               {[
                 { msg: "High match found for Backend Role", time: "10 mins ago", color: "bg-emerald-400" },
                 { msg: "Low ATS resumes increasing", time: "1 hour ago", color: "bg-rose-400" },
                 { msg: "New resume uploaded by Alice", time: "2 hours ago", color: "bg-pastelBlue" }
               ].map((alert, idx) => (
                 <div key={idx} className="flex gap-3 items-start border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                   <div className={`w-2 h-2 mt-2 rounded-full ${alert.color}`}></div>
                   <div>
                     <p className="text-sm font-medium text-slate-700">{alert.msg}</p>
                     <p className="text-xs text-slate-400 mt-1">{alert.time}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      </div>

      {/* Candidate Pipeline */}
      <CandidateTable />

    </div>
  );
}

export default Dashboard;