import React, { useState } from 'react';
import { Search, Filter, Eye, Download, Trash2, ArrowUpDown, X, User, Briefcase, Star, Info, TrendingUp, Sparkles } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import { motion, AnimatePresence } from 'framer-motion';
import ATSResultCard from './ATSResultCard';
import AIInsights from './AIInsights';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function CandidateTable({ limit, hideFilters = false }) {
  const { 
    candidates, loading, 
    searchTerm, setSearchTerm, 
    skillFilter, setSkillFilter, 
    minScoreFilter, setMinScoreFilter,
    removeCandidate 
  } = useDashboard();
  
  const [sortField, setSortField] = useState("ats_score");
  const [sortDesc, setSortDesc] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

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

  const displayCandidates = limit ? sortedCandidates.slice(0, limit) : sortedCandidates;

  return (
    <div className="flex flex-col w-full bg-theme-bg relative">
      
      {/* Table Header Controls */}
      {!hideFilters && (
        <div className="flex items-center gap-3 p-3 border-b border-theme-border bg-theme-sidebar/20">
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-md focus-within:border-theme-accent transition-all duration-150 w-64 group">
            <Search className="text-theme-textSecondary w-3.5 h-3.5 group-focus-within:text-theme-accent" />
            <input 
              type="text" 
              placeholder="Search names..." 
              className="bg-transparent text-[12px] text-theme-text w-full outline-none placeholder:text-theme-textSecondary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5 bg-theme-surface border border-theme-border rounded-md focus-within:border-theme-accent transition-all duration-150 w-48 group">
            <Filter className="text-theme-textSecondary w-3.5 h-3.5 group-focus-within:text-theme-accent" />
            <input 
              type="text" 
              placeholder="Skills..." 
              className="bg-transparent text-[12px] text-theme-text w-full outline-none placeholder:text-theme-textSecondary"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
          </div>
          <select 
            className="bg-theme-surface border border-theme-border text-theme-text text-[12px] rounded-md px-3 py-1.5 outline-none focus:border-theme-accent cursor-pointer hover:bg-theme-hover transition-colors"
            value={minScoreFilter}
            onChange={(e) => setMinScoreFilter(e.target.value)}
          >
            <option value="">Min Score</option>
            <option value="50">50+</option>
            <option value="70">70+</option>
            <option value="85">85+</option>
          </select>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-theme-border bg-theme-sidebar/10">
              <th className="py-2.5 px-4 text-[11px] font-semibold text-theme-textSecondary uppercase tracking-widest hover:text-theme-text transition-colors cursor-pointer select-none" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1.5">Candidate <ArrowUpDown size={10} className="opacity-30" /></div>
              </th>
              <th className="py-2.5 px-4 text-[11px] font-semibold text-theme-textSecondary uppercase tracking-widest hover:text-theme-text transition-colors cursor-pointer select-none" onClick={() => toggleSort('role')}>
                <div className="flex items-center gap-1.5">Role <ArrowUpDown size={10} className="opacity-30" /></div>
              </th>
              <th className="py-2.5 px-4 text-[11px] font-semibold text-theme-textSecondary uppercase tracking-widest hover:text-theme-text transition-colors cursor-pointer select-none" onClick={() => toggleSort('ats_score')}>
                <div className="flex items-center gap-1.5">Score <ArrowUpDown size={10} className="opacity-30" /></div>
              </th>
              <th className="py-2.5 px-4 text-[11px] font-semibold text-theme-textSecondary uppercase tracking-widest">Skills</th>
              {!limit && <th className="py-2.5 px-4 text-[11px] font-semibold text-theme-textSecondary uppercase tracking-widest">Added</th>}
              <th className="py-2.5 px-4 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="border-b border-theme-border/50">
                  <td colSpan="6" className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <div className="h-3 bg-theme-border rounded w-1/4 animate-pulse"></div>
                      <div className="h-3 bg-theme-border rounded w-1/6 animate-pulse"></div>
                      <div className="h-3 bg-theme-border rounded w-1/4 animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : displayCandidates.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-16 text-theme-textSecondary text-[13px] border-b-0 opacity-50 font-medium">
                   No matching candidates found inside your workspace.
                </td>
              </tr>
            ) : (
                displayCandidates.map((c, idx) => (
                    <motion.tr 
                      key={c.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => setSelectedCandidate(c)}
                      className={`group border-b border-theme-border last:border-b-0 hover:bg-theme-hover transition-all duration-200 cursor-pointer 
                      ${selectedCandidate?.id === c.id ? 'bg-theme-hover ring-1 ring-inset ring-theme-accent/20' : ''}`}
                    >
                      <td className="py-3 px-4 text-[13px] font-medium text-theme-text group-hover:translate-x-0.5 transition-transform duration-200">
                        <div className="flex items-center gap-2.5">
                           <div className="w-6 h-6 rounded-sm bg-theme-sidebar border border-theme-border flex items-center justify-center text-theme-textSecondary font-bold text-[10px]">
                              {c.name.charAt(0)}
                           </div>
                           {c.name}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-[13px] text-theme-textSecondary">{c.role}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                           <div className={`text-[12px] font-bold px-1.5 py-0.5 rounded border border-current bg-opacity-10 
                             ${c.ats_score >= 80 ? 'text-success border-success/20 bg-success/5' : 
                               c.ats_score >= 60 ? 'text-warning border-warning/20 bg-warning/5' : 
                               'text-error border-error/20 bg-error/5'}`}>
                             {c.ats_score}%
                           </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 max-w-[200px] overflow-hidden">
                          {c.skills.slice(0, 3).map((s, i) => (
                            <span key={i} className="bg-theme-surface border border-theme-border text-theme-textSecondary text-[11px] px-1.5 py-0.5 rounded-sm">
                              {s}
                            </span>
                          ))}
                          {c.skills.length > 3 && <span className="text-theme-textSecondary text-[10px] font-medium">+{c.skills.length - 3}</span>}
                        </div>
                      </td>
                      {!limit && <td className="py-3 px-4 text-[12px] text-theme-textSecondary font-mono opacity-60">Mar 23</td>}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                          <button 
                            onClick={(e) => { e.stopPropagation(); window.open(`${API_BASE_URL}/download/${c.id}`, "_blank"); }} 
                            className="p-1.5 text-theme-textSecondary hover:text-theme-text hover:bg-theme-border rounded transition-colors" 
                          >
                            <Download size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-in Detail Drawer */}
      <AnimatePresence>
        {selectedCandidate && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full max-w-[480px] h-full bg-theme-surface border-l border-theme-border z-[70] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-theme-border bg-theme-sidebar/20">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded border border-theme-border bg-theme-bg flex items-center justify-center text-theme-accent">
                      <User size={16} />
                   </div>
                   <h3 className="text-[15px] font-bold text-theme-text tracking-tight">Candidate Profile</h3>
                </div>
                <button onClick={() => setSelectedCandidate(null)} className="p-1.5 hover:bg-theme-hover rounded-md text-theme-textSecondary transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Profile Header */}
                <div className="space-y-4">
                   <div>
                      <h2 className="text-[20px] font-extrabold text-theme-text mb-1">{selectedCandidate.name}</h2>
                      <div className="flex items-center gap-3 text-theme-textSecondary text-[13px]">
                         <span className="flex items-center gap-1.5"><Briefcase size={14} /> {selectedCandidate.role}</span>
                         <span className="w-1 h-1 rounded-full bg-theme-border" />
                         <span className="flex items-center gap-1.5 text-success font-medium"><Star size={14} /> Top Match</span>
                      </div>
                   </div>

                   <div className="p-4 bg-theme-bg border border-theme-border rounded-md flex items-center justify-between">
                      <div className="flex flex-col">
                         <span className="text-[11px] font-bold text-theme-textSecondary uppercase tracking-widest leading-none mb-2">ATS SCORE</span>
                         <span className="text-[24px] font-black text-theme-text">{selectedCandidate.ats_score}%</span>
                      </div>
                      <div className="w-[100px] h-2 bg-theme-border rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${selectedCandidate.ats_score}%` }}
                           className={`h-full ${selectedCandidate.ats_score >= 80 ? 'bg-success' : 'bg-warning'}`}
                         />
                      </div>
                   </div>
                </div>

                {/* AI Insights Section */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-theme-accent">
                      <Sparkles size={16} />
                      <h4 className="text-[13px] font-bold uppercase tracking-widest">AI Intelligence</h4>
                   </div>
                   <div className="bg-theme-accent/5 border border-theme-accent/20 p-4 rounded-md space-y-3">
                      <p className="text-[13px] text-theme-text leading-relaxed font-medium">
                        Strong alignment with backend architecture requirements. Shows high proficiency in distributed systems.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.skills.map(s => (
                          <span key={s} className="px-2 py-0.5 bg-theme-accent/10 border border-theme-accent/20 text-theme-accent text-[11px] rounded-sm font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                   </div>
                </div>

                {/* Score Breakdown */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-theme-textSecondary">
                      <TrendingUp size={16} />
                      <h4 className="text-[13px] font-bold uppercase tracking-widest">Detailed Analysis</h4>
                   </div>
                   <ATSResultCard 
                    compact
                    result={{
                      ats_score: selectedCandidate.ats_score,
                      matched_skills: selectedCandidate.skills,
                      missing_skills: selectedCandidate.missing_skills || ["Cloud Architecture", "EKS"],
                      suggestions: selectedCandidate.suggestions || "Focus on elaborating experience with Kubernetes and high-scale traffic handling."
                    }} 
                  />
                </div>
              </div>

              <div className="p-4 border-t border-theme-border bg-theme-bg/50 grid grid-cols-2 gap-3">
                 <button className="linear-btn-secondary w-full py-2">Download PDF</button>
                 <button className="linear-btn-primary w-full py-2 shadow-accent-glow">Move to Interview</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
