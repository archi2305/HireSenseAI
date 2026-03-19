import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Eye, Download, Trash2, ArrowUpDown } from 'lucide-react';

const API_BASE_URL = "http://127.0.0.1:8000";

export default function CandidateTable() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [minScore, setMinScore] = useState("");
  
  // Sort
  const [sortField, setSortField] = useState("ats_score");
  const [sortDesc, setSortDesc] = useState(true);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (skillFilter) params.append("skills", skillFilter);
      if (minScore) params.append("min_score", minScore);
      
      const res = await axios.get(`${API_BASE_URL}/candidates?${params.toString()}`);
      
      let data = res.data;
      data.sort((a, b) => {
          let valA = a[sortField];
          let valB = b[sortField];
          if (valA < valB) return sortDesc ? 1 : -1;
          if (valA > valB) return sortDesc ? -1 : 1;
          return 0;
      });
      
      setCandidates(data);
    } catch (err) {
      console.error("Failed to fetch candidates", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCandidates();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, skillFilter, minScore, sortField, sortDesc]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDesc(!sortDesc);
    } else {
      setSortField(field);
      setSortDesc(true);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col mt-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h3 className="text-lg font-bold text-slate-800">Candidate Pipeline</h3>
        
        {/* Smart Filters */}
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by name or role..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pastelBlue"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-40">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Skills (Comma sep)" 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pastelBlue"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
            />
          </div>
          <select 
            className="w-full md:w-32 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-pastelBlue"
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
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
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('name')}>
                <div className="flex items-center gap-1">Candidate <ArrowUpDown size={14} /></div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('role')}>
                <div className="flex items-center gap-1">Role <ArrowUpDown size={14} /></div>
              </th>
              <th className="py-3 px-4 cursor-pointer hover:bg-slate-100" onClick={() => toggleSort('ats_score')}>
                <div className="flex items-center gap-1">ATS Score <ArrowUpDown size={14} /></div>
              </th>
              <th className="py-3 px-4">Skills</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pastelBlue mx-auto"></div>
                </td>
              </tr>
            ) : candidates.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-500">
                  No candidates found matching criteria.
                </td>
              </tr>
            ) : (
                candidates.map((c) => (
                    <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-800">{c.name}</td>
                      <td className="py-3 px-4 text-slate-600">{c.role}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${c.ats_score > 75 ? 'bg-emerald-100 text-emerald-700' : c.ats_score > 50 ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                          {c.ats_score}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {c.skills.slice(0, 3).map((s, i) => (
                            <span key={i} className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-md">{s}</span>
                          ))}
                          {c.skills.length > 3 && <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-md">+{c.skills.length - 3}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-md ${c.status === 'Reviewed' ? 'bg-pastelBlue text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{c.status}</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Eye size={16} /></button>
                          <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Download size={16} /></button>
                          <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
