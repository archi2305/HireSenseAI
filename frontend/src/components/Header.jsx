import React, { useState, useRef, useEffect } from "react"
import { Bell, Search, LogOut, Command, ChevronRight, Moon, Sun, Briefcase } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import NotificationDropdown from "./NotificationDropdown"
import { useAuth } from "../context/AuthContext"
import { useDashboard } from "../context/DashboardContext"
import { useTheme } from "../context/ThemeContext"
import { motion, AnimatePresence } from "framer-motion"

function Header({ notifications, onCommandPalette }) {
  const { searchTerm, setSearchTerm } = useDashboard()
  const { theme, toggleTheme } = useTheme()
  const [bellOpen, setBellOpen] = useState(false)
  const navigate = useNavigate()
  const { logout } = useAuth()
  const location = useLocation()
  
  const bellRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setBellOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const pageTitle = location.pathname.split("/").filter(Boolean)[0] || "Dashboard"
  const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)

  return (
    <header className="flex items-center justify-between px-8 h-16 bg-theme-bg/50 backdrop-blur-xl border-b border-theme-border sticky top-0 z-40 select-none transition-all duration-300">
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 group cursor-pointer">
           <div className="w-8 h-8 rounded-lg bg-theme-accent/10 border border-theme-accent/20 flex items-center justify-center text-theme-accent group-hover:shadow-accent-glow transition-all duration-300">
              <Briefcase size={16} />
           </div>
           <div className="flex flex-col">
              <span className="text-[12px] font-bold text-theme-text tracking-tight group-hover:text-theme-accent transition-colors">HireSense AI</span>
              <div className="flex items-center gap-1.5 text-[10px] text-theme-textSecondary font-medium">
                 <span>{formattedTitle}</span>
                 <ChevronRight size={10} className="opacity-30" />
                 <span className="opacity-50">Overview</span>
              </div>
           </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Cmd+K Search Trigger */}
        <button
          onClick={onCommandPalette}
          style={{
            display:"flex", alignItems:"center", gap:10,
            padding:"8px 14px", borderRadius:12,
            background:"var(--bg)", border:"1px solid var(--border)",
            cursor:"pointer", width:280, transition:"all .2s"
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
        >
          <Search style={{ width:15, height:15, color:"var(--text-2)" }} />
          <span style={{ flex:1, textAlign:"left", fontSize:13, color:"var(--text-2)", fontWeight:500 }}>
            Search anything…
          </span>
          <div style={{ display:"flex", gap:3 }}>
            <kbd style={{ padding:"2px 6px", borderRadius:5, border:"1px solid var(--border)", background:"var(--surface)", fontSize:10, fontWeight:700, fontFamily:"monospace", color:"var(--text-2)" }}>
              ⌘K
            </kbd>
          </div>
        </button>

        <div className="w-px h-5 bg-theme-border/60 mx-1"></div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-theme-surface border border-theme-border hover:border-theme-accent/50 text-theme-textSecondary hover:text-theme-accent transition-all duration-300 active:scale-90 relative overflow-hidden group"
        >
          <AnimatePresence mode="wait">
            {theme === "dark" ? (
              <motion.div
                key="sun"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun className="w-4 h-4" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon className="w-4 h-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className={`p-2.5 rounded-full border transition-all duration-300 
              ${bellOpen 
                ? "bg-theme-accent/10 border-theme-accent text-theme-accent" 
                : "bg-theme-surface border-theme-border text-theme-textSecondary hover:text-theme-text"
              }`}
          >
            <Bell className="w-4 h-4" />
            {notifications?.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-theme-bg bg-theme-accent animate-pulse" />
            )}
          </button>
          
          <AnimatePresence>
            {bellOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 z-50 bg-theme-surface/90 backdrop-blur-2xl border border-theme-border rounded-xl shadow-premium overflow-hidden"
              >
                <NotificationDropdown items={notifications} open={bellOpen} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="p-2.5 rounded-full bg-theme-surface border border-theme-border hover:bg-red-500/10 hover:border-red-500/30 text-theme-textSecondary hover:text-red-500 transition-all duration-300"
          title="Sign out"
        >
           <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}

export default Header
