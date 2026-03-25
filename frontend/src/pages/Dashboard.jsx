import React, { useRef } from "react";
import { Upload, Copy, Layers, Activity } from "lucide-react";
import CandidateTable from "../components/CandidateTable";
import { useDashboard } from "../context/DashboardContext";

function Dashboard() {
  const { uploadResume, bulkUploadResumes, analytics } = useDashboard();
  const fileInputRef = useRef(null);
  const bulkInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadResume(file, "General");
      e.target.value = "";
    }
  };

  const handleBulkChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await bulkUploadResumes(files, "General");
      e.target.value = "";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col pt-4">
      {/* Hidden inputs */}
      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      <input type="file" ref={bulkInputRef} className="hidden" accept=".pdf,.doc,.docx" multiple onChange={handleBulkChange} />

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-theme-sidebar border border-theme-border flex items-center justify-center">
            <Layers className="w-4 h-4 text-theme-textSecondary" />
          </div>
          <h1 className="text-xl font-semibold text-theme-text tracking-tight">
            Pipeline Overview
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => bulkInputRef.current.click()} 
            className="flex items-center gap-2 px-3 py-1.5 bg-theme-sidebar border border-theme-border text-theme-textSecondary text-[13px] font-medium rounded-md hover:bg-theme-hover hover:text-theme-text transition-all duration-150 shadow-sm"
          >
            <Copy size={14} /> 
            Bulk Upload
          </button>
          
          <button 
            onClick={() => fileInputRef.current.click()} 
            className="flex items-center gap-2 px-3 py-1.5 bg-theme-accent text-white border border-transparent text-[13px] font-medium rounded-md hover:bg-theme-accentHover transition-all duration-150 shadow-sm"
          >
            <Upload size={14} /> 
            New Resume
          </button>
        </div>
      </div>

      {/* Compact Stat Row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Candidates", value: analytics?.total_resumes || "0" },
          { label: "Avg Match Score", value: analytics ? `${analytics.avg_score}%` : "0%" },
          { label: "High Matches", value: analytics?.recent_matches || "0" },
          { label: "Active Roles", value: "3" },
        ].map((stat, i) => (
          <div key={i} className="flex flex-col p-4 bg-theme-bg border border-theme-border rounded-md hover:border-theme-textSecondary/30 transition-all duration-150 shadow-sm">
            <span className="text-[12px] font-medium text-theme-textSecondary mb-1">{stat.label}</span>
            <span className="text-2xl font-semibold text-theme-text tracking-tight">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-6 items-start h-full pb-10">
        {/* Main Table area */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[14px] font-semibold text-theme-text">Recent Candidates</h2>
            <span className="text-[12px] text-theme-textSecondary cursor-pointer hover:text-theme-text transition-all duration-150">View all</span>
          </div>
          <CandidateTable compact={true} />
        </div>

        {/* Activity Feed Sidebar (Fixed Width) */}
        <div className="w-[300px] flex flex-col shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-theme-textSecondary" />
            <h2 className="text-[14px] font-semibold text-theme-text">Recent Activity</h2>
          </div>
          
          <div className="flex flex-col gap-4 p-4 rounded-md border border-theme-border bg-theme-sidebar shadow-sm h-full max-h-[500px] overflow-y-auto">
            {/* Mocked feed for now, matches linear activity style */}
            {[
              { action: "Resume parsed", target: "John Doe", time: "10m ago" },
              { action: "Candidate matched", target: "Frontend Eng", time: "1h ago" },
              { action: "Resume parsed", target: "Alice Smith", time: "2h ago" },
              { action: "Bulk upload", target: "5 resumes", time: "5h ago" },
            ].map((feed, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-theme-border mt-1.5 shrink-0" />
                <div className="flex flex-col">
                  <p className="text-[13px] text-theme-text">
                    <span className="text-theme-textSecondary">{feed.action}</span>{" "}
                    <span className="font-medium">{feed.target}</span>
                  </p>
                  <p className="text-[11px] text-theme-textSecondary mt-0.5">{feed.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;