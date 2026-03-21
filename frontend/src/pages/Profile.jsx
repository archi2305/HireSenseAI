import React, { useState, useEffect, useRef } from "react";
import { User, Mail, Briefcase, Camera, Shield, Bell, Save, Trash2, Sliders, LogOut, CheckCircle, UploadCloud, Download, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Data State
  const [profile, setProfile] = useState({
    fullname: "",
    email: "",
    company: "",
    job_role: "",
    bio: "",
    avatar_url: "",
    preferred_roles: [],
    preferred_skills: [],
    email_alerts: true,
    weekly_reports: false
  });

  const [activity, setActivity] = useState({
    total_analyzed: 0,
    reports_generated: 0,
    last_login: ""
  });

  // Security Form State
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  
  // Tag input states
  const [roleInput, setRoleInput] = useState("");
  const [skillInput, setSkillInput] = useState("");

  const completionScore = () => {
    const fields = ['fullname', 'email', 'company', 'job_role', 'bio', 'avatar_url'];
    const filled = fields.filter(f => profile[f] && profile[f].length > 0).length;
    return Math.round((filled / fields.length) * 100);
  };

  useEffect(() => {
    fetchProfile();
    fetchActivity();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile/me");
      setProfile(prev => ({ ...prev, ...res.data }));
      setLoading(false);
    } catch (error) {
      toast.error("Failed to load profile data");
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await api.get("/profile/activity");
      setActivity(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileChange = (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setProfile({ ...profile, [e.target.name]: value });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await api.put("/profile/me", {
        fullname: profile.fullname,
        company: profile.company,
        job_role: profile.job_role,
        bio: profile.bio,
        preferred_roles: profile.preferred_roles,
        preferred_skills: profile.preferred_skills,
        email_alerts: profile.email_alerts,
        weekly_reports: profile.weekly_reports
      });
      toast.success("Profile updated seamlessly!");
    } catch (error) {
      toast.error("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const uploadToast = toast.loading("Uploading avatar...");
    try {
      const res = await api.post("/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setProfile(prev => ({ ...prev, avatar_url: res.data.avatar_url }));
      toast.success("Avatar updated!", { id: uploadToast });
      
      // We will ideally refresh user context here, but for now we rely on the component state
      // window.location.reload(); // Force header refresh (optional)
      
    } catch (error) {
      toast.error("Upload failed", { id: uploadToast });
    }
  };

  const handleAddTag = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'role' && roleInput.trim()) {
        setProfile({ ...profile, preferred_roles: [...profile.preferred_roles, roleInput.trim()] });
        setRoleInput("");
      } else if (type === 'skill' && skillInput.trim()) {
        setProfile({ ...profile, preferred_skills: [...profile.preferred_skills, skillInput.trim()] });
        setSkillInput("");
      }
    }
  };

  const removeTag = (type, index) => {
    if (type === 'role') {
      const newRoles = [...profile.preferred_roles];
      newRoles.splice(index, 1);
      setProfile({ ...profile, preferred_roles: newRoles });
    } else {
      const newSkills = [...profile.preferred_skills];
      newSkills.splice(index, 1);
      setProfile({ ...profile, preferred_skills: newSkills });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new_password !== passwords.confirm_password) {
      return toast.error("New passwords do not match!");
    }
    
    // Simulating password API for now since backend route wasn't completely fleshed out for password change yet
    const updateToast = toast.loading("Changing password...");
    try {
      await api.post("/profile/change-password", { 
        current_password: passwords.current_password,
        new_password: passwords.new_password 
      }); 
      toast.success("Password changed securely", { id: updateToast });
      setPasswords({ current_password: "", new_password: "", confirm_password: "" });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to change password", { id: updateToast });
    }
  };

  const getMissingFields = () => {
    const fields = [
      { key: 'bio', label: 'Add a professional bio' },
      { key: 'avatar_url', label: 'Upload a profile picture' },
      { key: 'company', label: 'Specify your company' },
      { key: 'job_role', label: 'Specify your job role' }
    ];
    return fields.filter(f => !profile[f.key]);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pastelBlue"></div>
      </div>
    );
  }

  const score = completionScore();
  const missing = getMissingFields();

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in relative z-10">
      
      {/* Dynamic Header Banner */}
      <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100/50 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-pastelBlue via-lavender to-softPink opacity-80 backdrop-blur-3xl rounded-t-2xl"></div>
        <div className="px-8 pb-8 relative">
          
          <div className="relative -mt-12 mb-4 inline-block group">
            <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-sm border border-slate-100 relative overflow-hidden">
              {profile.avatar_url ? (
                <img src={`http://127.0.0.1:8000${profile.avatar_url}`} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-mint to-emerald-300 flex items-center justify-center">
                  <User size={40} className="text-emerald-900 opacity-50" />
                </div>
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <UploadCloud size={24} className="text-white" />
              </div>
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-[-8px] right-[-8px] bg-white p-2 rounded-full shadow-md border border-slate-100 text-slate-500 hover:text-pastelBlue transition-colors z-10"
            >
              <Camera size={16} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleAvatarUpload}
            />
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">{profile.fullname || "User Profile"}</h1>
              <p className="text-slate-500 font-medium mt-1">
                {profile.job_role || "Role Not Set"} {profile.company && `at ${profile.company}`}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={() => {
                const link = document.createElement('a'); 
                link.href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(profile))}`;
                link.download = "profile_export.json"; link.click();
              }} className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 text-slate-600 hover:bg-slate-100 rounded-xl shadow-sm transition-all text-sm font-semibold border border-slate-200">
                <Download size={16} />
                Export Data
              </button>
              <button 
                onClick={handleSaveProfile}
                disabled={saving}
                className={`flex items-center gap-2 px-6 py-2.5 ${saving ? 'bg-pastelBlue/50' : 'bg-pastelBlue hover:bg-blue-400'} text-white rounded-xl shadow-md shadow-pastelBlue/20 transition-all font-semibold`}
              >
                {saving ? "Saving..." : <><Save size={16} /> Save Profile</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left Nav & Stats */}
        <div className="md:col-span-1 space-y-6">
          
          {/* Profile Completion Card */}
          <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100/50 p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700">Profile Completion</span>
              <span className="text-sm font-bold text-pastelBlue">{score}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 mb-4 overflow-hidden">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${score === 100 ? 'bg-mint' : 'bg-pastelBlue'}`} 
                style={{ width: `${score}%` }}
              ></div>
            </div>
            {missing.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-xs text-slate-400 font-medium mb-2 uppercase tracking-wider">Suggestions</p>
                {missing.slice(0, 2).map((m, i) => (
                  <div key={i} className="flex gap-2 text-xs text-slate-500 items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 flex-shrink-0" />
                    <p>{m.label}</p>
                  </div>
                ))}
              </div>
            )}
            {score === 100 && (
              <div className="flex items-center gap-2 text-sm text-mint font-medium mt-2 bg-mint/10 px-3 py-2 rounded-lg">
                <CheckCircle size={16} /> Stellar profile!
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100/50 p-3 flex flex-col gap-1">
            <button 
              onClick={() => setActiveTab("personal")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-sm ${activeTab === "personal" ? "bg-slate-50 text-slate-900 border border-slate-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-transparent"}`}
            >
              <User size={18} className={activeTab === "personal" ? "text-pastelBlue" : "text-slate-400"} />
              Personal Info
            </button>
            <button 
              onClick={() => setActiveTab("preferences")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-sm ${activeTab === "preferences" ? "bg-slate-50 text-slate-900 border border-slate-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-transparent"}`}
            >
              <Sliders size={18} className={activeTab === "preferences" ? "text-mint" : "text-slate-400"} />
              Recruiter Preferences
            </button>
            <button 
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-sm ${activeTab === "notifications" ? "bg-slate-50 text-slate-900 border border-slate-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-transparent"}`}
            >
              <Bell size={18} className={activeTab === "notifications" ? "text-softPink" : "text-slate-400"} />
              Notifications
            </button>
            <button 
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-sm ${activeTab === "security" ? "bg-slate-50 text-slate-900 border border-slate-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-transparent"}`}
            >
              <Shield size={18} className={activeTab === "security" ? "text-lavender" : "text-slate-400"} />
              Security
            </button>
          </div>

          <button onClick={() => { logout(); navigate("/login"); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 font-semibold rounded-xl transition-colors border border-red-100 text-sm shadow-sm bg-white">
            <LogOut size={16} /> Logout out of session
          </button>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-3">
          
          {/* PERSONAL INFO TAB */}
          {activeTab === "personal" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100/50 p-8 space-y-6">
                <h2 className="text-lg font-bold text-slate-800 mb-2">Personal Information</h2>
                <p className="text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">Update your account details and professional identity shown throughout the dashboard.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User size={16} className="text-slate-400" />
                      </div>
                      <input type="text" name="fullname" value={profile.fullname} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-pastelBlue/50 transition-all focus:bg-white text-sm" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Email Address (Read Only)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail size={16} className="text-slate-400" />
                      </div>
                      <input type="email" name="email" value={profile.email} disabled className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed text-sm" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Company</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Briefcase size={16} className="text-slate-400" />
                      </div>
                      <input type="text" name="company" placeholder="e.g Acme Corp" value={profile.company} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-pastelBlue/50 transition-all focus:bg-white text-sm" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Job Role</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User size={16} className="text-slate-400" />
                      </div>
                      <input type="text" name="job_role" placeholder="e.g Senior Tech Recruiter" value={profile.job_role} onChange={handleProfileChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-pastelBlue/50 transition-all focus:bg-white text-sm" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-4">
                  <div className="flex justify-between">
                    <label className="text-sm font-semibold text-slate-700">Professional Bio</label>
                    <span className="text-xs text-slate-400 font-medium">{profile.bio ? profile.bio.length : 0}/200</span>
                  </div>
                  <textarea 
                    name="bio"
                    value={profile.bio || ""}
                    onChange={handleProfileChange}
                    maxLength={200}
                    rows={4}
                    placeholder="Write a short summary about yourself..."
                    className="w-full p-4 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-pastelBlue/50 transition-all focus:bg-white text-sm resize-none"
                  />
                </div>
              </div>

              {/* Activity Stats Panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-pastelBlue/10 text-pastelBlue flex items-center justify-center mb-3">
                    <FileText size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">{activity.total_analyzed}</h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Resumes Analyzed</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-mint/10 text-mint flex items-center justify-center mb-3">
                    <CheckCircle size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800">{activity.reports_generated}</h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Reports Generated</p>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-xl bg-lavender/10 text-lavender flex items-center justify-center mb-3">
                    <LogOut size={24} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 px-2 line-clamp-2">
                    {activity.last_login ? new Date(activity.last_login).toLocaleString("en-IN", { timeZone: 'Asia/Kolkata', dateStyle:'short', timeStyle:'short' }) : "Just Now"}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">Last Login (IST)</p>
                </div>
              </div>
            </div>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === "preferences" && (
            <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100/50 p-8 space-y-8 animate-fade-in">
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-2">Recruitment Preferences</h2>
                <p className="text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">Set up tag algorithms to instantly filter matched candidates that fit your company's generic needs.</p>
              </div>

              {/* Preferred Roles */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-700">Preferred Roles</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.preferred_roles.map((role, i) => (
                    <span key={i} className="px-3 py-1.5 bg-lavender/10 border border-lavender/20 text-lavender rounded-lg text-xs font-semibold flex items-center gap-2 transition-all hover:bg-lavender/20">
                      {role}
                      <button onClick={() => removeTag('role', i)} className="hover:text-red-500 transition-colors">×</button>
                    </span>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  onKeyDown={(e) => handleAddTag(e, 'role')}
                  placeholder="Type a role and press Enter (e.g., Frontend Engineer)" 
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-lavender/50"
                />
              </div>

              <div className="bg-slate-50 h-px w-full my-6"></div>

              {/* Preferred Skills */}
              <div className="space-y-4">
                <label className="text-sm font-semibold text-slate-700">Crucial Technical Skills</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.preferred_skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-pastelBlue/10 border border-pastelBlue/20 text-pastelBlue rounded-lg text-xs font-semibold flex items-center gap-2 transition-all hover:bg-pastelBlue/20">
                      {skill}
                      <button onClick={() => removeTag('skill', i)} className="hover:text-red-500 transition-colors">×</button>
                    </span>
                  ))}
                </div>
                <input 
                  type="text" 
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => handleAddTag(e, 'skill')}
                  placeholder="Type a required technical skill and press Enter (e.g., React, Python)" 
                  className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-pastelBlue/50"
                />
              </div>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100/50 p-8 space-y-6 animate-fade-in">
              <h2 className="text-lg font-bold text-slate-800 mb-2">Notification Settings</h2>
              <p className="text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">Control what emails and system alerts you receive from HireSense AI.</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Email Alerts</h4>
                    <p className="text-xs text-slate-500 mt-1">Receive an email instantly when a new High Match candidate is found.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="email_alerts" checked={profile.email_alerts} onChange={handleProfileChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pastelBlue"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">Weekly Summary Reports</h4>
                    <p className="text-xs text-slate-500 mt-1">Receive a digest every Monday summarizing your total pipeline analytics.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="weekly_reports" checked={profile.weekly_reports} onChange={handleProfileChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-lavender"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-slate-100/50 p-8 space-y-6">
                <h2 className="text-lg font-bold text-slate-800 mb-2">Change Password</h2>
                <p className="text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">Ensure your account uses a long, strong password to remain secure.</p>
                
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 block">Current Password</label>
                    <input 
                      type="password" 
                      value={passwords.current_password}
                      onChange={(e) => setPasswords({...passwords, current_password: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-pastelBlue/50 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 block">New Password</label>
                    <input 
                      type="password" 
                      value={passwords.new_password}
                      onChange={(e) => setPasswords({...passwords, new_password: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-pastelBlue/50 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5 mb-6">
                    <label className="text-sm font-semibold text-slate-700 block">Confirm New Password</label>
                    <input 
                      type="password" 
                      value={passwords.confirm_password}
                      onChange={(e) => setPasswords({...passwords, confirm_password: e.target.value})}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-lavender/50 text-sm"
                    />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl transition-all flex justify-center items-center gap-2 mt-4 text-sm shadow-sm">
                    <Lock size={16} /> Update Password
                  </button>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50/50 rounded-2xl border border-red-100 p-8 space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-red-800">Danger Zone</h3>
                <p className="text-sm text-red-600/80">Permanently delete your account and all associated dashboard metadata. This completely wipes all your resume configurations.</p>
                <button className="px-6 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-xl transition-all flex items-center gap-2 text-sm">
                  <Trash2 size={16} /> Delete Account
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
