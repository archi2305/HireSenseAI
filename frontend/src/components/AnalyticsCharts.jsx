import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';

const API_BASE_URL = "http://127.0.0.1:8000";

// Pastel Palette
const COLORS = ['#93C5FD', '#A78BFA', '#FBCFE8', '#86EFAC', '#FDE047'];
const PIE_COLORS = ['#FCA5A5', '#FCD34D', '#6EE7B7']; 

export default function AnalyticsCharts() {
  const { updateCounter } = useDashboard();
  const [trendData, setTrendData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);
  const [scoresData, setScoresData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
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
      }
    };
    fetchData();
  }, [updateCounter]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Resumes Parsed (Trend)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="date" tick={{fontSize: 12, fill: '#94A3B8'}} tickLine={false} axisLine={false} dy={10} />
              <YAxis tick={{fontSize: 12, fill: '#94A3B8'}} tickLine={false} axisLine={false} dx={-10} />
              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} cursor={{stroke: '#E2E8F0', strokeWidth: 1, strokeDasharray: '4 4'}} />
              <Line type="monotone" dataKey="count" stroke="#A78BFA" strokeWidth={3} dot={{r: 4, fill: '#A78BFA', strokeWidth: 0}} activeDot={{r: 6, fill: '#818CF8', strokeWidth: 0}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Top Skills Frequency</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillsData} layout="vertical" margin={{top: 5, right: 30, left: 40, bottom: 5}}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#F1F5F9" />
              <XAxis type="number" tick={{fontSize: 12, fill: '#94A3B8'}} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={{fontSize: 12, fill: '#64748B'}} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                {skillsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-lg font-bold text-slate-800 mb-4">ATS Score Distribution</h3>
        <div className="h-64 flex justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={scoresData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {scoresData.map((entry, index) => {
                  let color = "#CBD5E1";
                  if (entry.name === "80+") color = "#6EE7B7"; // Soft Mint
                  else if (entry.name === "50-80") color = "#FCD34D"; // Soft Yellow
                  else if (entry.name === "0-50") color = "#FCA5A5"; // Soft Red
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Pie>
              <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
