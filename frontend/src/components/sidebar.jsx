import React from "react"
import { Layers, FileText, History, Settings, Target, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation()
  
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: Layers },
    { name: "Resume Analyzer", path: "/analyzer", icon: FileText },
    { name: "Candidate Match", path: "/matching", icon: Target },
    { name: "History", path: "/history", icon: History },
  ]
  const bottomMenu = [
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings }
  ]

  return (
    <motion.div 
      initial={false}
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="h-full bg-theme-sidebar flex flex-col border-r border-theme-border z-30 shrink-0 relative overflow-visible"
    >
      {/* Collapse Toggle */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-theme-sidebar border border-theme-border flex items-center justify-center text-theme-textSecondary hover:text-white hover:bg-theme-hover transition-colors z-50 shadow-md"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="px-4 py-4 flex items-center gap-3 mb-4 mt-2 h-10 w-full overflow-hidden">
        <div className="w-6 h-6 shrink-0 rounded bg-gradient-to-br from-theme-accent to-indigo-800 flex items-center justify-center text-white shadow-glow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.h2 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="text-[14px] font-bold text-theme-text tracking-wide whitespace-nowrap"
            >
              HireSense
            </motion.h2>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 px-3 overflow-hidden">
        <AnimatePresence>
          {!collapsed && (
             <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-2 mb-2 text-[10px] uppercase font-bold text-theme-textSecondary tracking-widest mt-2 whitespace-nowrap">Features</motion.p>
          )}
        </AnimatePresence>
        
        <ul className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ease-out text-[14px] font-medium group relative
                  ${isActive 
                    ? "bg-theme-hover text-white shadow-sm" 
                    : "text-theme-textSecondary hover:text-white hover:bg-theme-hover/60"
                  }`}
                >
                  {isActive && !collapsed && (
                    <motion.div layoutId="active-indicator" className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-theme-accent rounded-r-md" />
                  )}
                  <Icon 
                    size={18} 
                    className={`shrink-0 transition-all duration-200 group-hover:scale-110 ${isActive ? "text-theme-accent" : "text-theme-textSecondary group-hover:text-white"}`} 
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="mt-8 mb-2 px-2 h-4 overflow-hidden">
        <AnimatePresence>
          {!collapsed && (
             <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[10px] uppercase font-bold text-theme-textSecondary tracking-widest whitespace-nowrap">Account</motion.p>
          )}
        </AnimatePresence>
        </div>
        
        <ul className="space-y-1">
          {bottomMenu.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  title={collapsed ? item.name : undefined}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ease-out text-[14px] font-medium group relative
                  ${isActive 
                    ? "bg-theme-hover text-white shadow-sm" 
                    : "text-theme-textSecondary hover:text-white hover:bg-theme-hover/60"
                  }`}
                >
                  {isActive && !collapsed && (
                    <motion.div layoutId="active-indicator" className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-theme-accent rounded-r-md" />
                  )}
                  <Icon 
                    size={18} 
                    className={`shrink-0 transition-all duration-200 group-hover:scale-110 ${isActive ? "text-theme-text" : "text-theme-textSecondary group-hover:text-white"}`} 
                  />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span 
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      {!collapsed && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-auto p-4 border-t border-theme-border/50 overflow-hidden">
          <div className="flex items-center gap-2 p-2 rounded-md bg-theme-bg border border-theme-border shadow-sm">
             <div className="w-2 h-2 rounded-full bg-theme-accent shrink-0 animate-pulse" />
             <p className="text-[12px] font-medium text-theme-textSecondary whitespace-nowrap">Pro Plan Active</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Sidebar