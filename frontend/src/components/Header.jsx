import React, { useState, useRef, useEffect } from "react"
import { Bell, Search, LogOut, Command, ChevronRight } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import NotificationDropdown from "./NotificationDropdown"
import { useAuth } from "../context/AuthContext"
import { useDashboard } from "../context/DashboardContext"

function Header({ notifications }) {
  const { searchTerm, setSearchTerm } = useDashboard()
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

  const pageTitle = location.pathname.split("/").filter(Boolean)[0] || "HireSense"
  const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)

  return (
    <header className="flex items-center justify-between px-6 h-14 bg-theme-bg border-b border-theme-border sticky top-0 z-40 select-none">
      
      <div className="flex items-center gap-2.5 text-[13px] font-medium text-theme-textSecondary">
        <div className="w-5 h-5 rounded border border-theme-border bg-theme-surface flex items-center justify-center">
            <Command size={11} className="text-theme-textSecondary" />
        </div>
        <ChevronRight size={14} className="opacity-30" />
        <span className="text-theme-text/80">{formattedTitle}</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-theme-surface border border-theme-border w-[240px] md:w-[320px] transition-all duration-200 focus-within:ring-1 focus-within:ring-theme-accent/40 focus-within:border-theme-accent">
          <Search className="w-3.5 h-3.5 text-theme-textSecondary" />
          <input
            type="text"
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-[13px] outline-none w-full text-theme-text placeholder:text-theme-textSecondary font-medium"
          />
          <div className="hidden sm:flex items-center gap-1 opacity-50">
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono border border-theme-border rounded bg-theme-bg">⌘K</kbd>
          </div>
        </div>

        <div className="w-px h-4 bg-theme-border/60 mx-1"></div>

        {/* Notifications */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className="p-2 rounded-md hover:bg-theme-surface transition-colors text-theme-textSecondary hover:text-white"
          >
            <Bell className="w-4 h-4" />
            {notifications?.length > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-theme-bg bg-theme-accent" />
            )}
          </button>
          
          {bellOpen && (
            <div className="absolute right-0 mt-2 w-80 z-50 bg-theme-surface border border-theme-border rounded-md shadow-linear-lg animate-slide-in-bottom">
              <NotificationDropdown items={notifications} open={bellOpen} />
            </div>
          )}
        </div>

        <button
          onClick={() => { logout(); navigate("/login"); }}
          className="p-2 rounded-md hover:bg-theme-surface transition-colors text-theme-textSecondary hover:text-error"
          title="Sign out"
        >
           <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}

export default Header
