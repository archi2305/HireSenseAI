import React, { useRef } from "react";
import { Users, FileText, CheckCircle, TrendingUp, UploadCloud, Copy, FileBarChart } from "lucide-react";
import AnalyticsCharts from "../components/AnalyticsCharts";
import AIInsights from "../components/AIInsights";
import CandidateTable from "../components/CandidateTable";
import { useDashboard } from "../context/DashboardContext";
import toast from "react-hot-toast";

function Dashboard() {
  const { 
    analytics, 
    loading, 
    uploadResume, 
    bulkUploadResumes,
    setMinScoreFilter,
    setRoleFilter
  } = useDashboard();

  const fileInputRef = useRef(null);
  const bulkInputRef = useRef(null);
  const tableRef = useRef(null);

  const handleUploadClick = () => fileInputRef.current.click();
  const handleBulkUploadClick = () => bulkInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const role = prompt("Enter the Job Role for this candidate (or leave blank for generic comparison):", "");
      if (role !== null) {
        await uploadResume(file, role);
      }
      e.target.value = ""; // Reset
    }
  };

  const handleBulkChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const role = prompt("Enter a Job Role for this batch of resumes (or leave blank for generic comparison):", "");
      if (role !== null) {
        await bulkUploadResumes(files, role);
      }
      e.target.value = ""; // Reset
    }
  };

  const handleGenerateReport = () => {
    // Simulated report generation
    const toastId = toast.loading("Generating analytics report...");
    setTimeout(() => {
      toast.success("Report downloaded successfully!", { id: toastId });
    }, 1500);
  };

  // Card click handlers
  const scrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const statCards = [
    { 
      title: "Total Resumes", 
      value: analytics ? analytics.total_resumes : 0, 
      icon: FileText, 
      color: "from-mint to-emerald-300", 
      trend: "All candidates",
      onClick: () => {
        setMinScoreFilter("");
        setRoleFilter("");
        scrollToTable();
      }
    },
    { 
      title: "Average ATS Score", 
      value: analytics ? `${analytics.avg_score}%` : "0%", 
      icon: TrendingUp, 
      color: "from-softPink to-pink-300", 
      trend: "Overall pipeline health",
      onClick: () => {}
    },
    { 
      title: "Top Job Role", 
      value: "Software Engineer", // This could be strictly fetched if backend provided it
      icon: Users, 
      color: "from-pastelBlue to-blue-300", 
      trend: "Filter by top role",
      onClick: () => {
        setRoleFilter("Software Engineer");
        scrollToTable();
      }
    },
    { 
      title: "High Matches", 
      value: analytics ? analytics.recent_matches : 0, 
      icon: CheckCircle, 
      color: "from-lavender to-purple-300", 
      trend: "Scores over 80%",
      onClick: () => {
        setMinScoreFilter("80");
        scrollToTable();
      }
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Hidden inputs for file uploads */}
      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      <input type="file" ref={bulkInputRef} className="hidden" accept=".pdf,.doc,.docx" multiple onChange={handleBulkChange} />

      {/* Welcome Banner & Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden transition-all">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-softPink to-pastelBlue rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 mb-4 md:mb-0">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome back, Recruiter! 👋</h1>
          <p className="text-slate-500">Here's what is happening with your candidate pipeline today.</p>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="relative z-10 flex flex-wrap gap-3">
          <button onClick={handleUploadClick} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl shadow-sm hover:shadow hover:bg-slate-50 transition-all hover:-translate-y-0.5 active:scale-95">
            <UploadCloud size={18} className="text-pastelBlue" /> Upload Resume
          </button>
          <button onClick={handleBulkUploadClick} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl shadow-sm hover:shadow hover:bg-slate-50 transition-all hover:-translate-y-0.5 active:scale-95">
            <Copy size={18} className="text-softPink" /> Bulk Upload
          </button>
          <button onClick={handleGenerateReport} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-mint to-emerald-400 text-emerald-900 font-semibold rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:scale-95">
            <FileBarChart size={18} /> Generate Report
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              onClick={stat.onClick}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 group cursor-pointer hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-slate-800" />
                </div>
                {loading ? (
                   <div className="w-16 h-4 bg-slate-100 animate-pulse rounded"></div>
                ) : (
                   <span className="text-xs font-medium text-slate-600 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-full">{stat.trend}</span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">{stat.title}</p>
              {loading ? (
                  <div className="w-12 h-8 bg-slate-100 animate-pulse rounded mt-1"></div>
              ) : (
                  <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
              )}
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
      <div ref={tableRef}>
        <CandidateTable />
      </div>

    </div>
  );
}

export default Dashboard;