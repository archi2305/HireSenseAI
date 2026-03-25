import React, { useState } from 'react';
import axios from 'axios';
import { Search, BrainCircuit, Loader2, Star, Target, Info, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    } catch {
      console.error("Failed to match candidates");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="px-6 py-4 flex items-center justify-between border-b border-theme-border bg-theme-sidebar/10 shrink-0">
         <div className="flex items-center gap-2.5">
            <Target className="text-theme-accent" size={18} />
            <h1 className="text-[16px] font-bold text-theme-text tracking-tight uppercase">Intent-Based Matching</h1>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Left: Input Panel */}
        <div className="w-[420px] shrink-0 border-r border-theme-border bg-theme-bg flex flex-col relative z-10 shadow-lg">
           <div className="p-4 border-b border-theme-border">
              <label className="text-[11px] font-bold text-theme-textSecondary uppercase tracking-widest mb-3 block">Recruitment Requirements</label>
              <textarea
                className="w-full h-[400px] linear-input resize-none font-mono text-[12px] leading-relaxed p-3"
                placeholder="Paste role description and technical mandatory requirements..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <button
                onClick={handleMatch}
                disabled={loading || !jobDescription.trim()}
                className="mt-4 w-full linear-btn-primary py-2.5 shadow-accent-glow flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={16} /> : <BrainCircuit size={16} />}
                Search Database
              </button>
           </div>
           <div className="p-4 flex-1 bg-theme-sidebar/20 overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                 <Info size={14} className="text-theme-textSecondary" />
                 <h4 className="text-[11px] font-bold text-theme-textSecondary uppercase tracking-widest">Optimization Strategy</h4>
              </div>
              <p className="text-[12px] text-theme-textSecondary leading-relaxed italic opacity-60">
                Our engine uses semantic embeddings to find candidates whose latent skills match your intent, not just keywords.
              </p>
           </div>
        </div>

        {/* Right: Results Panel */}
        <div className="flex-1 bg-theme-bg/50 overflow-y-auto p-6 relative">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-center justify-between mb-6">
               <h2 className="text-[13px] font-bold text-theme-textSecondary uppercase tracking-widest">Weighted Matches ({matches.length})</h2>
               {matches.length > 0 && <span className="text-[10px] bg-success/10 text-success border border-success/20 px-2 py-0.5 rounded font-bold uppercase tracking-widest">Optimized Result</span>}
            </div>
            
            <AnimatePresence mode="popLayout">
              {matches.length === 0 && !loading && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 0.5, scale: 1 }}
                  className="flex flex-col items-center justify-center py-32 text-theme-textSecondary gap-4 border border-dashed border-theme-border rounded-lg"
                >
                  <Sparkles size={48} strokeWidth={1} />
                  <p className="text-[14px] font-medium italic">Execute a search to surface potential hires.</p>
                </motion.div>
              )}

              {loading && (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => <div key={i} className="h-24 bg-theme-surface border border-theme-border rounded-md animate-pulse opacity-20" />)}
                </div>
              )}

              {matches.map((match, idx) => (
                <motion.div 
                  key={match.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group relative flex bg-theme-surface border border-theme-border p-4 rounded-md hover:border-theme-accent/40 hover:bg-theme-hover transition-all duration-200 shadow-linear"
                >
                  <div className={`shrink-0 w-12 h-12 flex flex-col items-center justify-center rounded border border-theme-border bg-theme-bg group-hover:bg-theme-bg/50 transition-colors
                    ${match.match_percentage >= 80 ? 'border-success/30' : 'border-theme-border'}`}>
                    <span className={`text-[15px] font-black ${match.match_percentage >= 80 ? 'text-success' : 'text-theme-text'}`}>
                      {match.match_percentage}
                    </span>
                    <span className="text-[8px] font-bold text-theme-textSecondary uppercase tracking-tighter">MATCH</span>
                  </div>
                  
                  <div className="ml-4 flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[14px] font-bold text-theme-text truncate">{match.name}</h3>
                      {idx === 0 && <Star className="w-3 h-3 text-warning fill-warning" />}
                    </div>
                    <p className="text-[12px] text-theme-textSecondary mb-3 font-medium">{match.role}</p>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {match.skills.map(skill => (
                        <span key={skill} className="bg-theme-bg border border-theme-border text-theme-textSecondary px-1.5 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-tight">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="shrink-0 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-2 hover:bg-theme-bg rounded-md text-theme-textSecondary hover:text-theme-text transition-colors">
                        <User size={16} />
                     </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
