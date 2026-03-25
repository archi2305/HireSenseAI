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
      className="min-h-screen bg-pastel-gradient p-8 pb-16 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      
      {/* Floating Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pastelBlue/20 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-softPink/20 rounded-full blur-3xl animate-float pointer-events-none" style={{animationDelay: '3s'}}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-lavender/15 rounded-full blur-2xl animate-pulse-soft pointer-events-none" style={{animationDelay: '1.5s'}}></div>

      
      {/* Hidden inputs for file uploads */}
      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      <input type="file" ref={bulkInputRef} className="hidden" accept=".pdf,.doc,.docx" multiple onChange={handleBulkChange} />

      {/* Welcome Banner & Quick Actions */}
      <motion.div 
        variants={itemVariants} 
        className="bg-white/70 backdrop-blur-md rounded-2xl shadow-card border border-white/50 p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between relative overflow-hidden hover:shadow-hover-card transition-all duration-300 hover:scale-[1.01]"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-softPink/20 to-pastelBlue/20 rounded-full blur-3xl opacity-60 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 mb-6 lg:mb-0">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight mb-3">Welcome back, Recruiter! 👋</h1>
          <p className="text-lg text-slate-600 font-medium">Here's what is happening with your candidate pipeline today.</p>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="relative z-10 flex flex-wrap gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={handleUploadClick} 
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-400 to-purple-400 text-white font-semibold rounded-xl shadow-card hover:shadow-hover-card transition-all duration-300"
          >
            <UploadCloud size={20} className="text-white" /> Upload Resume
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={handleBulkUploadClick} 
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-mint to-pastelBlue text-white font-semibold rounded-xl shadow-card hover:shadow-hover-card transition-all duration-300"
          >
            <Copy size={20} className="text-white" /> Bulk Upload
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={handleGenerateReport} 
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-lavender to-softPink text-white font-semibold rounded-xl shadow-card hover:shadow-hover-card transition-all duration-300"
          >
            <FileBarChart size={20} className="text-white" /> Generate Report
          </motion.button>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i} 
              onClick={stat.onClick}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-card border border-white/50 hover:shadow-hover-card hover:bg-white/80 transition-all duration-300 group cursor-pointer relative overflow-hidden"
            >
              {/* Inner shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
              
              <div className="relative z-10 flex items-start justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-card group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                {loading ? (
                   <div className="w-20 h-5 bg-slate-100 animate-pulse rounded-full"></div>
                ) : (
                   <span className="text-xs font-semibold text-slate-600 bg-white/80 backdrop-blur-sm border border-slate-200 px-4 py-2 rounded-full shadow-sm">{stat.trend}</span>
                )}
              </div>
              <p className="text-base font-semibold text-slate-600 mb-2 tracking-tight">{stat.title}</p>
              {loading ? (
                  <div className="w-16 h-10 bg-slate-100 animate-pulse rounded-xl mt-2"></div>
              ) : (
                  <h3 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">{stat.value}</h3>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Analytics & Insights */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-8 mt-12">
        <div className="xl:col-span-2">
           <AnalyticsCharts />
        </div>
        <div className="xl:col-span-1 flex flex-col gap-8">
           <AIInsights />
           
           {/* Alerts Panel */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.3 }}
             className="bg-white/70 backdrop-blur-md rounded-2xl shadow-card border border-white/50 p-8 flex-1 hover:shadow-hover-card hover:bg-white/80 transition-all duration-300"
           >
             <h3 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-6 tracking-tight">Recent Alerts</h3>
             <div className="space-y-6">
               {[
                 { msg: "High match found for Backend Role", time: "10 mins ago", color: "bg-mint" },
                 { msg: "Low ATS resumes increasing", time: "1 hour ago", color: "bg-softPink" },
                 { msg: "New resume uploaded by Alice", time: "2 hours ago", color: "bg-pastelBlue" }
               ].map((alert, idx) => (
                 <motion.div 
                   whileHover={{ x: 8 }} 
                   key={idx} 
                   className="flex gap-4 items-start border-b border-slate-200/50 pb-4 last:border-0 last:pb-0 cursor-pointer group"
                 >
                   <div className={`w-3 h-3 mt-2 rounded-full ${alert.color} shadow-sm group-hover:scale-125 transition-transform duration-300`}></div>
                   <div className="flex-1">
                     <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600 transition-colors">{alert.msg}</p>
                     <p className="text-xs text-slate-500 mt-1 font-medium">{alert.time}</p>
                   </div>
                 </motion.div>
               ))}
             </div>
           </motion.div>
        </div>
      </motion.div>

      {/* Candidate Pipeline */}
      <motion.div variants={itemVariants} ref={tableRef} className="mt-12">
        <CandidateTable />
      </motion.div>

    </motion.div>
  );
}

export default Dashboard;