import React, { useState } from 'react';
import { Search, Filter, Eye, Download, Trash2, ArrowUpDown, X } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import ATSResultCard from './ATSResultCard';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function CandidateTable() {
  const { 
    candidates, loading, 
    searchTerm, setSearchTerm, 
    skillFilter, setSkillFilter, 
    minScoreFilter, setMinScoreFilter,
    removeCandidate 
  } = useDashboard();
  
  const [sortField, setSortField] = useState("ats_score");
  const [sortDesc, setSortDesc] = useState(true);
  const [viewCandidate, setViewCandidate] = useState(null);

  const toggleSort = (field) => {
    if (sortField === field) setSortDesc(!sortDesc);
    else { setSortField(field); setSortDesc(true); }
  };

  const sortedCandidates = [...(candidates || [])].sort((a, b) => {
      let valA = a[sortField]; let valB = b[sortField];
      if (valA < valB) return sortDesc ? 1 : -1;
      if (valA > valB) return sortDesc ? -1 : 1;
      return 0;
  });

  return (
    <div className="flex flex-col w-full bg-theme-bg border border-theme-border rounded-md shadow-sm">
      
      {/* Table Header Controls */}
      <div className="flex items-center p-2 border-b border-theme-border bg-theme-sidebar/50">
        <div className="flex items-center gap-2 w-full max-w-2xl">
          <div className="flex items-center gap-2 px-2 py-1 bg-theme-bg border border-theme-border rounded-md focus-within:border-theme-accent transition-all duration-150 w-64">
            <Search className="text-theme-textSecondary w-3.5 h-3.5" />
            <input 
              type="text" 
              placeholder="Filter names..." 
              className="bg-transparent text-[12px] text-theme-text w-full outline-none placeholder:text-theme-textSecondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-2 py-1 bg-theme-bg border border-theme-border rounded-md focus-within:border-theme-accent transition-all duration-150 w-48">
            <Filter className="text-theme-textSecondary w-3.5 h-3.5" />
            <input 
              type="text" 
              placeholder="Skills..." 
              className="bg-transparent text-[12px] text-theme-text w-full outline-none placeholder:text-theme-textSecondary"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
          </div>
          <select 
            className="bg-theme-bg border border-theme-border text-theme-text text-[12px] rounded-md px-2 py-1 outline-none focus:border-theme-accent cursor-pointer"
            value={minScoreFilter}
            onChange={(e) => setMinScoreFilter(e.target.value)}
          >
            <option value="">Status</option>
            <option value="50">&gt; 50 Score</option>
            <option value="80">&gt; 80 Score</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-theme-border">
              <th className="py-2.5 px-4 text-[11px] font-medium text-theme-textSecondary hover:text-theme-text transition-colors cursor-pointer select-none" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1.5">Candidate <ArrowUpDown size={10} className="opacity-50" /></div>
              </th>
              <th className="py-2.5 px-4 text-[11px] font-medium text-theme-textSecondary hover:text-theme-text transition-colors cursor-pointer select-none" onClick={() => toggleSort('role')}>
                <div className="flex items-center gap-1.5">Role <ArrowUpDown size={10} className="opacity-50" /></div>
              </th>
              <th className="py-2.5 px-4 text-[11px] font-medium text-theme-textSecondary hover:text-theme-text transition-colors cursor-pointer select-none" onClick={() => toggleSort('ats_score')}>
                <div className="flex items-center gap-1.5">Score <ArrowUpDown size={10} className="opacity-50" /></div>
              </th>
              <th className="py-2.5 px-4 text-[11px] font-medium text-theme-textSecondary">Skills</th>
              <th className="py-2.5 px-4 text-[11px] font-medium text-theme-textSecondary">Status</th>
              <th className="py-2.5 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="border-b border-theme-border/50">
                  <td colSpan="6" className="py-3 px-4">
                    <div className="animate-pulse flex space-x-4">
                      <div className="h-3 bg-theme-border rounded w-1/4"></div>
                      <div className="h-3 bg-theme-border rounded w-1/6"></div>
                      <div className="h-3 bg-theme-border rounded w-1/4"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : sortedCandidates.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-theme-textSecondary text-[13px] border-b-0">
                  {(!searchTerm && !skillFilter && !minScoreFilter) ? "No candidates available." : "No matching candidates found."}
                </td>
              </tr>
            ) : (
                sortedCandidates.map((c) => (
                    <tr 
                      key={c.id} 
                      onClick={() => setViewCandidate(c)}
                      className="border-b border-theme-border last:border-b-0 hover:bg-theme-hover transition-colors duration-150 cursor-pointer group"
                    >
                      <td className="py-2.5 px-4 text-[13px] font-medium text-theme-text">{c.name}</td>
                      <td className="py-2.5 px-4 text-[13px] text-theme-textSecondary">{c.role}</td>
                      <td className="py-2.5 px-4">
                        <span className={`text-[12px] font-medium ${c.ats_score >= 80 ? 'text-success' : c.ats_score >= 60 ? 'text-warning' : 'text-error'}`}>
                          {c.ats_score}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-1.5 overflow-hidden">
                          {c.skills.slice(0, 3).map((s, i) => (
                            <span key={i} className="bg-theme-sidebar border border-theme-border text-theme-textSecondary text-[11px] px-1.5 py-0.5 rounded-sm truncate max-w-[100px]">
                              {s}
                            </span>
                          ))}
                          {c.skills.length > 3 && <span className="text-theme-textSecondary text-[11px]">+{c.skills.length - 3}</span>}
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="text-[12px] text-theme-textSecondary">{c.status}</span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button 
                            onClick={(e) => { e.stopPropagation(); window.open(`${API_BASE_URL}/download/${c.id}`, "_blank"); }} 
                            className="p-1.5 text-theme-textSecondary hover:text-theme-text hover:bg-theme-border/50 rounded transition-colors" 
                            title="Download"
                          >
                            <Download size={13} />
                          </button>
                          <button 
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              if(window.confirm("Delete candidate?")) removeCandidate(c.id);
                            }} 
                            className="p-1.5 text-theme-textSecondary hover:text-error hover:bg-theme-border/50 rounded transition-colors" 
                            title="Delete"
                          >
                            <Trash2 size={13} />
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
        <div className="fixed inset-0 bg-[#000000]/80 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
          <div className="bg-theme-card border border-theme-border rounded-md shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col scale-100 animate-fade-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-theme-border">
              <div>
                <h3 className="text-[15px] font-medium text-theme-text tracking-tight">{viewCandidate.name}</h3>
                <p className="text-[12px] text-theme-textSecondary mt-0.5">{viewCandidate.role} — Score: {viewCandidate.ats_score}</p>
              </div>
              <button onClick={() => setViewCandidate(null)} className="p-1.5 text-theme-textSecondary hover:text-white hover:bg-theme-hover rounded-md transition-all duration-150">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto max-h-[70vh]">
              <ATSResultCard 
                result={{
                  ats_score: viewCandidate.ats_score,
                  matched_skills: viewCandidate.skills,
                  missing_skills: viewCandidate.missing_skills || [],
                  suggestions: viewCandidate.suggestions || "No specific suggestions provided."
                }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
