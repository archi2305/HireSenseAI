import React, { useRef } from "react";
import { UploadCloud, Copy, FileText } from "lucide-react";
import CandidateTable from "../components/CandidateTable";
import { useDashboard } from "../context/DashboardContext";
import toast from "react-hot-toast";

function Dashboard() {
  const { 
    uploadResume, 
    bulkUploadResumes,
  } = useDashboard();

  const fileInputRef = useRef(null);
  const bulkInputRef = useRef(null);

  const handleUploadClick = () => fileInputRef.current.click();
  const handleBulkUploadClick = () => bulkInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const role = prompt("Enter the Job Role for this candidate (or leave blank for generic comparison):", "");
      if (role !== null) {
        await uploadResume(file, role);
      }
      e.target.value = "";
    }
  };

  const handleBulkChange = async (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const role = prompt("Enter a Job Role for this batch of resumes (or leave blank for generic comparison):", "");
      if (role !== null) {
        await bulkUploadResumes(files, role);
      }
      e.target.value = "";
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col p-8">
      {/* Hidden inputs for file uploads */}
      <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
      <input type="file" ref={bulkInputRef} className="hidden" accept=".pdf,.doc,.docx" multiple onChange={handleBulkChange} />

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-400" />
            Candidates
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">Manage and parse incoming resumes.</p>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={handleBulkUploadClick} 
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-slate-700 text-[13px] font-medium rounded-md hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            <Copy size={14} className="text-slate-500" /> 
            Bulk Upload
          </button>
          
          <button 
            onClick={handleUploadClick} 
            className="flex items-center gap-2 px-3 py-1.5 bg-[#a5b4fc] text-white border border-transparent text-[13px] font-medium rounded-md hover:bg-[#818cf8] transition-all duration-200 shadow-sm"
          >
            <UploadCloud size={14} /> 
            Upload Resume
          </button>
        </div>
      </div>

      {/* Main Table Area */}
      <CandidateTable />
    </div>
  );
}

export default Dashboard;