import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sparkles, Brain, Target, Info } from 'lucide-react';
import { useDashboard } from '../context/DashboardContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function AIInsights() {
  const { updateCounter } = useDashboard();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateInsights = async () => {
      try {
        const [overview, skills] = await Promise.all([
          axios.get(`${API_BASE_URL}/analytics/overview`),
          axios.get(`${API_BASE_URL}/analytics/skills`)
        ]);
        
        const newInsights = [];
        
        if (overview.data.avg_score > 70) {
          newInsights.push({ text: "Candidate quality is currently trending 15% above benchmark.", icon: Target, color: 'text-success' });
        }
        
        if (skills.data && skills.data.length > 0) {
          newInsights.push({ text: `${skills.data[0].name} expertise is highly correlated with current successes.`, icon: Brain, color: 'text-theme-accent' });
        }
        
        if (overview.data.recent_matches > 0) {
          newInsights.push({ text: `Accelerate search: Found ${overview.data.recent_matches} high-priority matches today.`, icon: Sparkles, color: 'text-warning' });
        }
        
        setInsights(newInsights);
      } catch (err) {
        console.error("Failed to fetch insights", err);
      } finally {
        setLoading(false);
      }
    };
    generateInsights();
  }, [updateCounter]);

  return (
    <div className="flex flex-col gap-4">
      {loading ? (
        [1, 2, 3].map(i => (
          <div key={i} className="h-14 bg-theme-surface border border-theme-border rounded-md animate-pulse opacity-20" />
        ))
      ) : (
        insights.map((insight, idx) => {
          const Icon = insight.icon;
          return (
            <div 
              key={idx} 
              className="group p-3.5 bg-theme-surface border border-theme-border rounded-md hover:border-theme-accent/30 transition-all duration-200 shadow-linear"
            >
              <div className="flex gap-3">
                <div className={`shrink-0 p-1.5 rounded bg-theme-bg border border-theme-border ${insight.color}`}>
                  <Icon size={14} />
                </div>
                <div className="flex flex-col gap-1">
                   <p className="text-[13px] font-medium text-theme-text leading-tight group-hover:text-theme-accent transition-colors">
                      {insight.text}
                   </p>
                   <div className="flex items-center gap-1.5 opacity-40 text-[10px] font-bold uppercase tracking-widest text-theme-textSecondary">
                      <Info size={10} />
                      AI Intelligence
                   </div>
                </div>
              </div>
            </div>
          )
        })
      )}
      {insights.length === 0 && !loading && (
        <p className="text-[12px] text-theme-textSecondary text-center py-4 italic">No intelligence generated yet.</p>
      )}
    </div>
  );
}
