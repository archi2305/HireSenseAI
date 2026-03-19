import React, { useState } from 'react';
import axios from 'axios';
import { Search, BrainCircuit, Loader2, Star } from 'lucide-react';

const API_BASE_URL = "http://127.0.0.1:8000";

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
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100 flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-40 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 w-full">
          <div className="flex items-center gap-3 mb-2">
            <BrainCircuit className="text-indigo-600 w-8 h-8" />
            <h1 className="text-2xl font-bold text-slate-800">Candidate Matching Feature</h1>
          </div>
          <p className="text-slate-500">Paste a job description below, and our AI will instantly surface the best candidates from your database.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleMatch} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col">
            <label className="block text-sm font-bold text-slate-800 mb-3">Job Description</label>
            <textarea
              className="w-full flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors resize-none min-h-[300px]"
              placeholder="E.g., We are looking for a Senior React Developer with 5+ years of experience, proficient in state management, TypeScript, and modern styling frameworks..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              required
            ></textarea>
            <button
              type="submit"
              disabled={loading || !jobDescription.trim()}
              className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
              Find Matches
            </button>
          </form>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-slate-800">Top Candidates ({matches.length})</h2>
          </div>
          
          <div className="space-y-4">
            {matches.length === 0 && !loading && (
              <div className="bg-white/60 border border-slate-200 border-dashed rounded-2xl p-12 text-center text-slate-500">
                <BrainCircuit className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p>Paste a job description and click match to see top candidates.</p>
              </div>
            )}
            
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin w-10 h-10 text-indigo-600" />
              </div>
            )}
            
            {matches.map((match, idx) => (
              <div key={match.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 sm:items-center transform hover:-translate-y-1 duration-200">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-100 border border-indigo-100 flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-indigo-700">{match.match_percentage}%</span>
                  <span className="text-[10px] font-bold text-indigo-500 uppercase">Match</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                      {match.name}
                      {idx === 0 && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">{match.role}</p>
                  <div className="flex flex-wrap gap-1">
                    {match.skills.map(skill => (
                      <span key={skill} className="bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex-shrink-0 hidden sm:block">
                  <button className="px-4 py-2 bg-slate-50 text-indigo-600 text-sm font-semibold rounded-lg hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-colors">
                    View Profile
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
