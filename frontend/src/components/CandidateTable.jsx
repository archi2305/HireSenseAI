import React, { useState } from 'react';
import { Search, Filter, Eye, Download, Trash2, ArrowUpDown, X } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import ATSResultCard from './ATSResultCard';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function CandidateTable() {
  const { 
    candidates, 
    loading, 
    searchTerm, setSearchTerm, 
    skillFilter, setSkillFilter, 
    minScoreFilter, setMinScoreFilter,
    removeCandidate 
  } = useDashboard();
  
  // Sort
  const [sortField, setSortField] = useState("ats_score");
  const [sortDesc, setSortDesc] = useState(true);

  // Modal State
  const [viewCandidate, setViewCandidate] = useState(null);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(true);
    }
  };

  const handleDownload = (id) => {
    window.open(`${API_BASE_URL}/download/${id}`, "_blank");
  };

  const sortedCandidates = [...(candidates || [])].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (valA < valB) return sortDesc ? 1 : -1;
      if (valA > valB) return sortDesc ? -1 : 1;
      return 0;
  });

  return (
    <div className="flex flex-col flex-1 bg-white border border-gray-200 rounded-lg shadow-sm">
      
      {/* Filters */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50 rounded-t-lg">
        <div className="flex items-center gap-3 w-full max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Filter candidates..." 
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-md text-[13px] focus:outline-none focus:border-[#a5b4fc] focus:ring-1 focus:ring-[#a5b4fc] transition-all duration-200 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Skills..." 
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-md text-[13px] focus:outline-none focus:border-[#a5b4fc] focus:ring-1 focus:ring-[#a5b4fc] transition-all duration-200 shadow-sm"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
          </div>
          <select 
            className="w-32 px-3 py-1.5 bg-white border border-gray-200 rounded-md text-[13px] text-slate-600 focus:outline-none focus:border-[#a5b4fc] focus:ring-1 focus:ring-[#a5b4fc] cursor-pointer shadow-sm transition-all duration-200"
            value={minScoreFilter}
            onChange={(e) => setMinScoreFilter(e.target.value)}
          >
            <option value="">Status</option>
            <option value="50">&gt; 50 Score</option>
            <option value="70">&gt; 70 Score</option>
            <option value="80">&gt; 80 Score</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-white text-slate-500 text-[11px] uppercase tracking-wider font-semibold border-b border-gray-200">
              <th className="py-3 px-5 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1.5">Candidate <ArrowUpDown size={12} className="text-slate-300" /></div>
              </th>
              <th className="py-3 px-5 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleSort('role')}>
                <div className="flex items-center gap-1.5">Role <ArrowUpDown size={12} className="text-slate-300" /></div>
              </th>
              <th className="py-3 px-5 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleSort('ats_score')}>
                <div className="flex items-center gap-1.5">Score <ArrowUpDown size={12} className="text-slate-300" /></div>
              </th>
              <th className="py-3 px-5">Top Skills</th>
              <th className="py-3 px-5">Feedback</th>
              <th className="py-3 px-5 cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => toggleSort('date')}>
                <div className="flex items-center gap-1.5">Added <ArrowUpDown size={12} className="text-slate-300" /></div>
              </th>
              <th className="py-3 px-5 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="border-b border-gray-100">
                  <td colSpan="7" className="py-4 px-5">
                    <div className="animate-pulse flex space-x-4">
                      <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/6"></div>
                      <div className="h-4 bg-gray-100 rounded w-1/4"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : sortedCandidates.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-16 text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-8 h-8 text-slate-300" />
                    <p className="text-[14px] font-medium">{(!searchTerm && !skillFilter && !minScoreFilter) ? "No candidates found. Upload a resume." : "No candidates matching filters."}</p>
                  </div>
                </td>
              </tr>
            ) : (
                sortedCandidates.map((c) => (
                    <tr 
                      key={c.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 group"
                    >
                      <td className="py-3 px-5 font-medium text-[13px] text-slate-800">{c.name}</td>
                      <td className="py-3 px-5 text-[13px] text-slate-500">{c.role}</td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${c.ats_score >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : c.ats_score >= 60 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                            {c.ats_score}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-1.5 flex-wrap max-w-[200px] overflow-hidden truncate">
                          {c.skills.slice(0, 3).map((s, i) => (
                            <span 
                              key={i} 
                              className="bg-white border border-gray-200 text-slate-600 text-[11px] font-medium px-1.5 py-0.5 rounded"
                            >
                              {s}
                            </span>
                          ))}
                          {c.skills.length > 3 && <span className="text-slate-400 text-[11px] font-medium">+{c.skills.length - 3}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-5">
                        <span className={`text-[12px] font-medium ${c.status === 'High Match' ? 'text-emerald-600' : c.status === 'Good Match' ? 'text-amber-600' : 'text-red-500'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-[12px] text-slate-500">
                        {new Date(c.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                            onClick={() => setViewCandidate(c)} 
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-gray-200 rounded transition-colors" 
                            title="View details"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            onClick={() => handleDownload(c.id)} 
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-gray-200 rounded transition-colors" 
                            title="Download resume"
                          >
                            <Download size={14} />
                          </button>
                          <button 
                            onClick={() => { if(window.confirm("Delete candidate?")) removeCandidate(c.id) }} 
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" 
                            title="Delete candidate"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Modal */}
      {viewCandidate && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-6 mt-16">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{viewCandidate.name}</h3>
                <p className="text-[13px] text-slate-500 mt-0.5">{viewCandidate.role}</p>
              </div>
              <button 
                onClick={() => setViewCandidate(null)}
                className="p-1.5 text-slate-400 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto bg-gray-50/50 flex-1">
              <ATSResultCard 
                result={{
                  ats_score: viewCandidate.ats_score,
                  matched_skills: viewCandidate.skills,
                  missing_skills: viewCandidate.missing_skills || [],
                  suggestions: viewCandidate.suggestions || "No specific suggestions returned."
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
