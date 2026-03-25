import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { motion } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Enhanced Pastel Palette with Gradients
const COLORS = ['#818CF8', '#C084FC', '#F472B6', '#86EFAC', '#FDE047'];
const PIE_COLORS = ['#FCA5A5', '#FCD34D', '#6EE7B7']; 
const GRADIENT_COLORS = {
  primary: 'url(#primaryGradient)',
  secondary: 'url(#secondaryGradient)',
  tertiary: 'url(#tertiaryGradient)'
}; 

export default function AnalyticsCharts() {
  const { updateCounter } = useDashboard();
  const [trendData, setTrendData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [scoresData, setScoresData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [trendRes, skillsRes, scoresRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/analytics/trend`),
          axios.get(`${API_BASE_URL}/analytics/skills`),
          axios.get(`${API_BASE_URL}/analytics/scores`),
        ]);
        setTrendData(trendRes.data);
        setSkillsData(skillsRes.data);
        setScoresData(scoresRes.data);
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [updateCounter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-2 gap-8"
    >
      {/* SVG Definitions for Gradients */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="primaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#C084FC" />
          </linearGradient>
          <linearGradient id="secondaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" />
            <stop offset="100%" stopColor="#86EFAC" />
          </linearGradient>
          <linearGradient id="tertiaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#FCA5A5" />
          </linearGradient>
        </defs>
      </svg>

      <motion.div 
        variants={itemVariants}
        className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-card border border-white/50 hover:shadow-hover-card hover:bg-white/80 transition-all duration-300"
      >
        <h3 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight mb-6">Resumes Parsed (Trend)</h3>
        <div className="h-80">
          {isLoading ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex h-full items-center justify-center"
             >
               <div className="flex flex-col items-center gap-4">
                 <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
                 <p className="text-slate-400 font-medium">Loading trend data...</p>
               </div>
             </motion.div>
          ) : trendData.length === 0 ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex h-full items-center justify-center"
             >
               <p className="text-slate-400 font-medium">No trend data available yet.</p>
             </motion.div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#94A3B8'}} tickLine={false} axisLine={false} dy={10} />
                <YAxis tick={{fontSize: 12, fill: '#94A3B8'}} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }} 
                  cursor={{stroke: '#E2E8F0', strokeWidth: 2, strokeDasharray: '4 4'}} 
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="url(#primaryGradient)" 
                  strokeWidth={4} 
                  dot={{r: 6, fill: '#818CF8', strokeWidth: 0}} 
                  activeDot={{r: 8, fill: '#C084FC', strokeWidth: 0}} 
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-card border border-white/50 hover:shadow-hover-card hover:bg-white/80 transition-all duration-300"
      >
        <h3 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 tracking-tight mb-6">Top Skills Frequency</h3>
        <div className="h-80">
          {isLoading ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex h-full items-center justify-center"
             >
               <div className="flex flex-col items-center gap-4">
                 <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin"></div>
                 <p className="text-slate-400 font-medium">Loading skills data...</p>
               </div>
             </motion.div>
          ) : skillsData.length === 0 ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex h-full items-center justify-center"
             >
               <p className="text-slate-400 font-medium">No skills extracted yet.</p>
             </motion.div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsData} layout="vertical" margin={{top: 5, right: 30, left: 40, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F1F5F9" />
                <XAxis type="number" tick={{fontSize: 12, fill: '#94A3B8'}} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" tick={{fontSize: 12, fill: '#64748B'}} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#F8FAFC'}} 
                  contentStyle={{
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }} 
                />
                <Bar 
                  dataKey="count" 
                  radius={[0, 12, 12, 0]} 
                  barSize={28}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {skillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-card border border-white/50 hover:shadow-hover-card hover:bg-white/80 transition-all duration-300 lg:col-span-2"
      >
        <h3 className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600 tracking-tight mb-6">ATS Score Distribution</h3>
        <div className="h-80 flex justify-center">
          {isLoading ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex h-full w-full items-center justify-center"
             >
               <div className="flex flex-col items-center gap-4">
                 <div className="w-12 h-12 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
                 <p className="text-slate-400 font-medium">Loading score distribution...</p>
               </div>
             </motion.div>
          ) : scoresData.every(d => d.value === 0) ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex h-full w-full items-center justify-center"
             >
               <p className="text-slate-400 font-medium">Upload a resume to generate score distributions.</p>
             </motion.div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoresData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                  animationBegin={800}
                  animationDuration={1500}
                  animationEasing="ease-out"
                >
                  {scoresData.map((entry, index) => {
                    let color = "#CBD5E1";
                    if (entry.name === "80+") color = "#6EE7B7"; // Soft Mint
                    else if (entry.name === "50-80") color = "#FCD34D"; // Soft Yellow
                    else if (entry.name === "0-50") color = "#FCA5A5"; // Soft Red
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  wrapperStyle={{
                    paddingTop: '20px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
