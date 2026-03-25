import React from "react"
import { motion } from "framer-motion"
import StatsCards from "../components/StatsCards"
import AnalyticsCharts from "../components/AnalyticsCharts"
import CandidateTable from "../components/CandidateTable"
import ActivityFeed from "../components/ActivityFeed"

export default function Dashboard() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto w-full space-y-8 min-h-full">
      
      {/* Top Banner Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-[24px] font-bold text-theme-text tracking-tight mb-1">Workspace Overview</h1>
           <p className="text-[14px] text-theme-textSecondary">Real-time performance metrics and candidate pipeline velocity.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="linear-btn-secondary px-3 py-1.5 flex items-center gap-2">
              <span className="text-[12px]">Export Report</span>
           </button>
           <button className="linear-btn-primary px-3 py-1.5 shadow-accent-glow">
              <span className="text-[12px]">Quick Parse</span>
           </button>
        </div>
      </div>

      {/* Stats Row */}
      <StatsCards />

      {/* Main Grid: Charts + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        <div className="xl:col-span-3 space-y-6">
           <div className="bg-theme-bg/50 rounded-lg">
              <AnalyticsCharts />
           </div>
           
           <div className="bg-theme-surface border border-theme-border rounded-md shadow-linear overflow-hidden">
              <div className="px-4 py-3 border-b border-theme-border bg-theme-sidebar/30 flex items-center justify-between">
                 <h3 className="text-[13px] font-semibold text-theme-text uppercase tracking-wider">Recent Candidate Inflow</h3>
                 <button className="text-[11px] text-theme-accent hover:underline">View all candidates</button>
              </div>
              <div className="p-0">
                 <CandidateTable limit={5} hideFilters={true} />
              </div>
           </div>
        </div>

        {/* Sidebar Panel: Activity Feed */}
        <div className="xl:col-span-1 h-full">
           <div className="linear-card p-6 h-full sticky top-20">
              <ActivityFeed />
           </div>
        </div>

      </div>

    </div>
  )
}