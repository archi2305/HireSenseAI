import React, { useState } from 'react';
import axios from 'axios';
import { Search, BrainCircuit, Loader2, Star, Target } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function CandidateMatching() {
  const [jobDescription, setJobDescription] = useState("");
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("job_description", jobDescription);
      
      const res = await axios.post(`${API_BASE_URL}/candidates/match`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMatches(res.data || []);
    } catch (err) {
      console.error("Failed to match candidates", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] max-w-7xl mx-auto w-full pt-4">
      <div className="flex items-center gap-2 mb-6 shrink-0">
        <Target className="w-5 h-5 text-theme-textSecondary" />
        <h1 className="text-xl font-semibold text-theme-text tracking-tight">Candidate Matching</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
        
        {/* Left: Input Panel */}
        <div className="w-full lg:w-[400px] flex flex-col shrink-0 min-h-0 bg-theme-bg border border-theme-border rounded-md shadow-sm">
          <div className="p-3 border-b border-theme-border bg-theme-sidebar/50">
            <h2 className="text-[13px] font-medium text-theme-text">Job Description</h2>
          </div>
          
          <form onSubmit={handleMatch} className="flex flex-col flex-1 p-4 min-h-0">
            <textarea
              className="w-full flex-1 border border-theme-border rounded-md px-3 py-2 text-[13px] text-theme-text bg-theme-sidebar focus:border-theme-accent focus:outline-none transition-all duration-150 resize-none min-h-[300px] placeholder:text-theme-textSecondary"
              placeholder="Paste job description requirements to find the best matched candidates from your database..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading || !jobDescription.trim()}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-theme-text text-theme-bg text-[13px] font-semibold rounded-md hover:bg-gray-200 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Search className="w-4 h-4" />}
              Find Matches
            </button>
          </form>
        </div>

        {/* Right: Results Panel */}
        <div className="flex-1 flex flex-col min-h-0 bg-theme-bg border border-theme-border rounded-md shadow-sm">
          <div className="p-3 border-b border-theme-border bg-theme-sidebar/50 flex items-center justify-between">
            <h2 className="text-[13px] font-medium text-theme-text">Top Candidates</h2>
            <span className="text-[11px] text-theme-textSecondary px-2 py-0.5 bg-theme-card border border-theme-border rounded">
              {matches.length} found
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {matches.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-theme-textSecondary">
                <BrainCircuit className="w-8 h-8 opacity-20 mb-3" />
                <p className="text-[13px]">Paste job description to find matches</p>
              </div>
            )}
            
            {loading && (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="animate-spin w-6 h-6 text-theme-accent" />
              </div>
            )}
            
            {matches.map((match, idx) => (
              <div key={match.id} className="bg-theme-sidebar p-3.5 rounded-md border border-theme-border hover:border-theme-textSecondary/30 transition-all duration-150 flex items-start gap-4 group">
                
                <div className="flex-shrink-0 w-12 h-12 flex flex-col items-center justify-center rounded border border-theme-border bg-theme-bg group-hover:bg-theme-hover transition-colors">
                  <span className={`text-[15px] font-bold ${match.match_percentage >= 80 ? 'text-success' : match.match_percentage >= 60 ? 'text-warning' : 'text-error'}`}>
                    {match.match_percentage}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-[14px] font-medium text-theme-text truncate">{match.name}</h3>
                    {idx === 0 && <Star className="w-3.5 h-3.5 text-warning fill-warning shrink-0" />}
                  </div>
                  <p className="text-[12px] text-theme-textSecondary mb-2">{match.role}</p>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {match.skills.map(skill => (
                      <span key={skill} className="bg-theme-bg border border-theme-border text-theme-textSecondary px-1.5 py-0.5 rounded text-[11px] font-medium leading-none">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  <button className="px-3 py-1.5 bg-theme-bg text-theme-textSecondary text-[12px] font-medium rounded border border-theme-border hover:text-theme-text hover:bg-theme-hover transition-colors">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
