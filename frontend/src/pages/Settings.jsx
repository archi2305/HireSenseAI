import { useState } from "react"
import { Save, Bell, Shield, Moon } from "lucide-react"

function Settings() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [apiKey, setApiKey] = useState("")

  const handleSave = (e) => {
    e.preventDefault()
    // Simulated save logic
    alert("Settings saved successfully!")
  }

  return (
    <div className="bg-cardBg rounded-2xl shadow-md p-8 max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Settings</h2>
      
      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Account Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-pastelBlue" />
            Integrations
          </h3>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-1">OpenAI API Key (Optional)</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="block w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-pastelBlue focus:border-pastelBlue bg-white text-sm transition-colors"
              placeholder="sk-..."
            />
            <p className="text-xs text-slate-500 mt-2">Required for custom resume analysis modeling.</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-softPink" />
            Preferences
          </h3>
          
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <p className="font-medium text-slate-700">Email Notifications</p>
              <p className="text-sm text-slate-500">Receive alerts when resume analysis is complete.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-400"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-slate-500" />
              <div>
                <p className="font-medium text-slate-700">Dark Mode</p>
                <p className="text-sm text-slate-500">Enable dark theme across the application.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-400"></div>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-softPink to-lavender text-white font-medium rounded-xl hover:opacity-90 transition-opacity shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

      </form>
    </div>
  )
}

export default Settings
