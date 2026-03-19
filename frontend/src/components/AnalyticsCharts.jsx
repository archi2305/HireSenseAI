import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const API_BASE_URL = "http://127.0.0.1:8000";

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
const PIE_COLORS = ['#EF4444', '#F59E0B', '#10B981'];

export default function AnalyticsCharts() {
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
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Resumes Parsed (Trend)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="date" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Top Skills Frequency</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={skillsData} layout="vertical" margin={{top: 5, right: 30, left: 40, bottom: 5}}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis type="number" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#F8FAFC'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
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
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({name, value}) => `${name} (${value})`}
              >
                {scoresData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
