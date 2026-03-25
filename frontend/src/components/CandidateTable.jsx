import React, { useState } from 'react';
import { Search, Filter, Eye, Download, Trash2, ArrowUpDown, X } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import ATSResultCard from './ATSResultCard';
import { motion, AnimatePresence } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

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
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-card border border-white/50 flex flex-col hover:shadow-hover-card hover:bg-white/80 transition-all duration-300"
    >
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
        <h3 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">Candidate Pipeline</h3>
        
        {/* Smart Filters */}
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-all duration-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full lg:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Skills (Comma sep)" 
              className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all duration-300"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
          </div>
          <motion.select 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full lg:w-36 px-4 py-3 bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pastelBlue focus:bg-white cursor-pointer transition-all duration-300"
            value={minScoreFilter}
            onChange={(e) => setMinScoreFilter(e.target.value)}
          >
            <option value="">Any Score</option>
            <option value="50">&gt; 50</option>
            <option value="70">&gt; 70</option>
            <option value="80">&gt; 80</option>
          </motion.select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/50 bg-white/30 backdrop-blur-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/50 backdrop-blur-sm text-slate-600 text-sm font-semibold border-b border-white/50">
              <th className="py-4 px-6 cursor-pointer hover:bg-white/70 transition-all duration-300" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-2">Candidate <ArrowUpDown size={16} className="text-slate-400" /></div>
              </th>
              <th className="py-4 px-6 cursor-pointer hover:bg-white/70 transition-all duration-300" onClick={() => toggleSort('role')}>
                <div className="flex items-center gap-2">Role <ArrowUpDown size={16} className="text-slate-400" /></div>
              </th>
              <th className="py-4 px-6 cursor-pointer hover:bg-white/70 transition-all duration-300" onClick={() => toggleSort('ats_score')}>
                <div className="flex items-center gap-2">ATS Score <ArrowUpDown size={16} className="text-slate-400" /></div>
              </th>
              <th className="py-4 px-6">Skills</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 cursor-pointer hover:bg-white/70 transition-all duration-300" onClick={() => toggleSort('date')}>
                <div className="flex items-center gap-2">Added On <ArrowUpDown size={16} className="text-slate-400" /></div>
              </th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <motion.tbody
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
          >
            {loading ? (
              [1, 2, 3].map(i => (
                <motion.tr 
                  key={i} 
                  variants={rowVariants}
                  className="border-b border-white/30"
                >
                  <td colSpan="7" className="py-6 px-6">
                    <div className="animate-pulse flex space-x-4">
                      <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/6"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : sortedCandidates.length === 0 ? (
              <motion.tr variants={rowVariants}>
                <td colSpan="7" className="text-center py-16 text-slate-500 bg-white/20">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Search className="w-12 h-12 text-slate-300" />
                    <p className="text-lg font-medium">{(!searchTerm && !skillFilter && !minScoreFilter) ? "Upload your first resume" : "No candidates found matching your criteria."}</p>
                  </div>
                </td>
              </motion.tr>
            ) : (
                sortedCandidates.map((c) => (
                    <motion.tr 
                      key={c.id} 
                      variants={rowVariants}
                      className="border-b border-white/30 hover:bg-white/40 transition-all duration-300 group"
                    >
                      <td className="py-4 px-6 font-semibold text-slate-800">{c.name}</td>
                      <td className="py-4 px-6 text-slate-600 font-medium">{c.role}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col items-start gap-2">
                          <motion.span 
                            whileHover={{ scale: 1.05 }}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border ${c.ats_score >= 80 ? 'bg-mint/40 border-mint text-emerald-800' : c.ats_score >= 60 ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-softPink/40 border-softPink text-rose-800'}`}
                          >
                            {c.ats_score}% Match
                          </motion.span>
                          <span className="text-xs text-slate-400 font-medium">({c.skills.length} skills matched)</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-wrap gap-2">
                          {c.skills.slice(0, 3).map((s, i) => (
                            <motion.span 
                              key={i} 
                              whileHover={{ scale: 1.05 }}
                              className="bg-white/60 backdrop-blur-sm border border-white/50 text-slate-500 text-xs uppercase font-bold px-3 py-1 rounded-lg shadow-sm"
                            >
                              {s}
                            </motion.span>
                          ))}
                          {c.skills.length > 3 && <span className="bg-white/80 text-slate-600 text-xs font-bold px-3 py-1 rounded-lg">+{c.skills.length - 3}</span>}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <motion.span 
                          whileHover={{ scale: 1.05 }}
                          className={`px-3 py-1.5 flex w-max text-xs uppercase tracking-wide font-extrabold rounded-lg shadow-sm ${c.status === 'High Match' ? 'bg-mint text-emerald-900 border border-mint/50' : c.status === 'Good Match' ? 'bg-amber-100 border border-amber-200 text-amber-800' : 'bg-softPink border border-softPink/50 text-rose-900'}`}
                        >
                          {c.status}
                        </motion.span>
                      </td>
                      <td className="py-4 px-6 text-xs font-medium text-slate-400">
                        {new Date(c.date).toLocaleString("en-IN", { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Kolkata' })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <motion.button 
                            whileHover={{ scale: 1.1 }} 
                            whileTap={{ scale: 0.9 }} 
                            onClick={() => setViewCandidate(c)} 
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white/80 rounded-xl transition-all duration-300 shadow-sm bg-white/60 backdrop-blur-sm" 
                            title="View details"
                          >
                            <Eye size={18} />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }} 
                            whileTap={{ scale: 0.9 }} 
                            onClick={() => handleDownload(c.id)} 
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white/80 rounded-xl transition-all duration-300 shadow-sm bg-white/60 backdrop-blur-sm" 
                            title="Download resume"
                          >
                            <Download size={18} />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.1 }} 
                            whileTap={{ scale: 0.9 }} 
                            onClick={() => { if(window.confirm("Are you sure you want to delete this candidate?")) removeCandidate(c.id) }} 
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-white/80 rounded-xl transition-all duration-300 shadow-sm bg-white/60 backdrop-blur-sm" 
                            title="Delete candidate"
                          >
                            <Trash2 size={18} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                ))
            )}
          </motion.tbody>
        </table>
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {viewCandidate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 overflow-y-auto"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="bg-white/90 backdrop-blur-md rounded-2xl shadow-hover-card w-full max-w-4xl max-h-[90vh] overflow-y-auto relative border border-white/50"
            >
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setViewCandidate(null)}
                className="absolute top-4 right-4 p-3 bg-white/60 backdrop-blur-sm hover:bg-rose-100 hover:text-rose-600 text-slate-500 rounded-full transition-all duration-300 shadow-sm border border-white/50"
              >
                <X size={20} />
              </motion.button>
              <div className="p-10">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">{viewCandidate.name}</h2>
                <p className="text-lg font-medium text-slate-600 mb-8">{viewCandidate.role} Analysis</p>
                
                <div className="mt-4">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
