import React, { useRef } from "react";
import { Users, FileText, CheckCircle, TrendingUp, UploadCloud, Copy, FileBarChart } from "lucide-react";
import AnalyticsCharts from "../components/AnalyticsCharts";
import AIInsights from "../components/AIInsights";
import CandidateTable from "../components/CandidateTable";
import { useDashboard } from "../context/DashboardContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      className="space-y-6 pb-12"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      
      {/* Hidden inputs for file uploads */}
      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      <input type="file" ref={bulkInputRef} className="hidden" accept=".pdf,.doc,.docx" multiple onChange={handleBulkChange} />

      {/* Welcome Banner & Quick Actions */}
      <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-xl rounded-[24px] shadow-sm border border-white/60 p-8 flex flex-col md:flex-row items-start md:items-center justify-between relative overflow-hidden transition-all">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-softPink to-pastelBlue rounded-full blur-[80px] opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 mb-4 md:mb-0">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight mb-2">Welcome back, Recruiter! 👋</h1>
          <p className="text-slate-500 font-medium">Here's what is happening with your candidate pipeline today.</p>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="relative z-10 flex flex-wrap gap-3">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleUploadClick} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/60 text-slate-700 font-semibold rounded-xl shadow-sm hover:shadow-soft transition-all">
            <UploadCloud size={18} className="text-pastelBlue" /> Upload Resume
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleBulkUploadClick} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/60 text-slate-700 font-semibold rounded-xl shadow-sm hover:shadow-soft transition-all">
            <Copy size={18} className="text-softPink" /> Bulk Upload
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleGenerateReport} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-mint to-pastelBlue text-slate-800 font-bold rounded-xl shadow-sm hover:shadow-soft transition-all border border-mint/20">
            <FileBarChart size={18} /> Generate Report
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i} 
              onClick={stat.onClick}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/70 backdrop-blur-xl p-6 rounded-[20px] shadow-sm border border-white/60 hover:shadow-glass transition-shadow duration-300 group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-[14px] bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-slate-800" />
                </div>
                {loading ? (
                   <div className="w-16 h-4 bg-slate-100 animate-pulse rounded-md"></div>
                ) : (
                   <span className="text-xs font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">{stat.trend}</span>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-500 mb-1 tracking-tight">{stat.title}</p>
              {loading ? (
                  <div className="w-12 h-8 bg-slate-100 animate-pulse rounded-lg mt-1"></div>
              ) : (
                  <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">{stat.value}</h3>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Analytics & Insights */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
        <div className="xl:col-span-2">
           <AnalyticsCharts />
        </div>
        <div className="xl:col-span-1 flex flex-col gap-6">
           <AIInsights />
           
           {/* Alerts Panel */}
           <div className="bg-white/70 backdrop-blur-xl rounded-[20px] shadow-sm border border-white/60 p-6 flex-1 hover:shadow-soft transition-shadow duration-300">
             <h3 className="text-lg font-bold text-slate-800 mb-5 tracking-tight">Recent Alerts</h3>
             <div className="space-y-5">
               {[
                 { msg: "High match found for Backend Role", time: "10 mins ago", color: "bg-mint" },
                 { msg: "Low ATS resumes increasing", time: "1 hour ago", color: "bg-softPink" },
                 { msg: "New resume uploaded by Alice", time: "2 hours ago", color: "bg-pastelBlue" }
               ].map((alert, idx) => (
                 <motion.div whileHover={{ x: 4 }} key={idx} className="flex gap-3 items-start border-b border-slate-100/50 pb-4 last:border-0 last:pb-0 cursor-pointer">
                   <div className={`w-2.5 h-2.5 mt-1.5 rounded-full ${alert.color} shadow-sm`}></div>
                   <div>
                     <p className="text-sm font-semibold text-slate-700">{alert.msg}</p>
                     <p className="text-xs text-slate-400 mt-0.5 font-medium">{alert.time}</p>
                   </div>
                 </motion.div>
               ))}
             </div>
           </div>
        </div>
      </motion.div>

      {/* Candidate Pipeline */}
      <motion.div variants={itemVariants} ref={tableRef}>
        <CandidateTable />
      </motion.div>

    </motion.div>
  );
}

export default Dashboard;