import { LayoutDashboard, FileText, History, Settings } from "lucide-react"

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analyzer", label: "Resume Analyzer", icon: FileText },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
]

function Sidebar({ active, onChange }) {
  return (
    <aside className="w-64 bg-gradient-to-b from-lavender via-softPink to-pastelBlue text-slate-900 min-h-screen p-6">
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-cardBg/80 shadow-sm">
          <span className="w-7 h-7 rounded-lg bg-mint flex items-center justify-center text-slate-800 text-sm font-bold">
            H
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight">
              HireSense AI
            </p>
            <p className="text-[11px] text-slate-500">
              Resume Intelligence
            </p>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange?.(id)}
              className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-cardBg text-slate-900 shadow-md"
                  : "text-slate-800/80 hover:bg-cardBg/40"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar

import {
  LayoutDashboard,
  Upload,
  FileText,
  BarChart3,
  History,
  Settings
} from "lucide-react"

function Sidebar({ setPage }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "upload", label: "Resume Analyzer", icon: Upload },
    { id: "resumes", label: "My Resumes", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "history", label: "History", icon: History },
  ]

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-lavender via-softPink to-pastelBlue p-6 flex flex-col">
      {/* Logo */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 shadow-sm hover:shadow-md transition-all">
          <span className="w-7 h-7 rounded-lg bg-mint flex items-center justify-center text-slate-800 text-sm font-bold">
            H
          </span>
          <div>
            <p className="text-sm font-semibold leading-tight text-slate-900">
              HireSense AI
            </p>
            <p className="text-[11px] text-slate-600">
              Resume Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex flex-col gap-1 flex-1">
        {menuItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-800 hover:bg-white/40 transition-all duration-200 font-medium text-sm group"
          >
            <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      {/* Settings */}
      <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-slate-800 hover:bg-white/40 transition-all duration-200 font-medium text-sm mt-auto">
        <Settings className="w-4 h-4" />
        <span>Settings</span>
      </button>
    </aside>
  )
}

export default Sidebar
