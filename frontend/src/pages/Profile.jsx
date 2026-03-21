import React, { useState } from "react";
import { User, Mail, Briefcase, Camera, Shield, Bell, Save } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Profile() {
  const { user } = useAuth();
  
  // Local state for edits
  const [formData, setFormData] = useState({
    fullname: user?.fullname || "Recruiter Name",
    email: user?.email || "recruiter@hiresense.ai",
    company: "Acme Corp",
    role: "Senior Tech Recruiter",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Banner */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-pastelBlue via-lavender to-softPink opacity-80"></div>
        <div className="px-8 pb-8 relative">
          
          {/* Avatar Avatar */}
          <div className="relative -mt-12 mb-4 inline-block">
            <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-sm border border-slate-100">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-mint to-emerald-300 flex items-center justify-center">
                <User size={40} className="text-emerald-900 opacity-50" />
              </div>
            </div>
            <button className="absolute bottom-[-8px] right-[-8px] bg-white p-2 rounded-full shadow-md border border-slate-100 text-slate-500 hover:text-pastelBlue transition-colors">
              <Camera size={16} />
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{formData.fullname}</h1>
              <p className="text-slate-500 font-medium">{formData.role} at {formData.company}</p>
            </div>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-sm transition-all focus:ring-2 focus:ring-slate-200 active:scale-95"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Nav details */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col gap-2">
            <button className="flex items-center gap-3 px-4 py-3 bg-slate-50 text-slate-800 rounded-xl font-medium transition-colors">
              <User size={18} className="text-pastelBlue" />
              Personal Info
            </button>
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl font-medium transition-colors">
              <Shield size={18} className="text-lavender" />
              Security
            </button>
            <button className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl font-medium transition-colors">
              <Bell size={18} className="text-softPink" />
              Notifications
            </button>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-50 pb-4">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-600 block">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-pastelBlue/50 transition-all focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-600 block">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-pastelBlue/50 transition-all focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-600 block">Company</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-pastelBlue/50 transition-all focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-600 block">Job Role</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-pastelBlue/50 transition-all focus:bg-white"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
