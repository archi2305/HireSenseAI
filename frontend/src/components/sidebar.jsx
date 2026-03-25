import React from "react"
import { Layers, FileText, History, Settings, Target, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

function Sidebar() {
  const location = useLocation()
  
  const menu = [
    { name: "Issues", path: "/dashboard", icon: Layers },
    { name: "Parse Resume", path: "/analyzer", icon: FileText },
    { name: "Matching", path: "/matching", icon: Target },
    { name: "History", path: "/history", icon: History },
  ]
  const bottomMenu = [
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings }
  ]

  return (
    <div className="w-[230px] h-full bg-theme-sidebar flex flex-col border-r border-theme-border z-30 transition-all duration-150">
      <div className="px-4 py-4 flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded bg-theme-accent flex items-center justify-center text-white font-bold opacity-90">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <h2 className="text-[13px] font-semibold text-theme-text tracking-wide">
          HireSense
        </h2>
      </div>

      <nav className="flex-1 px-2">
        <p className="px-3 mb-2 text-[10px] uppercase font-semibold text-theme-textSecondary tracking-widest mt-2">Workspace</p>
        <ul className="space-y-0.5">
          {menu.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all duration-150 text-[13px] font-medium 
                  ${isActive 
                    ? "bg-theme-hover text-theme-text" 
                    : "text-theme-textSecondary hover:text-theme-text hover:bg-theme-hover/50"
                  }`}
                >
                  <Icon 
                    size={15} 
                    className={`transition-colors duration-150 ${isActive ? "text-theme-text" : "text-theme-textSecondary"}`} 
                  />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <p className="px-3 mt-8 mb-2 text-[10px] uppercase font-semibold text-theme-textSecondary tracking-widest">Account</p>
        <ul className="space-y-0.5">
          {bottomMenu.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all duration-150 text-[13px] font-medium 
                  ${isActive 
                    ? "bg-theme-hover text-theme-text" 
                    : "text-theme-textSecondary hover:text-theme-text hover:bg-theme-hover/50"
                  }`}
                >
                  <Icon 
                    size={15} 
                    className={`transition-colors duration-150 ${isActive ? "text-theme-text" : "text-theme-textSecondary"}`} 
                  />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="mt-auto p-4 border-t border-theme-border/50">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-theme-accent shrink-0" />
           <p className="text-[12px] text-theme-textSecondary truncate">Pro Plan Active</p>
        </div>
      </div>
    </div>
  )
}

export default Sidebar