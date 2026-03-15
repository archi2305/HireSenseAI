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
  History
} from "lucide-react"

function Sidebar({ setPage }) {

  const menuItem =
    "flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-white/10 rounded-lg cursor-pointer transition"

  return (

    <div className="w-64 min-h-screen bg-gradient-to-b from-[#0f172a] to-[#020617] p-5">

      {/* Logo */}

      <div className="flex items-center gap-3 mb-10">

        <div className="bg-indigo-600 p-2 rounded-lg">
          <LayoutDashboard size={20} color="white" />
        </div>

        <h1 className="text-white text-lg font-semibold">
          HireSense AI
        </h1>

      </div>

      {/* Menu */}

      <div className="flex flex-col gap-2">

        <div
          className={menuItem}
          onClick={() => setPage("dashboard")}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </div>

        <div
          className={menuItem}
          onClick={() => setPage("upload")}
        >
          <Upload size={18} />
          Upload Resume
        </div>

        <div
          className={menuItem}
          onClick={() => setPage("resumes")}
        >
          <FileText size={18} />
          My Resumes
        </div>

        <div
          className={menuItem}
          onClick={() => setPage("analytics")}
        >
          <BarChart3 size={18} />
          Analytics
        </div>

        <div
          className={menuItem}
          onClick={() => setPage("history")}
        >
          <History size={18} />
          History
        </div>

      </div>

    </div>

  )
}

export default Sidebar