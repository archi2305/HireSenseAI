import React from 'react';
import SkillBadge from "./SkillBadge";
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Briefcase, GraduationCap, CheckCircle, AlertTriangle } from 'lucide-react';

function ATSResultCard({ result }) {
  if (!result) return null;

  const score = result.ats_score ?? 0;
  const matched = result.matched_skills || [];
  const missing = result.missing_skills || [];

  const pathColor =
    score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";

  return (
    <div className="mt-8 space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-3 gap-6">
        
        <div className="col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-softPink to-pastelBlue rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <h3 className="text-sm font-bold text-slate-700 mb-4 z-10 text-center uppercase tracking-wider">ATS Match Score</h3>
          <div className="w-32 h-32 z-10">
            <CircularProgressbar
              value={score}
              text={`${score}%`}
              styles={buildStyles({
                pathColor: pathColor,
                textColor: '#1E293B',
                trailColor: '#F1F5F9',
                textSize: '22px',
                strokeLinecap: 'round',
                pathTransitionDuration: 1.5,
              })}
            />
          </div>
          <p className="text-xs text-slate-500 mt-4 z-10 text-center">Based on keyword & role alignment</p>
        </div>

        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Parsed Data Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100/50">
              <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600 shadow-sm"><Briefcase size={20} /></div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Experience</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{result.parsed_experience || "3+ Years relevant professional experience parsed from document."}</p>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100/50">
              <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600 shadow-sm"><GraduationCap size={20} /></div>
              <div>
                <p className="text-sm font-semibold text-slate-700">Education</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{result.parsed_education || "Bachelor's Degree or higher qualification detected."}</p>
              </div>
            </div>

            <div className="sm:col-span-2 flex gap-4 items-start bg-slate-50 p-4 rounded-xl border border-slate-100/50">
              <div className="bg-sky-100 p-2.5 rounded-xl text-sky-600 shadow-sm"><CheckCircle size={20} /></div>
              <div className="w-full">
                <p className="text-sm font-semibold text-slate-700 mb-2.5">Detected Skills</p>
                <div className="flex flex-wrap gap-2">
                  {matched.length === 0 ? (
                    <span className="text-xs text-slate-500">No skills detected.</span>
                  ) : (
                    matched.map((skill) => <SkillBadge key={skill} label={skill} type="matched" />)
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 hover:shadow-md transition-all duration-300 relative">
           <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
             <AlertTriangle size={18} className="text-rose-500" /> Missing Skills
           </h3>
           <div className="flex flex-wrap gap-2 relative z-10">
             {missing.length === 0 ? (
               <p className="text-sm text-slate-600">Great match – no mandatory missing skills found.</p>
             ) : (
               missing.map((skill) => <SkillBadge key={skill} label={skill} type="missing" />)
             )}
           </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-sm border border-indigo-100 p-6 hover:shadow-md transition-all duration-300">
          <h3 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
            <CheckCircle size={18} className="text-indigo-600" /> AI Suggestions & Improvements
          </h3>
          <div className="bg-white/70 p-4 rounded-xl border border-white/60 backdrop-blur-sm shadow-sm">
            <p className="text-sm text-indigo-800 leading-relaxed whitespace-pre-line">
              {result.suggestions || "Review the missing skills and integrate them natively into your experience section context."}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ATSResultCard;
