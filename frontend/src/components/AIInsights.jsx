import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sparkles } from 'lucide-react';

const API_BASE_URL = "http://127.0.0.1:8000";

export default function AIInsights() {
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
          newInsights.push("Average ATS score is solid, indicating quality candidates.");
        } else {
          newInsights.push("Average ATS score is low. Consider adjusting job descriptions.");
        }
        
        if (skills.data && skills.data.length > 0) {
          newInsights.push(`Top candidate skill overall is ${skills.data[0].name}.`);
        }
        
        if (overview.data.recent_matches > 0) {
          newInsights.push(`You have ${overview.data.recent_matches} recent high-matching candidates (80%+).`);
        } else {
            newInsights.push("No recent candidates with an ATS score > 80.");
        }
        
        setInsights(newInsights);
      } catch (err) {
        console.error("Failed to fetch insights", err);
      } finally {
        setLoading(false);
      }
    };
    generateInsights();
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl shadow-sm border border-indigo-100 relative overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles size={64} />
      </div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="text-indigo-600" size={24} />
        <h3 className="text-lg font-bold text-indigo-900">AI Insights</h3>
      </div>
      {loading ? (
         <div className="animate-pulse flex space-x-4">
           <div className="flex-1 space-y-4 py-1">
             <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
             <div className="h-4 bg-indigo-200 rounded"></div>
             <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
           </div>
         </div>
      ) : (
        <ul className="space-y-3 relative z-10">
          {insights.map((insight, idx) => (
            <li key={idx} className="flex gap-3 text-indigo-800 bg-white/60 p-3 rounded-lg backdrop-blur-sm border border-white/40 shadow-sm transition-all hover:bg-white/80">
              <span className="w-1.5 h-1.5 mt-2 rounded-full bg-indigo-500 shrink-0"></span>
              <span className="text-sm font-medium">{insight}</span>
            </li>
          ))}
          {insights.length === 0 && (
            <p className="text-sm text-indigo-600">No sufficient data for insights.</p>
          )}
        </ul>
      )}
    </div>
  );
}
