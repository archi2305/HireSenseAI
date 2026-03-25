import React from "react"
import { motion } from "framer-motion"
import StatsCards from "../components/StatsCards"
import AnalyticsCharts from "../components/AnalyticsCharts"
import CandidateTable from "../components/CandidateTable"
import ActivityFeed from "../components/ActivityFeed"
import SectionReveal from "../components/SectionReveal"
import { Sparkles, ArrowRight, Zap, Target } from "lucide-react"

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <div className="p-8 max-w-[1600px] mx-auto w-full space-y-12 min-h-full font-sans">
      
      {/* Premium Hero Banner */}
      <SectionReveal direction="down">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-theme-surface border border-theme-border shadow-premium relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[400px] h-full bg-theme-accent/5 blur-[100px] -mr-48 pointer-events-none group-hover:bg-theme-accent/10 transition-colors duration-700" />
          
          <div className="relative z-10 space-y-2">
             <div className="flex items-center gap-2 text-theme-accent font-black text-[11px] uppercase tracking-[0.2em] mb-2">
                <Sparkles size={14} />
                <span>Engine Active</span>
             </div>
             <h1 className="text-[32px] font-black text-theme-text tracking-tighter leading-none">
               Recruitment <span className="text-theme-accent underline decoration-theme-accent/30">Intelligence</span> Overview
             </h1>
             <p className="text-[14px] text-theme-textSecondary max-w-xl leading-relaxed font-medium">
               Real-time ingestion of global talent pools with high-fidelity semantic weights and recursive matching models.
             </p>
          </div>
          
          <div className="flex items-center gap-3 relative z-10 shrink-0">
             <button 
               onClick={() => navigate("/history")}
               className="linear-btn-secondary px-5 py-2.5 flex items-center gap-2.5 group cursor-pointer"
             >
                <span className="text-[13px] font-bold">Audit Logs</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </button>
             <button 
               onClick={() => navigate("/resume-analyzer")}
               className="linear-btn-primary px-6 py-2.5 shadow-accent-glow flex items-center gap-2.5 group cursor-pointer"
             >
                <Zap size={15} fill="white" />
                <span className="text-[13px] font-bold">New Extraction</span>
             </button>
          </div>
        </div>
      </SectionReveal>

      {/* Stats Row */}
      <SectionReveal delay={0.2}>
        <StatsCards />
      </SectionReveal>

      {/* Main Grid: Charts + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        <div className="xl:col-span-3 space-y-12">
           <SectionReveal delay={0.3} direction="left">
             <div className="bg-transparent">
                <AnalyticsCharts />
             </div>
           </SectionReveal>
           
           <SectionReveal delay={0.4} direction="up">
             <div className="bg-theme-surface border border-theme-border rounded-2xl shadow-premium overflow-hidden floating-layer">
                <div className="px-6 py-4 border-b border-theme-border bg-theme-sidebar/30 flex items-center justify-between">
                   <div className="flex items-center gap-2.5">
                      <Target size={16} className="text-theme-accent" />
                      <h3 className="text-[14px] font-black text-theme-text uppercase tracking-widest leading-none">Global Candidate Feed</h3>
                   </div>
                   <button className="text-[11px] font-black text-theme-accent hover:underline uppercase tracking-widest">Index Full Database</button>
                </div>
                <div className="p-0">
                   <CandidateTable limit={8} hideFilters={true} />
                </div>
             </div>
           </SectionReveal>
        </div>

        {/* Sidebar Panel: Activity Feed */}
        <div className="xl:col-span-1 h-full">
           <SectionReveal delay={0.5} direction="right" className="h-full">
             <div className="linear-card p-6 h-full sticky top-24 backdrop-premium border-theme-accent/10">
                <ActivityFeed />
             </div>
           </SectionReveal>
        </div>

      </div>

    </div>
  )
}