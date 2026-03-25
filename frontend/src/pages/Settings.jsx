import React, { useState, useEffect } from "react"
import { 
  User, Shield, Bell, Zap, Database, Save, LogOut, Download, Trash2, Key, CheckCircle, Moon, Palette as ColorIcon, ChevronRight
} from "lucide-react"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

export default function Settings() {
  const { user, logout } = useAuth()
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

  const updatePassword = async (e) => {
    e.preventDefault()
    if (passwords.new_password !== passwords.confirm_password) return toast.error("Key mismatch.")
    const toastId = toast.loading("Re-securing account...")
    try {
      await api.post("/profile/change-password", {
        current_password: passwords.current_password, new_password: passwords.new_password
      })
      toast.success("Security updated.", { id: toastId })
      setPasswords({ current_password: "", new_password: "", confirm_password: "" })
    } catch (error) { toast.error("Update failed.", { id: toastId }) }
  }

  const testApiKey = async () => {
    if (!settings.openai_api_key) return toast.error("Key required.")
    setTestingKey(true)
    try {
      await api.put("/settings", { openai_api_key: settings.openai_api_key })
      const res = await api.post("/settings/test-api-key")
      if (res.data.status === "ok") {
        toast.success("Intelligence Linked.")
        setKeyStatus('connected')
      } else {
        toast.error("Invalid Key.")
        setKeyStatus('disconnected')
      }
    } catch {
      setKeyStatus('disconnected')
    } finally { setTestingKey(false) }
  }

  const TABS = [
    { id: "account", label: "My Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Alerts", icon: Bell },
    { id: "integrations", label: "Intelligence", icon: Zap },
    { id: "data", label: "Inventory", icon: Database },
  ]

  if (loading) return null

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row gap-0 h-full w-full bg-theme-bg">
      
      {/* Settings Navigation */}
      <div className="w-full md:w-[240px] shrink-0 border-r border-theme-border bg-theme-sidebar/10 p-6 space-y-8 h-full">
        <div>
           <h2 className="text-[11px] font-bold text-theme-textSecondary uppercase tracking-[0.2em] mb-4 opacity-50">Settings</h2>
           <nav className="flex flex-col gap-1">
             {TABS.map((tab) => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-all group ${
                   activeTab === tab.id 
                     ? "bg-theme-surface text-theme-text shadow-linear border border-theme-border" 
                     : "text-theme-textSecondary hover:text-theme-text hover:bg-theme-hover/50"
                 }`}
               >
                 <tab.icon size={14} className={activeTab === tab.id ? "text-theme-accent" : "text-theme-textSecondary group-hover:text-theme-text"} />
                 <span>{tab.label}</span>
                 {activeTab === tab.id && <ChevronRight size={12} className="ml-auto opacity-30" />}
               </button>
             ))}
           </nav>
        </div>
      </div>

      {/* Settings Viewport */}
      <div className="flex-1 p-8 overflow-y-auto bg-theme-bg">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-xl"
          >
            {activeTab === "account" && (
              <div className="space-y-8">
                <div>
                   <h1 className="text-[22px] font-bold text-theme-text tracking-tight mb-1">General Settings</h1>
                   <p className="text-[13px] text-theme-textSecondary leading-relaxed italic">Information provided here reflects across your workspace.</p>
                </div>
                
                <div className="space-y-5">
                   <div className="space-y-2">
                      <label className="text-[11px] font-bold text-theme-textSecondary uppercase tracking-widest">Legal Name</label>
                      <input type="text" name="fullname" value={settings.fullname} onChange={handleChange} className="linear-input w-full px-3 py-2 border-theme-border/60" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 text-theme-textSecondary opacity-60">
                         <label className="text-[11px] font-bold uppercase tracking-widest">Auth Identifier</label>
                         <input type="email" value={settings.email} disabled className="linear-input w-full bg-theme-bg border-theme-border/30 cursor-not-allowed" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[11px] font-bold text-theme-textSecondary uppercase tracking-widest">Active Org</label>
                         <input type="text" name="company" value={settings.company || ""} onChange={handleChange} className="linear-input w-full" />
                      </div>
                   </div>
                </div>

                <div className="pt-4">
                   <button onClick={saveSettings} disabled={saving} className="linear-btn-primary px-6 py-2 shadow-accent-glow">
                      {saving ? "Syncing..." : "Update Workspace"}
                   </button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-8">
                <div>
                   <h1 className="text-[22px] font-bold text-theme-text tracking-tight mb-1">Access Protocol</h1>
                   <p className="text-[13px] text-theme-textSecondary leading-relaxed italic">Rotation of access keys keeps your candidate database secure.</p>
                </div>
                
                <form onSubmit={updatePassword} className="space-y-5">
                  <div className="space-y-2">
                     <label className="text-[11px] font-bold text-theme-textSecondary uppercase tracking-widest">Current Key</label>
                     <input type="password" name="current_password" required value={passwords.current_password} onChange={handlePasswordChange} className="linear-input w-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-theme-textSecondary uppercase tracking-widest">New Protocol</label>
                       <input type="password" name="new_password" required minLength="6" value={passwords.new_password} onChange={handlePasswordChange} className="linear-input w-full" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[11px] font-bold text-theme-textSecondary uppercase tracking-widest">Verify New</label>
                       <input type="password" name="confirm_password" required minLength="6" value={passwords.confirm_password} onChange={handlePasswordChange} className="linear-input w-full" />
                    </div>
                  </div>
                  <button type="submit" className="linear-btn-secondary px-6 py-2">
                    Rotate Password
                  </button>
                </form>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-8">
                <div>
                   <h1 className="text-[22px] font-bold text-theme-text tracking-tight mb-1">Event Routing</h1>
                   <p className="text-[13px] text-theme-textSecondary leading-relaxed italic">Configure automated alerts for pipeline velocity.</p>
                </div>

                <div className="space-y-px rounded-md border border-theme-border overflow-hidden divide-y divide-theme-border">
                  {[
                    { name: "email_alerts", title: "Real-time Alerts", desc: "Push notifications for new match discoveries." },
                    { name: "resume_match_alerts", title: "Priority Thresholds", desc: "Trigger alerts when candidate exceeds 85% match." },
                    { name: "weekly_reports", title: "Analytics Summary", desc: "Consolidated performance digest every Monday." }
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between p-4 bg-theme-surface/30">
                      <div>
                        <p className="text-[13px] font-bold text-theme-text mb-0.5">{item.title}</p>
                        <p className="text-[11px] text-theme-textSecondary font-medium opacity-60 italic">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" name={item.name} checked={settings[item.name]} onChange={handleChange} />
                        <div className="w-8 h-4 bg-theme-sidebar border border-theme-border rounded-full peer peer-checked:bg-theme-accent peer-checked:border-theme-accent after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-theme-textSecondary/50 peer-checked:after:bg-white peer-checked:after:translate-x-4 after:rounded-full after:h-3 after:w-3 after:transition-all"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <button onClick={saveSettings} disabled={saving} className="linear-btn-primary px-6 py-2 shadow-accent-glow">
                  Save Logic
                </button>
              </div>
            )}

            {activeTab === "integrations" && (
              <div className="space-y-8">
                <div>
                   <h1 className="text-[22px] font-bold text-theme-text tracking-tight mb-1">Intelligence Core</h1>
                   <p className="text-[13px] text-theme-textSecondary leading-relaxed italic">Manage the LLM identifiers that power your scoring engine.</p>
                </div>

                <div className="p-6 bg-theme-surface border border-theme-border rounded-md shadow-linear relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                     <Zap size={64} />
                  </div>
                  <h4 className="text-[14px] font-bold text-theme-text mb-1 flex items-center gap-2">
                    OpenAI Integration
                    {keyStatus === 'connected' && <span className="px-1.5 py-0.5 bg-success/10 text-success text-[10px] rounded border border-success/20 uppercase font-black">Linked</span>}
                  </h4>
                  <p className="text-[12px] text-theme-textSecondary mb-6 font-medium italic opacity-70">Requires model gpt-4 or gpt-3.5 access.</p>
                  
                  <div className="flex gap-2">
                    <input 
                      type="password" name="openai_api_key" 
                      value={settings.openai_api_key} onChange={handleChange} 
                      placeholder="sk-..."
                      className="linear-input flex-1 px-3 py-2 font-mono"
                    />
                    <button onClick={testApiKey} disabled={testingKey} className="linear-btn-secondary px-4 py-2 shrink-0">
                      {testingKey ? "Linking..." : "Test Link"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "data" && (
              <div className="space-y-8">
                <div>
                   <h1 className="text-[22px] font-bold text-theme-text tracking-tight mb-1">Inventory Management</h1>
                   <p className="text-[13px] text-theme-textSecondary leading-relaxed italic">Export your dataset or perform hard-state removals.</p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 border border-theme-border rounded-md hover:bg-theme-sidebar/20 transition-colors flex items-center justify-between cursor-pointer group">
                    <div>
                      <h4 className="text-[13px] font-bold text-theme-text">Dataset Export (.json)</h4>
                      <p className="text-[11px] text-theme-textSecondary font-medium opacity-60">Generate a comprehensive dump of all matched candidates.</p>
                    </div>
                    <Download size={16} className="text-theme-textSecondary group-hover:text-theme-text transition-colors" />
                  </div>
                  
                  <div className="p-4 border border-error/20 bg-error/5 rounded-md hover:border-error/40 transition-all flex items-center justify-between cursor-pointer group">
                    <div>
                      <h4 className="text-[13px] font-bold text-error">Clear Historical Cache</h4>
                      <p className="text-[11px] text-error/60 font-medium">Permanently destroy all parsing results and weighted models.</p>
                    </div>
                    <Trash2 size={16} className="text-error/40 group-hover:text-error transition-colors" />
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
