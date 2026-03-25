import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Area, AreaChart, BarChart, Bar, Cell
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe'];

export default function AnalyticsCharts() {
  const { updateCounter } = useDashboard();
  const [trendData, setTrendData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [trendRes, skillsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/analytics/trend`),
          axios.get(`${API_BASE_URL}/analytics/skills`),
        ]);
        setTrendData(trendRes.data);
        setSkillsData(skillsRes.data.slice(0, 5)); // Keep it dense
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [updateCounter]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-theme-surface border border-theme-border p-2 rounded shadow-linear text-[11px]">
          <p className="text-theme-textSecondary font-medium mb-1">{label}</p>
          <p className="text-theme-text font-bold">
            <span className="text-theme-accent">Value: </span>
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      
      {/* Trend Chart */}
      <div className="bg-theme-surface border border-theme-border rounded-md p-5 flex flex-col h-[320px]">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-[13px] font-semibold text-theme-text uppercase tracking-wider opacity-80">Parsing Volume</h3>
           <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-theme-accent"></span>
              <span className="text-[11px] text-theme-textSecondary">Last 30 days</span>
           </div>
        </div>
        
        <div className="flex-1 min-h-0">
          {isLoading ? (
            <div className="w-full h-full skeleton opacity-20" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2a2a2a" />
                <XAxis 
                  dataKey="date" 
                  tick={{fontSize: 10, fill: '#71717a'}} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  tick={{fontSize: 10, fill: '#71717a'}} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46' }} />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  fill="url(#areaGradient)"
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Skills Chart */}
      <div className="bg-theme-surface border border-theme-border rounded-md p-5 flex flex-col h-[320px]">
        <h3 className="text-[13px] font-semibold text-theme-text uppercase tracking-wider opacity-80 mb-6">Skill Density</h3>
        <div className="flex-1 min-h-0">
          {isLoading ? (
            <div className="w-full h-full skeleton opacity-20" />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#2a2a2a" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{fontSize: 10, fill: '#a1a1aa'}} 
                  tickLine={false} 
                  axisLine={false}
                  width={60}
                />
                <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                <Bar 
                  dataKey="count" 
                  radius={[0, 4, 4, 0]} 
                  barSize={16}
                  animationDuration={1000}
                >
                  {skillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

    </div>
  );
}
