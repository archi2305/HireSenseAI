import React, { useState } from 'react';
import { Search, Filter, Eye, Download, Trash2, ArrowUpDown, X } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';
import ATSResultCard from './ATSResultCard';

const API_BASE_URL = "http://127.0.0.1:8000";

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
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col mt-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-lg font-bold text-slate-800">Candidate Pipeline</h3>
        
        {/* Smart Filters */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto mt-2 md:mt-0">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pastelBlue transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-40">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Skills (Comma sep)" 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pastelBlue transition-all"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
          </div>
          <select 
            className="w-full md:w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pastelBlue cursor-pointer transition-all"
            value={minScoreFilter}
            onChange={(e) => setMinScoreFilter(e.target.value)}
          >
            <option value="">Any Score</option>
            <option value="50">&gt; 50</option>
            <option value="70">&gt; 70</option>
            <option value="80">&gt; 80</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-600 text-sm font-medium border-b border-slate-200">
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1">Candidate <ArrowUpDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort('role')}>
                <div className="flex items-center gap-1">Role <ArrowUpDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => toggleSort('ats_score')}>
                <div className="flex items-center gap-1">ATS Score <ArrowUpDown size={14} className="text-slate-400" /></div>
              </th>
              <th className="py-3 px-4">Skills</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [1, 2, 3].map(i => (
                <tr key={i} className="border-b border-slate-100">
                  <td colSpan="6" className="py-4 px-4">
                    <div className="animate-pulse flex space-x-4">
                      <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/6"></div>
                      <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                    </div>
                  </td>
                </tr>
              ))
            ) : sortedCandidates.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-slate-500 bg-slate-50/50">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="w-8 h-8 text-slate-300 mb-2" />
                    <p>No candidates found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
                sortedCandidates.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                      <td className="py-3 px-4 font-medium text-slate-800">{c.name}</td>
                      <td className="py-3 px-4 text-slate-600">{c.role}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.ats_score >= 80 ? 'bg-emerald-100 text-emerald-700' : c.ats_score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                          {c.ats_score}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {c.skills.slice(0, 3).map((s, i) => (
                            <span key={i} className="bg-slate-100 border border-slate-200 text-slate-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md">{s}</span>
                          ))}
                          {c.skills.length > 3 && <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-md">+{c.skills.length - 3}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-[11px] uppercase tracking-wide font-bold rounded-md ${c.status === 'Reviewed' ? 'bg-indigo-50 border border-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setViewCandidate(c)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View details"><Eye size={18} /></button>
                          <button onClick={() => handleDownload(c.id)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Download resume"><Download size={18} /></button>
                          <button onClick={() => { if(window.confirm("Are you sure you want to delete this candidate?")) removeCandidate(c.id) }} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Delete candidate"><Trash2 size={18} /></button>
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative animate-fade-in-up">
            <button 
              onClick={() => setViewCandidate(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-500 rounded-full transition-colors z-10"
            >
              <X size={20} />
            </button>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-1">{viewCandidate.name}</h2>
              <p className="text-sm font-medium text-slate-500 mb-6">{viewCandidate.role} Analysis</p>
              
              <div className="-mt-8">
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
        </div>
      )}

    </div>
  );
}
