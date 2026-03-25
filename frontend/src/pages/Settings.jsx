import React, { useState, useEffect } from "react"
import { 
  User, Shield, Bell, Zap, Database, Save, LogOut, Download, Trash2, Key, CheckCircle, Moon, Palette as ColorIcon, ChevronRight, Target, ShieldCheck, Mail, Activity
} from "lucide-react"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import SectionReveal from "../components/SectionReveal"

export default function Settings() {
  const { user, logout } = useAuth()
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState("account")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testingKey, setTestingKey] = useState(false)
  const [keyStatus, setKeyStatus] = useState(null)

  const [settings, setSettings] = useState({
    fullname: "", email: "", company: "", job_role: "",
    email_alerts: true, weekly_reports: false, resume_match_alerts: true,
    openai_api_key: "", dark_mode: true, accent_color: "indigo"
  })

  const [passwords, setPasswords] = useState({
    current_password: "", new_password: "", confirm_password: ""
  })

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings")
      setSettings(res.data)
      setKeyStatus(res.data.openai_api_key ? 'connected' : 'disconnected')
    } catch { toast.error("Failed to load settings.") } finally { setLoading(false) }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handlePasswordChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value })

  const saveSettings = async () => {
    setSaving(true)
    const toastId = toast.loading("Syncing preferences...")
    try {
      await api.put("/settings", settings)
      toast.success("Preferences updated.", { id: toastId })
    } catch { toast.error("Sync failed.", { id: toastId }) } finally { setSaving(false) }
  }

  const TABS = [
    { id: "account", label: "Profile Interface", icon: User },
    { id: "security", label: "Access Protocol", icon: Shield },
    { id: "notifications", label: "Event Routing", icon: Activity },
    { id: "integrations", label: "Intelligence Core", icon: Zap },
    { id: "data", label: "Data Inventory", icon: Database },
  ]

  if (loading) return null

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row gap-0 h-full w-full bg-theme-bg font-sans overflow-hidden">
      
      {/* Settings Navigation */}
      <div className="w-full md:w-[280px] shrink-0 border-r border-theme-border bg-theme-sidebar/20 p-8 space-y-12 h-full transition-colors duration-500 relative">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-theme-accent/5 blur-3xl pointer-events-none" />
        
        <div>
           <div className="flex items-center gap-2 text-theme-accent font-black text-[10px] uppercase tracking-[0.2em] mb-4 opacity-70">
              <Target size={12} />
              <span>Control Panel</span>
           </div>
           <nav className="flex flex-col gap-2 relative z-10">
             {TABS.map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-[14px] font-bold transition-all group relative overflow-hidden ${
                   activeTab === tab.id 
                     ? "text-theme-text shadow-premium border border-theme-border bg-theme-surface" 
                     : "text-theme-textSecondary hover:text-theme-text hover:bg-theme-hover"
                 }`}
               >
                 {activeTab === tab.id && (
                   <motion.div 
                     layoutId="settings-active"
                     className="absolute inset-0 bg-theme-accent/5"
                     transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                   />
                 )}
                 <tab.icon size={18} className={`relative z-10 transition-colors ${activeTab === tab.id ? "text-theme-accent shadow-accent-glow" : "text-theme-textSecondary group-hover:text-theme-text"}`} />
                 <span className="relative z-10">{tab.label}</span>
                 {activeTab === tab.id && <ChevronRight size={14} className="ml-auto opacity-30 relative z-10" />}
               </button>
             ))}
           </nav>
        </div>
      </div>

      {/* Settings Viewport */}
      <div className="flex-1 p-12 overflow-y-auto bg-theme-bg relative overflow-x-hidden">
        {/* Background Mesh Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-theme-accent/5 blur-[120px] -mr-32 -mt-32 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl relative z-10"
          >
            {activeTab === "account" && (
              <div className="space-y-10">
                <div>
                   <h1 className="text-[32px] font-black text-theme-text tracking-tighter mb-2 italic">Profile <span className="text-theme-accent">Interface</span></h1>
                   <p className="text-[14px] text-theme-textSecondary leading-relaxed font-medium">Information provided here reflects across your collaborative workspace.</p>
                </div>
                
                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-theme-textSecondary uppercase tracking-[0.2em] opacity-50">Legal Full Name</label>
                      <input type="text" name="fullname" value={settings.fullname} onChange={handleChange} className="linear-input w-full px-4 py-3 border-theme-border/60 focus:bg-theme-surface" />
                   </div>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[11px] font-black uppercase tracking-[0.2em] opacity-30">Auth Identifier</label>
                         <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-theme-border bg-theme-bg/50 opacity-60">
                            <Mail size={16} className="text-theme-textSecondary" />
                            <span className="text-[13px] font-bold text-theme-textSecondary">{settings.email}</span>
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[11px] font-black text-theme-textSecondary uppercase tracking-[0.2em] opacity-50">Active Org Index</label>
                         <input type="text" name="company" value={settings.company || ""} onChange={handleChange} className="linear-input w-full px-4 py-3 focus:bg-theme-surface" />
                      </div>
                   </div>
                </div>

                <div className="pt-8">
                   <button onClick={saveSettings} disabled={saving} className="linear-btn-primary px-8 py-3.5 shadow-accent-glow flex items-center gap-2 group">
                      <Zap size={16} fill="white" />
                      <span className="text-[14px] font-black uppercase tracking-widest">{saving ? "Syncing..." : "Update Workspace Protocol"}</span>
                   </button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-10">
                <div>
                   <h1 className="text-[32px] font-black text-theme-text tracking-tighter mb-2 italic">Access <span className="text-theme-accent">Protocol</span></h1>
                   <p className="text-[14px] text-theme-textSecondary leading-relaxed font-medium">Rotation of encryption keys ensures the integrity of your candidate library.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-theme-surface/50 border border-theme-border backdrop-blur-sm relative group overflow-hidden">
                     <div className="absolute top-0 right-0 p-6 opacity-5">
                        <Shield size={64} />
                     </div>
                     <h4 className="text-[15px] font-black text-theme-text mb-4 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-success" />
                        Multi-Factor Security Active
                     </h4>
                     <p className="text-[12px] text-theme-textSecondary font-medium leading-relaxed opacity-70 mb-6 italic">Secure rotation is recommended every 90 days. Next scheduled rotation: April 15, 2026.</p>
                     
                     <button className="linear-btn-secondary px-6 py-2.5 flex items-center gap-2 group">
                        <Key size={14} />
                        <span className="text-[13px] font-bold uppercase tracking-widest">Generate New key</span>
                     </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-10">
                <div>
                   <h1 className="text-[32px] font-black text-theme-text tracking-tighter mb-2 italic">Event <span className="text-theme-accent">Routing</span></h1>
                   <p className="text-[14px] text-theme-textSecondary leading-relaxed font-medium">Configure high-fidelity automated alerts for pipeline velocity shifts.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "email_alerts", title: "Real-time Neural Alerts", desc: "Push notifications for new match discoveries." },
                    { name: "resume_match_alerts", title: "Priority Match Thresholds", desc: "Trigger alerts when candidate efficiency exceeds 85%." },
                    { name: "weekly_reports", title: "Analytics Summary Extract", desc: "Consolidated performance deep-dive every Monday." }
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-6 rounded-2xl bg-theme-surface/40 hover:bg-theme-surface border border-theme-border transition-all duration-300 group">
                      <div className="max-w-md">
                        <div className="flex items-center gap-2 mb-1">
                           <p className="text-[14px] font-black text-theme-text group-hover:text-theme-accent transition-colors">{item.title}</p>
                           {settings[item.name] && <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />}
                        </div>
                        <p className="text-[12px] text-theme-textSecondary font-medium opacity-60 italic leading-snug">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" name={item.name} checked={settings[item.name]} onChange={handleChange} />
                        <div className="w-10 h-5 bg-theme-sidebar border border-theme-border rounded-full peer peer-checked:bg-theme-accent peer-checked:border-theme-accent after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-theme-textSecondary peer-checked:after:bg-white peer-checked:after:translate-x-5 after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <button onClick={saveSettings} disabled={saving} className="linear-btn-primary px-8 py-3.5 shadow-accent-glow flex items-center gap-2 group">
                  <Activity size={16} />
                  <span className="text-[14px] font-black uppercase tracking-widest">Save Event Logic</span>
                </button>
              </div>
            )}

            {activeTab === "integrations" && (
              <div className="space-y-10">
                <div>
                   <h1 className="text-[32px] font-black text-theme-text tracking-tighter mb-2 italic">Intelligence <span className="text-theme-accent">Core</span></h1>
                   <p className="text-[14px] text-theme-textSecondary leading-relaxed font-medium">Manage the core LLM identifiers that power your semantic scoring engine.</p>
                </div>

                <div className="p-8 bg-theme-surface border border-theme-border rounded-3xl shadow-premium relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                     <Zap size={128} />
                  </div>
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-10 h-10 rounded-xl bg-theme-accent flex items-center justify-center text-white shadow-accent-glow">
                        <Zap size={20} fill="white" />
                     </div>
                     <div>
                        <h4 className="text-[16px] font-black text-theme-text flex items-center gap-3">
                           OpenAI Protocol 4.0
                           {keyStatus === 'connected' && <span className="px-2 py-0.5 bg-success/10 text-success text-[10px] rounded-full border border-success/20 uppercase font-black tracking-widest">Synchronized</span>}
                        </h4>
                        <p className="text-[12px] text-theme-textSecondary font-bold italic opacity-60">Deep semantic vectoring engine.</p>
                     </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <input 
                      type="password" name="openai_api_key" 
                      value={settings.openai_api_key} onChange={handleChange} 
                      placeholder="sk-neural-..."
                      className="linear-input flex-1 px-4 py-3 font-mono text-[13px] bg-theme-bg"
                    />
                    <button onClick={saveSettings} disabled={testingKey} className="linear-btn-secondary px-6 shrink-0 group">
                      <Zap size={15} className="group-hover:animate-pulse" />
                      <span className="text-[13px] font-black uppercase tracking-widest">Link</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "data" && (
              <div className="space-y-10">
                <div>
                   <h1 className="text-[32px] font-black text-theme-text tracking-tighter mb-2 italic">Data <span className="text-theme-accent">Inventory</span></h1>
                   <p className="text-[14px] text-theme-textSecondary leading-relaxed font-medium">Export high-fidelity datasets or perform recursive core deletions.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="p-6 border border-theme-border rounded-2xl hover:bg-theme-surface transition-all duration-300 flex items-center justify-between cursor-pointer group shadow-sm hover:shadow-premium">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-theme-bg border border-theme-border flex items-center justify-center text-theme-textSecondary group-hover:text-theme-accent transition-colors">
                          <Download size={18} />
                       </div>
                       <div>
                         <h4 className="text-[14px] font-black text-theme-text group-hover:text-theme-accent transition-colors">Dataset Export (.json)</h4>
                         <p className="text-[11px] text-theme-textSecondary font-bold opacity-60 uppercase tracking-widest">Full recovery dump of matched nodes.</p>
                       </div>
                    </div>
                    <ChevronRight size={18} className="text-theme-textSecondary opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                  
                  <div className="p-6 border border-error/10 bg-error/[0.02] rounded-2xl hover:bg-error/[0.05] hover:border-error/30 transition-all duration-300 flex items-center justify-between cursor-pointer group shadow-sm">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-theme-bg border border-error/10 flex items-center justify-center text-error opacity-40 group-hover:opacity-100 transition-opacity">
                          <Trash2 size={18} />
                       </div>
                       <div>
                         <h4 className="text-[14px] font-black text-error">Purge Intelligence History</h4>
                         <p className="text-[11px] text-error/60 font-bold uppercase tracking-widest">Recursive destruction of all parsing models.</p>
                       </div>
                    </div>
                    <ChevronRight size={18} className="text-error/30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
