import React from "react"
import { Layers, FileText, History, Settings, Target, User, Command } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"

function Sidebar() {
  const location = useLocation()
  
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: Layers },
    { name: "Parser", path: "/analyzer", icon: FileText },
    { name: "Matching", path: "/matching", icon: Target },
    { name: "History", path: "/history", icon: History },
  ]
  const bottomMenu = [
    { name: "Settings", path: "/settings", icon: Settings }
  ]

  return (
    <div className="w-[220px] h-full bg-theme-sidebar flex flex-col border-r border-theme-border z-30 select-none">
      <div className="px-4 h-14 flex items-center gap-2.5 shrink-0 border-b border-theme-border/50 mb-2">
        <div className="w-6 h-6 rounded bg-theme-accent flex items-center justify-center text-white shadow-accent-glow">
          <Command size={14} strokeWidth={3} />
        </div>
        <h2 className="text-[14px] font-bold text-theme-text tracking-tight uppercase">
          HireSense
        </h2>
      </div>

      <nav className="flex-1 px-2.5 overflow-y-auto py-2">
        <p className="px-3 mb-2 text-[10px] font-semibold text-theme-textSecondary uppercase tracking-widest opacity-60">Operations</p>
        <ul className="space-y-0.5">
          {menu.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`relative group flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all duration-150 text-[13px] font-medium 
                  ${isActive 
                    ? "bg-theme-hover text-theme-text" 
                    : "text-theme-textSecondary hover:text-theme-text hover:bg-theme-hover/50"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 w-0.5 h-4 bg-theme-accent rounded-r-full"
                    />
                  )}
                  <Icon 
                    size={15} 
                    className={`transition-colors duration-200 ${isActive ? "text-theme-text" : "text-theme-textSecondary group-hover:text-theme-text"}`} 
                  />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        <p className="px-3 mt-8 mb-2 text-[10px] font-semibold text-theme-textSecondary uppercase tracking-widest opacity-60">System</p>
        <ul className="space-y-0.5">
          {bottomMenu.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`relative group flex items-center gap-2.5 px-3 py-1.5 rounded-md transition-all duration-150 text-[13px] font-medium 
                  ${isActive 
                    ? "bg-theme-hover text-theme-text" 
                    : "text-theme-textSecondary hover:text-theme-text hover:bg-theme-hover/50"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 w-0.5 h-4 bg-theme-accent rounded-r-full"
                    />
                  )}
                  <Icon 
                    size={15} 
                    className={`transition-colors duration-200 ${isActive ? "text-theme-text" : "text-theme-textSecondary group-hover:text-theme-text"}`} 
                  />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-theme-border/50 bg-theme-sidebar">
        <Link to="/profile" className="flex items-center gap-2.5 p-1.5 rounded-md hover:bg-theme-hover transition-colors group">
          <div className="w-7 h-7 rounded-sm bg-theme-border flex items-center justify-center text-theme-textSecondary group-hover:bg-theme-accent group-hover:text-white transition-colors overflow-hidden">
            <User size={14} />
          </div>
          <div className="flex flex-col min-w-0">
             <p className="text-[12px] font-semibold text-theme-text truncate leading-none mb-1">Recruiter Port</p>
             <p className="text-[10px] text-theme-textSecondary truncate">Premium Account</p>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar