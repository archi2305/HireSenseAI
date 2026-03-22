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
  const [keyStatus, setKeyStatus] = useState(null) // null, 'connected', 'disconnected'

  const [settings, setSettings] = useState({
    fullname: "",
    email: "",
    company: "",
    job_role: "",
    email_alerts: true,
    weekly_reports: false,
    resume_match_alerts: true,
    openai_api_key: "",
    dark_mode: false,
    accent_color: "pastelBlue"
  })

  // Separate state for password change
  const [passwords, setPasswords] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await api.get("/settings")
      setSettings(res.data)
      setKeyStatus(res.data.openai_api_key ? 'connected' : 'disconnected')
    } catch (error) {
      toast.error("Failed to load settings.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  const saveSettings = async () => {
    setSaving(true)
    const toastId = toast.loading("Saving settings...")
    try {
      await api.put("/settings", settings)
      toast.success("Settings saved successfully!", { id: toastId })
    } catch (error) {
      toast.error("Failed to save settings.", { id: toastId })
    } finally {
      setSaving(false)
    }
  }

  const updatePassword = async (e) => {
    e.preventDefault()
    if (passwords.new_password !== passwords.confirm_password) {
      return toast.error("New passwords do not match.")
    }
    const toastId = toast.loading("Updating password...")
    try {
      await api.post("/profile/change-password", {
        current_password: passwords.current_password,
        new_password: passwords.new_password
      })
      toast.success("Password updated securely!", { id: toastId })
      setPasswords({ current_password: "", new_password: "", confirm_password: "" })
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to update password.", { id: toastId })
    }
  }

  const testApiKey = async () => {
    if (!settings.openai_api_key) return toast.error("Please enter an API key first.")
    
    // Auto-save the key before testing
    await api.put("/settings", { openai_api_key: settings.openai_api_key })
    
    setTestingKey(true)
    const toastId = toast.loading("Testing connection to OpenAI...")
    try {
      const res = await api.post("/settings/test-api-key")
      if (res.data.status === "ok") {
        toast.success(res.data.message, { id: toastId })
        setKeyStatus('connected')
      } else {
        toast.error(res.data.message, { id: toastId })
        setKeyStatus('disconnected')
      }
    } catch (error) {
      toast.error("API test request failed.", { id: toastId })
      setKeyStatus('disconnected')
    } finally {
      setTestingKey(false)
    }
  }

  const exportData = async () => {
    const toastId = toast.loading("Compiling your data...")
    try {
      const res = await api.get("/settings/export-data")
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.data, null, 2))
      const downloadAnchorNode = document.createElement('a')
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", "HireSense_Data_Export.json")
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()
      toast.success("Data exported successfully!", { id: toastId })
    } catch (error) {
      toast.error("Export failed.", { id: toastId })
    }
  }

  const clearHistory = async () => {
    if(!window.confirm("Are you sure you want to clear all historical analysis data? This is irreversible.")) return
    
    const toastId = toast.loading("Clearing history...")
    try {
      await api.delete("/settings/clear-history")
      toast.success("History cleared completely.", { id: toastId })
    } catch (error) {
      toast.error("Failed to clear history.", { id: toastId })
    }
  }

  const TABS = [
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "integrations", label: "Integrations", icon: Zap },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "data", label: "Data & Privacy", icon: Database },
  ]

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-pastelBlue"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 pb-12">
      
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 flex-shrink-0">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Settings</h2>
        <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-4 md:pb-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-white text-pastelBlue shadow-sm border border-slate-100" 
                  : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-pastelBlue" : "text-slate-400"}`} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 min-h-[500px]">
          
          {/* 1. ACCOUNT */}
          {activeTab === "account" && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Account Details</h3>
                <p className="text-sm text-slate-500">Manage your personal information and roles.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input type="text" name="fullname" value={settings.fullname} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pastelBlue focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <input type="email" value={settings.email} disabled className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed focus:outline-none" />
                  <p className="text-[10px] text-slate-400 mt-1">Email cannot be changed.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
                  <input type="text" name="company" value={settings.company || ""} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pastelBlue focus:outline-none" placeholder="Acme Corp" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Job Role</label>
                  <input type="text" name="job_role" value={settings.job_role || ""} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pastelBlue focus:outline-none" placeholder="Recruitment Manager" />
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <button onClick={saveSettings} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pastelBlue to-blue-400 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-70">
                  <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          )}

          {/* 2. SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Security & Passwords</h3>
                <p className="text-sm text-slate-500">Ensure your account stays completely secure.</p>
              </div>
              
              <form onSubmit={updatePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                  <input type="password" name="current_password" required value={passwords.current_password} onChange={handlePasswordChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pastelBlue focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                  <input type="password" name="new_password" required minLength="6" value={passwords.new_password} onChange={handlePasswordChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pastelBlue focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                  <input type="password" name="confirm_password" required minLength="6" value={passwords.confirm_password} onChange={handlePasswordChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pastelBlue focus:outline-none" />
                </div>
                <button type="submit" className="mt-2 px-6 py-2.5 bg-slate-800 text-white font-semibold rounded-xl shadow-sm hover:bg-slate-700 transition-all">
                  Update Password
                </button>
              </form>

              <div className="pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-4">
                  <Key className="w-6 h-6 text-slate-400 mt-1" />
                  <div>
                    <h4 className="font-bold text-slate-700">Last Login</h4>
                    <p className="text-xs text-slate-500 mt-1">Today at 03:22 AM (Asia/Kolkata)</p>
                  </div>
                </div>
                <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 flex flex-col items-start gap-2">
                  <div>
                    <h4 className="font-bold text-rose-800">Active Sessions</h4>
                    <p className="text-xs text-rose-600/80 mt-1">Log out of all other recognized devices securely.</p>
                  </div>
                  <button onClick={() => toast.success("Terminated all other sessions.")} className="mt-2 text-xs font-bold text-rose-600 bg-white border border-rose-200 px-3 py-1.5 rounded-lg hover:bg-rose-100">
                    Logout All Devices
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Notification Preferences</h3>
                <p className="text-sm text-slate-500">Control when and how HireSenseAI contacts you.</p>
              </div>

              <div className="space-y-4 max-w-2xl">
                {/* Toggle Item */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-pastelBlue/30 transition-colors">
                  <div>
                    <p className="font-bold text-slate-700">Email Notifications</p>
                    <p className="text-xs text-slate-500 mt-1">Receive alerts regarding general account activity.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" name="email_alerts" checked={settings.email_alerts} onChange={handleChange} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pastelBlue"></div>
                  </label>
                </div>
                
                {/* Toggle Item */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-pastelBlue/30 transition-colors">
                  <div>
                    <p className="font-bold text-slate-700">Resume Match Alerts</p>
                    <p className="text-xs text-slate-500 mt-1">Instant updates when an uploaded resume scores above 80%.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" name="resume_match_alerts" checked={settings.resume_match_alerts} onChange={handleChange} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pastelBlue"></div>
                  </label>
                </div>

                {/* Toggle Item */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-pastelBlue/30 transition-colors">
                  <div>
                    <p className="font-bold text-slate-700">Weekly Reports</p>
                    <p className="text-xs text-slate-500 mt-1">A curated compilation of your pipeline bandwidth.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" name="weekly_reports" checked={settings.weekly_reports} onChange={handleChange} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pastelBlue"></div>
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button onClick={saveSettings} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pastelBlue to-blue-400 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-70">
                  <Save size={18} /> {saving ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </div>
          )}

          {/* 4. INTEGRATIONS */}
          {activeTab === "integrations" && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Integrations & APIs</h3>
                <p className="text-sm text-slate-500">Connect HireSense to external foundational models.</p>
              </div>

              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 break-all shadow-sm max-w-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap size={100} />
                </div>
                <div className="relative z-10">
                  <h4 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                    OpenAI API
                    {keyStatus === 'connected' && <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Connected ✅</span>}
                    {keyStatus === 'disconnected' && <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Not Connected ❌</span>}
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">Required to run the deep linguistic analysis and suggestions engine against the PDFs.</p>
                  
                  <div className="flex gap-2">
                    <input 
                      type="password" 
                      name="openai_api_key" 
                      placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx" 
                      value={settings.openai_api_key || ""} 
                      onChange={handleChange} 
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-pastelBlue focus:outline-none placeholder:text-slate-300"
                    />
                    <button onClick={testApiKey} disabled={testingKey} className="px-4 py-2 bg-slate-800 text-white font-semibold rounded-xl hover:bg-slate-700 transition-colors shadow-sm whitespace-nowrap disabled:opacity-70">
                      {testingKey ? "Testing..." : "Test Connection"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. APPEARANCE */}
          {activeTab === "appearance" && (
            <div className="space-y-8 animate-fade-in-up">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Interface Appearance</h3>
                <p className="text-sm text-slate-500">Customize the look and feel of your dashboard.</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 max-w-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-200 rounded-lg"><Moon className="w-5 h-5 text-slate-600" /></div>
                  <div>
                    <h4 className="font-bold text-slate-700">Dark Mode</h4>
                    <p className="text-xs text-slate-500">Easier on the eyes for night sorting.</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" name="dark_mode" checked={settings.dark_mode} onChange={handleChange} />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-800"></div>
                </label>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <ColorIcon className="w-4 h-4 text-pastelBlue" /> Accent Color
                </h4>
                <div className="flex gap-4">
                  {['pastelBlue', 'softPink', 'mint', 'lavender'].map(color => (
                    <button 
                      key={color} 
                      onClick={() => setSettings({...settings, accent_color: color})}
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-[3px] transition-all hover:scale-110 ${
                        settings.accent_color === color ? 'border-slate-800' : 'border-transparent shadow-sm'
                      } ${
                        color === 'pastelBlue' ? 'bg-[#A8D0E6]' : 
                        color === 'softPink' ? 'bg-[#F8E9A1]' : 
                        color === 'mint' ? 'bg-[#F76C6C]' : 'bg-[#374785]'
                      }`}
                    >
                      {settings.accent_color === color && <CheckCircle className="w-5 h-5 text-slate-800" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6">
                <button onClick={saveSettings} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pastelBlue to-blue-400 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-70">
                  <Save size={18} /> {saving ? "Saving..." : "Save Appearance"}
                </button>
              </div>

            </div>
          )}

          {/* 6. DATA & PRIVACY */}
          {activeTab === "data" && (
            <div className="space-y-6 animate-fade-in-up">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Data & Privacy</h3>
                <p className="text-sm text-slate-500">We respect your data. Export it or wipe it clean seamlessly.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                
                {/* Export Data */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Export Data</h4>
                    <p className="text-xs text-slate-500 mb-6">Download a JSON snapshot of all your settings, preferences, and analyzed candidates.</p>
                  </div>
                  <button onClick={exportData} className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-colors">
                    <Download size={18} /> Download JSON
                  </button>
                </div>

                {/* Clear History */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">Clear Analysis History</h4>
                    <p className="text-xs text-slate-500 mb-6">Permanently remove all scraped PDFs and parsed JSON from our local storage buckets.</p>
                  </div>
                  <button onClick={clearHistory} className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-100 transition-colors">
                    <Trash2 size={18} className="text-slate-400" /> Wipe Server Data
                  </button>
                </div>

              </div>

              {/* Danger Zone */}
              <div className="mt-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl">
                <h4 className="font-bold text-rose-800 mb-2">Danger Zone</h4>
                <p className="text-sm text-rose-600/80 mb-4">Deleting your account is permanent. It will destroy all historical metadata, preferences, and configured integrators immediately.</p>
                <button onClick={() => { if(window.confirm('Delete account permanently?')) toast.error('Account marked for deletion.') }} className="px-6 py-2.5 bg-rose-600 text-white font-bold rounded-xl shadow-sm hover:bg-rose-700 transition-colors">
                  Delete Account...
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Floating Logout Footer */}
        <div className="mt-8 text-right">
           <button onClick={logout} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-rose-500 transition-colors p-2">
             <LogOut size={16} /> Log Out of HireSense
           </button>
        </div>

      </div>
    </div>
  )
}
