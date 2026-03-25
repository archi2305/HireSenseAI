import React, { useState, useEffect } from "react"
import { 
  User, Shield, Bell, Zap, Palette, Database, Save, LogOut, Download, Trash2, Key, CheckCircle, Moon, Palette as ColorIcon
} from "lucide-react"
import api from "../services/api"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"

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
    const toastId = toast.loading("Saving settings...")
    try {
      await api.put("/settings", settings)
      toast.success("Settings saved successfully!", { id: toastId })
    } catch { toast.error("Failed to save settings.", { id: toastId }) } finally { setSaving(false) }
  }

  const updatePassword = async (e) => {
    e.preventDefault()
    if (passwords.new_password !== passwords.confirm_password) return toast.error("New passwords do not match.")
    const toastId = toast.loading("Updating password...")
    try {
      await api.post("/profile/change-password", {
        current_password: passwords.current_password, new_password: passwords.new_password
      })
      toast.success("Password updated securely!", { id: toastId })
      setPasswords({ current_password: "", new_password: "", confirm_password: "" })
    } catch (error) { toast.error(error.response?.data?.detail || "Failed to update password.", { id: toastId }) }
  }

  const testApiKey = async () => {
    if (!settings.openai_api_key) return toast.error("Please enter an API key first.")
    await api.put("/settings", { openai_api_key: settings.openai_api_key })
    setTestingKey(true)
    const toastId = toast.loading("Testing connection...")
    try {
      const res = await api.post("/settings/test-api-key")
      if (res.data.status === "ok") {
        toast.success(res.data.message, { id: toastId })
        setKeyStatus('connected')
      } else {
        toast.error(res.data.message, { id: toastId })
        setKeyStatus('disconnected')
      }
    } catch {
      toast.error("API test request failed.", { id: toastId })
      setKeyStatus('disconnected')
    } finally { setTestingKey(false) }
  }

  const exportData = async () => {
    try {
      const res = await api.get("/settings/export-data")
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2))
      const downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", "HireSense_Data_Export.json")
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
      toast.success("Data exported successfully!")
    } catch { toast.error("Export failed.") }
  }

  const clearHistory = async () => {
    if(!window.confirm("Clear all historical analysis data? This is irreversible.")) return
    try {
      await api.delete("/settings/clear-history")
      toast.success("History cleared completely.")
    } catch { toast.error("Failed to clear history.") }
  }

  const TABS = [
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "integrations", label: "Integrations", icon: Zap },
    { id: "data", label: "Data & Privacy", icon: Database },
  ]

  if (loading) return null

  return (
    <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 pt-4 w-full h-full">
      
      {/* Sidebar Tabs */}
      <div className="w-full md:w-56 shrink-0 h-max sticky top-20">
        <h2 className="text-[14px] font-semibold text-theme-textSecondary uppercase tracking-widest px-3 mb-4">Settings</h2>
        <nav className="flex flex-col gap-0.5">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-150 ${
                activeTab === tab.id 
                  ? "bg-theme-sidebar text-theme-text shadow-sm" 
                  : "text-theme-textSecondary hover:bg-theme-sidebar/50 hover:text-theme-text"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-theme-text" : "text-theme-textSecondary"}`} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Areas */}
      <div className="flex-1 flex flex-col pb-20">
        
        {/* 1. ACCOUNT */}
        {activeTab === "account" && (
          <div className="space-y-6 animate-fade-in w-full max-w-2xl">
            <div className="border-b border-theme-border pb-4">
              <h3 className="text-[18px] font-semibold text-theme-text">Profile Settings</h3>
              <p className="text-[13px] text-theme-textSecondary mt-1">Manage your personal information and roles.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-theme-textSecondary uppercase tracking-wider">Full Name</label>
                <input type="text" name="fullname" value={settings.fullname} onChange={handleChange} className="w-full px-3 py-1.5 bg-theme-sidebar border border-theme-border rounded-md focus:border-theme-accent focus:outline-none transition-all duration-150 text-[13px] text-theme-text" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-theme-textSecondary uppercase tracking-wider">Email Address</label>
                <input type="email" value={settings.email} disabled className="w-full px-3 py-1.5 bg-theme-bg/50 border border-theme-border/50 text-theme-textSecondary rounded-md cursor-not-allowed text-[13px]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-theme-textSecondary uppercase tracking-wider">Company</label>
                <input type="text" name="company" value={settings.company || ""} onChange={handleChange} className="w-full px-3 py-1.5 bg-theme-sidebar border border-theme-border rounded-md focus:border-theme-accent focus:outline-none transition-all duration-150 text-[13px] text-theme-text" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-theme-textSecondary uppercase tracking-wider">Job Role</label>
                <input type="text" name="job_role" value={settings.job_role || ""} onChange={handleChange} className="w-full px-3 py-1.5 bg-theme-sidebar border border-theme-border rounded-md focus:border-theme-accent focus:outline-none transition-all duration-150 text-[13px] text-theme-text" />
              </div>
            </div>
            
            <div className="pt-4 flex">
              <button onClick={saveSettings} disabled={saving} className="px-4 py-1.5 bg-theme-text text-theme-bg text-[13px] font-semibold rounded-md hover:bg-gray-200 transition-all duration-150 disabled:opacity-50">
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        )}

        {/* 2. SECURITY */}
        {activeTab === "security" && (
          <div className="space-y-6 animate-fade-in w-full max-w-2xl">
            <div className="border-b border-theme-border pb-4">
              <h3 className="text-[18px] font-semibold text-theme-text">Change Password</h3>
              <p className="text-[13px] text-theme-textSecondary mt-1">Ensure your account stays completely secure.</p>
            </div>
            
            <form onSubmit={updatePassword} className="space-y-5 max-w-sm">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-theme-textSecondary uppercase tracking-wider">Current Password</label>
                <input type="password" name="current_password" required value={passwords.current_password} onChange={handlePasswordChange} className="w-full px-3 py-1.5 bg-theme-sidebar border border-theme-border rounded-md focus:border-theme-accent focus:outline-none transition-all text-[13px]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-theme-textSecondary uppercase tracking-wider">New Password</label>
                <input type="password" name="new_password" required minLength="6" value={passwords.new_password} onChange={handlePasswordChange} className="w-full px-3 py-1.5 bg-theme-sidebar border border-theme-border rounded-md focus:border-theme-accent focus:outline-none transition-all text-[13px]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-theme-textSecondary uppercase tracking-wider">Confirm Password</label>
                <input type="password" name="confirm_password" required minLength="6" value={passwords.confirm_password} onChange={handlePasswordChange} className="w-full px-3 py-1.5 bg-theme-sidebar border border-theme-border rounded-md focus:border-theme-accent focus:outline-none transition-all text-[13px]" />
              </div>
              <button type="submit" className="px-4 py-1.5 bg-theme-sidebar border border-theme-border text-theme-text text-[13px] font-semibold rounded-md hover:bg-theme-hover transition-all">
                Update Password
              </button>
            </form>
          </div>
        )}

        {/* 3. NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="space-y-6 animate-fade-in w-full max-w-2xl">
            <div className="border-b border-theme-border pb-4">
              <h3 className="text-[18px] font-semibold text-theme-text">Notifications</h3>
              <p className="text-[13px] text-theme-textSecondary mt-1">Control email routing and activity alerts.</p>
            </div>

            <div className="flex flex-col gap-0 border border-theme-border rounded-md overflow-hidden">
              {[
                { name: "email_alerts", title: "Email Notifications", desc: "Receive alerts regarding pipeline activity." },
                { name: "resume_match_alerts", title: "Resume Match Alerts", desc: "Instant updates when match goes over 80%." },
                { name: "weekly_reports", title: "Weekly Reports", desc: "A curated compilation of recruitment metrics." }
              ].map((item, i, arr) => (
                <div key={item.name} className={`flex items-center justify-between p-4 bg-theme-bg ${i !== arr.length-1 ? 'border-b border-theme-border' : ''}`}>
                  <div>
                    <p className="text-[13px] font-medium text-theme-text">{item.title}</p>
                    <p className="text-[12px] text-theme-textSecondary mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" name={item.name} checked={settings[item.name]} onChange={handleChange} />
                    <div className="w-9 h-5 bg-theme-sidebar border border-theme-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-theme-textSecondary peer-checked:after:bg-theme-text after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-theme-accent peer-checked:border-theme-accent"></div>
                  </label>
                </div>
              ))}
            </div>

            <button onClick={saveSettings} disabled={saving} className="px-4 py-1.5 bg-theme-text text-theme-bg text-[13px] font-semibold rounded-md hover:bg-gray-200 transition-all duration-150 disabled:opacity-50">
              Save Preferences
            </button>
          </div>
        )}

        {/* 4. INTEGRATIONS */}
        {activeTab === "integrations" && (
          <div className="space-y-6 animate-fade-in w-full max-w-2xl">
            <div className="border-b border-theme-border pb-4">
              <h3 className="text-[18px] font-semibold text-theme-text">Integrations</h3>
              <p className="text-[13px] text-theme-textSecondary mt-1">Configure foundational AI models and API keys.</p>
            </div>

            <div className="p-5 border border-theme-border bg-theme-sidebar/30 rounded-md">
              <h4 className="text-[14px] font-medium text-theme-text mb-1 flex items-center gap-2">
                OpenAI Provider
                {keyStatus === 'connected' && <span className="px-1.5 py-0.5 bg-success/10 text-success text-[10px] rounded border border-success/20 uppercase">Active</span>}
              </h4>
              <p className="text-[12px] text-theme-textSecondary mb-4">A valid API Key is required for deep analysis functions.</p>
              
              <div className="flex gap-2 w-full max-w-sm">
                <input 
                  type="password" name="openai_api_key" 
                  value={settings.openai_api_key} onChange={handleChange} 
                  placeholder="sk-..."
                  className="w-full px-3 py-1.5 bg-theme-sidebar border border-theme-border rounded-md focus:border-theme-accent focus:outline-none transition-all text-[13px] text-theme-text placeholder:text-theme-border"
                />
                <button onClick={testApiKey} disabled={testingKey} className="shrink-0 px-3 py-1.5 bg-theme-sidebar border border-theme-border text-theme-text text-[13px] font-semibold rounded-md hover:bg-theme-hover transition-all">
                  Test Key
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. DATA */}
        {activeTab === "data" && (
          <div className="space-y-6 animate-fade-in w-full max-w-2xl">
            <div className="border-b border-theme-border pb-4">
              <h3 className="text-[18px] font-semibold text-theme-text">Privacy & Export</h3>
              <p className="text-[13px] text-theme-textSecondary mt-1">Control your data layer and hard deletions.</p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="p-4 border border-theme-border rounded-md flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] font-medium text-theme-text">Download JSON Export</h4>
                  <p className="text-[12px] text-theme-textSecondary mt-0.5">Generate a complete breakdown of parsed analytics.</p>
                </div>
                <button onClick={exportData} className="shrink-0 px-3 py-1.5 bg-theme-sidebar border border-theme-border text-theme-text text-[13px] font-semibold rounded-md hover:bg-theme-hover transition-all">
                  Export
                </button>
              </div>
              
              <div className="p-4 border border-error/30 bg-error/5 rounded-md flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] font-medium text-theme-text">Wipe Analysis History</h4>
                  <p className="text-[12px] text-theme-textSecondary mt-0.5">Irreversibly destroy all saved PDFs and matching models.</p>
                </div>
                <button onClick={clearHistory} className="shrink-0 px-3 py-1.5 bg-error border border-error text-white text-[13px] font-semibold rounded-md hover:bg-red-600 transition-all">
                  Erase Data
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
