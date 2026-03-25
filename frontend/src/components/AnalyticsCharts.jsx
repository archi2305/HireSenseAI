import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const AnalyticsCharts = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const data = [
    { name: 'Mon', value: 45, volume: 120 },
    { name: 'Tue', value: 52, volume: 150 },
    { name: 'Wed', value: 48, volume: 180 },
    { name: 'Thu', value: 61, volume: 210 },
    { name: 'Fri', value: 55, volume: 190 },
    { name: 'Sat', value: 67, volume: 240 },
    { name: 'Sun', value: 72, volume: 260 },
  ];

  const skillData = [
    { name: 'Python', value: 85, fill: '#7c3aed' },
    { name: 'React', value: 92, fill: '#3b82f6' },
    { name: 'Node', value: 78, fill: '#10b981' },
    { name: 'AI/ML', value: 88, fill: '#f59e0b' },
  ];

  const chartTheme = useMemo(() => ({
    text: isDark ? '#a1a1aa' : '#6b7280',
    grid: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
    tooltipBg: isDark ? '#0f0f10' : '#ffffff',
    tooltipBorder: isDark ? '#1a1a1c' : '#e5e7eb',
    accent: '#7c3aed',
    accentLight: 'rgba(124, 58, 237, 0.1)',
  }), [isDark]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-theme-surface border border-theme-border rounded-xl shadow-premium backdrop-blur-xl">
          <p className="text-[11px] font-black text-theme-textSecondary uppercase tracking-widest mb-1">{label}</p>
          <p className="text-[14px] font-black text-theme-accent">{payload[0].value} <span className="text-[10px] text-theme-textSecondary opacity-60">Operations</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Parsing Volume */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="linear-card p-6 border-theme-accent/5 group bg-theme-surface/50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-[13px] font-black text-theme-text uppercase tracking-widest">Extraction Flux</h3>
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-theme-accent" />
                 <span className="text-[10px] font-black text-theme-textSecondary uppercase tracking-widest opacity-50">Volume</span>
              </div>
           </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartTheme.accent} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={chartTheme.accent} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={chartTheme.grid} strokeDasharray="4 4" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: chartTheme.text, fontSize: 10, fontWeight: 800 }} 
                dy={10}
              />
              <YAxis 
                hide 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chartTheme.accent} 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
                animationDuration={2000}
                animationEasing="cubic-bezier(0.16, 1, 0.3, 1)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Skill Density */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="linear-card p-6 border-theme-accent/5 bg-theme-surface/50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-[13px] font-black text-theme-text uppercase tracking-widest">Skill Intelligence</h3>
           <span className="px-2 py-0.5 rounded-full bg-theme-accent/10 border border-theme-accent/20 text-theme-accent text-[9px] font-black uppercase tracking-widest">High Affinity</span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillData} layout="vertical" barSize={12}>
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: chartTheme.text, fontSize: 10, fontWeight: 900 }} 
                width={70}
              />
              <Tooltip 
                 cursor={{ fill: 'transparent' }} 
                 content={<CustomTooltip />}
              />
              <Bar 
                dataKey="value" 
                radius={[0, 4, 4, 0]} 
                animationDuration={2000}
                animationEasing="cubic-bezier(0.16, 1, 0.3, 1)"
              >
                 {skillData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} opacity={0.8} />
                 ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsCharts;
