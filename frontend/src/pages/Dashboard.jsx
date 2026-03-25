import React, { useRef } from "react";
import { Users, FileText, CheckCircle, TrendingUp, UploadCloud, Copy, FileBarChart } from "lucide-react";
import AnalyticsCharts from "../components/AnalyticsCharts";
import AIInsights from "../components/AIInsights";
import CandidateTable from "../components/CandidateTable";
import { useDashboard } from "../context/DashboardContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import Tooltip from "../components/Tooltip";

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
    // Success animation with toast
    const toastId = toast.loading("Generating analytics report...");
    
    setTimeout(() => {
      toast.success(
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <FileBarChart className="w-4 h-4" />
          <span>Report downloaded successfully!</span>
        </motion.div>,
        { 
          id: toastId,
          icon: "🎉",
          style: {
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            color: 'white',
          }
        }
      );
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

  // Linear-inspired animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        mass: 0.8
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 20
      }
    },
    hover: {
      scale: 1.02,
      y: -4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 600,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-pastel-gradient p-8 pb-16 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Floating Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pastel-blue/20 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pastel-pink/20 rounded-full blur-3xl animate-float pointer-events-none" style={{animationDelay: '3s'}}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pastel-purple/15 rounded-full blur-2xl animate-pulse-soft pointer-events-none" style={{animationDelay: '1.5s'}}></div>

      {/* Hidden inputs for file uploads */}
      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      <input type="file" ref={bulkInputRef} className="hidden" accept=".pdf,.doc,.docx" multiple onChange={handleBulkChange} />

      {/* Welcome Banner & Quick Actions */}
      <motion.div 
        variants={itemVariants}
        className="bg-white/70 backdrop-blur-md rounded-2xl shadow-card border border-white/50 p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between relative overflow-hidden"
        whileHover="hover"
        whileTap="tap"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-pastel-pink/20 to-pastel-blue/20 rounded-full blur-3xl opacity-60 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 mb-6 lg:mb-0">
          <motion.h1 
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-indigo to-brand-purple tracking-tight mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Welcome back, Recruiter! 👋
          </motion.h1>
          <motion.p 
            className="text-lg text-slate-600 font-medium"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Here's what is happening with your candidate pipeline today.
          </motion.p>
        </div>
        
        {/* Quick Action Buttons */}
        <motion.div 
          className="relative z-10 flex flex-wrap gap-4"
          variants={itemVariants}
        >
          <Tooltip content="Upload a single resume for analysis">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={handleUploadClick} 
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-brand-indigo to-brand-purple text-white font-semibold rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <UploadCloud size={20} className="text-white" /> 
              Upload Resume
            </motion.button>
          </Tooltip>
          
          <Tooltip content="Upload multiple resumes at once">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={handleBulkUploadClick} 
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <Copy size={20} className="text-white" /> 
              Bulk Upload
            </motion.button>
          </Tooltip>
          
          <Tooltip content="Generate comprehensive analytics report">
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={handleGenerateReport} 
              className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-success to-info text-white font-semibold rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <FileBarChart size={20} className="text-white" /> 
              Generate Report
            </motion.button>
          </Tooltip>
        </motion.div>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
        {loading ? (
          // Loading skeletons for stats
          [...Array(4)].map((_, i) => (
            <LoadingSkeleton key={i} variant="card" className="h-32" />
          ))
        ) : (
          statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={i} 
                variants={cardVariants}
                onClick={stat.onClick}
                className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-card border border-white/50 hover:shadow-card-hover hover:bg-white/80 transition-all duration-300 group cursor-pointer relative overflow-hidden"
                whileHover="hover"
                whileTap="tap"
              >
                {/* Inner shine effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <div className="relative z-10 flex items-start justify-between mb-6">
                  <motion.div 
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-card`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <span className="text-xs font-semibold text-slate-600 bg-white/80 backdrop-blur-sm border border-slate-200 px-4 py-2 rounded-full shadow-sm">
                    {stat.trend}
                  </span>
                </div>
                <p className="text-base font-semibold text-slate-600 mb-2 tracking-tight">{stat.title}</p>
                <motion.h3 
                  className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-indigo to-brand-purple tracking-tight"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  {stat.value}
                </motion.h3>
              </motion.div>
            );
          })
        )}
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
             variants={cardVariants}
             className="bg-white/70 backdrop-blur-md rounded-2xl shadow-card border border-white/50 p-8 flex-1 hover:shadow-card-hover hover:bg-white/80 transition-all duration-300"
             whileHover="hover"
           >
             <motion.h3 
               className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-indigo to-brand-purple mb-6 tracking-tight"
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
             >
               Recent Alerts
             </motion.h3>
             <div className="space-y-6">
               {[
                 { msg: "High match found for Backend Role", time: "10 mins ago", color: "bg-success" },
                 { msg: "Low ATS resumes increasing", time: "1 hour ago", color: "bg-warning" },
                 { msg: "New resume uploaded by Alice", time: "2 hours ago", color: "bg-brand-indigo" }
               ].map((alert, idx) => (
                 <motion.div 
                   key={idx}
                   variants={{
                     hidden: { opacity: 0, x: -20 },
                     show: { opacity: 1, x: 0 }
                   }}
                   whileHover={{ x: 8 }}
                   className="flex gap-4 items-start border-b border-slate-200/50 pb-4 last:border-0 last:pb-0 cursor-pointer group"
                 >
                   <motion.div 
                     className={`w-3 h-3 mt-2 rounded-full ${alert.color} shadow-sm`}
                     whileHover={{ scale: 1.25 }}
                     transition={{ type: "spring", stiffness: 400, damping: 15 }}
                   />
                   <div className="flex-1">
                     <p className="text-sm font-semibold text-slate-700 group-hover:text-brand-indigo transition-colors">{alert.msg}</p>
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
        {!loading && candidates?.length === 0 ? (
          <EmptyState 
            type="candidates"
            action={
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUploadClick}
                className="px-6 py-3 bg-gradient-to-r from-brand-indigo to-brand-purple text-white font-semibold rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                Upload Your First Resume
              </motion.button>
            }
          />
        ) : (
          <CandidateTable />
        )}
      </motion.div>

    </motion.div>
  );
}

export default Dashboard;