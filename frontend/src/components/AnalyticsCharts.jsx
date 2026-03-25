import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { motion } from 'framer-motion';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';
import Tooltip from './Tooltip';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Enhanced color palette with gradients
const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#06b6d4', '#10b981'];
const PIE_COLORS = ['#6366f1', '#a855f7', '#ec4899']; 
const GRADIENT_COLORS = {
  primary: 'url(#primaryGradient)',
  secondary: 'url(#secondaryGradient)',
  tertiary: 'url(#tertiaryGradient)',
  area: 'url(#areaGradient)',
  success: 'url(#successGradient)',
}; 

export default function AnalyticsCharts() {
  const { updateCounter } = useDashboard();
  const [trendData, setTrendData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [scoresData, setScoresData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
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
        setError('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [updateCounter]);

  // Linear-inspired animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        mass: 0.8
      } 
    }
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
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="secondaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="tertiaryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
          </linearGradient>
          <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>

      <motion.div 
        variants={itemVariants}
        className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-card border border-white/50 hover:shadow-card-hover hover:bg-white/80 transition-all duration-300"
      >
        <motion.h3 
          className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-indigo to-brand-purple tracking-tight mb-6"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          Resumes Parsed (Trend)
        </motion.h3>
        <div className="h-80">
          {isLoading ? (
             <LoadingSkeleton variant="card" className="h-full" />
          ) : error ? (
             <EmptyState 
               type="analytics" 
               title="Analytics Error"
               description="Unable to load trend data. Please try again later."
               className="h-full"
             />
          ) : trendData.length === 0 ? (
             <EmptyState 
               type="analytics" 
               title="No trend data yet"
               description="Start uploading resumes to see analytics trends."
               className="h-full"
             />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  tick={{fontSize: 12, fill: '#94a3b8'}} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                  animationDuration={1000}
                />
                <YAxis 
                  tick={{fontSize: 12, fill: '#94a3b8'}} 
                  tickLine={false} 
                  axisLine={false} 
                  dx={-10}
                  animationDuration={1000}
                />
                <RechartsTooltip 
                  contentStyle={{
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }} 
                  cursor={{stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4'}} 
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="url(#primaryGradient)" 
                  strokeWidth={3}
                  fill="url(#colorGradient)"
                  animationDuration={2000}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-card border border-white/50 hover:shadow-card-hover hover:bg-white/80 transition-all duration-300"
      >
        <motion.h3 
          className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink tracking-tight mb-6"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          Top Skills Frequency
        </motion.h3>
        <div className="h-80">
          {isLoading ? (
             <LoadingSkeleton variant="card" className="h-full" />
          ) : error ? (
             <EmptyState 
               type="analytics" 
               title="Analytics Error"
               description="Unable to load skills data. Please try again later."
               className="h-full"
             />
          ) : skillsData.length === 0 ? (
             <EmptyState 
               type="analytics" 
               title="No skills data yet"
               description="Upload resumes to see skills frequency analysis."
               className="h-full"
             />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsData} layout="vertical" margin={{top: 5, right: 30, left: 40, bottom: 5}}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  type="number" 
                  tick={{fontSize: 12, fill: '#94a3b8'}} 
                  tickLine={false} 
                  axisLine={false}
                  animationDuration={1000}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{fontSize: 12, fill: '#64748b'}} 
                  tickLine={false} 
                  axisLine={false}
                  animationDuration={1000}
                />
                <RechartsTooltip 
                  cursor={{fill: '#f8fafc'}} 
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
                  animationDuration={1800}
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
        className="bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-card border border-white/50 hover:shadow-card-hover hover:bg-white/80 transition-all duration-300 lg:col-span-2"
      >
        <motion.h3 
          className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-success to-info tracking-tight mb-6"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          ATS Score Distribution
        </motion.h3>
        <div className="h-80 flex justify-center">
          {isLoading ? (
             <LoadingSkeleton variant="card" className="h-full w-full" />
          ) : error ? (
             <EmptyState 
               type="analytics" 
               title="Analytics Error"
               description="Unable to load score distribution. Please try again later."
               className="h-full w-full"
             />
          ) : scoresData.every(d => d.value === 0) ? (
             <EmptyState 
               type="analytics" 
               title="No score data yet"
               description="Upload resumes to see ATS score distribution."
               className="h-full w-full"
             />
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
                  animationDuration={2000}
                  animationEasing="ease-out"
                >
                  {scoresData.map((entry, index) => {
                    let color = "#cbd5e1";
                    if (entry.name === "80+") color = "#10b981"; // Success
                    else if (entry.name === "50-80") color = "#f59e0b"; // Warning
                    else if (entry.name === "0-50") color = "#ef4444"; // Error
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <RechartsTooltip 
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
                  animationDuration={1000}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
