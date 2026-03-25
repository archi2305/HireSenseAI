import React, { useState, useRef, useEffect } from "react"
import { Bell, Search, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import NotificationDropdown from "./NotificationDropdown"
import { useAuth } from "../context/AuthContext"
import { useDashboard } from "../context/DashboardContext"

function Header({ notifications }) {
  const { searchTerm, setSearchTerm } = useDashboard()
  const [bellOpen, setBellOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
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

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="flex items-center justify-between px-6 h-14 bg-theme-bg border-b border-theme-border sticky top-0 z-40 transition-all duration-150">
      
      {/* Breadcrumb or View Title Placeholder */}
      <div className="flex items-center gap-2 text-sm text-theme-textSecondary font-medium">
        <span>Workspace</span>
        <span className="text-theme-border">/</span>
        <span className="text-theme-text">Candidates</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-theme-card border border-theme-border flex-1 w-[280px] transition-all duration-150 focus-within:border-theme-accent focus-within:ring-1 focus-within:ring-theme-accent/50">
          <Search className="w-3.5 h-3.5 text-theme-textSecondary" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-[13px] outline-none w-full text-theme-text placeholder:text-theme-textSecondary font-medium"
          />
          <div className="flex items-center gap-1">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-theme-textSecondary bg-theme-bg border border-theme-border rounded">⌘K</kbd>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className="relative p-1.5 rounded-md hover:bg-theme-hover transition-all duration-150 text-theme-textSecondary hover:text-theme-text"
          >
            <Bell className="w-4 h-4" />
            {notifications && notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-theme-accent" />
            )}
          </button>
          
          {bellOpen && (
            <div className="absolute right-0 mt-2 w-80 z-50 bg-theme-card rounded-md border border-theme-border shadow-lg">
              <NotificationDropdown items={notifications} open={bellOpen} />
            </div>
          )}
        </div>

        <div className="w-px h-4 bg-theme-border"></div>

        {/* Minimal Actions */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-[13px] font-medium text-theme-textSecondary hover:text-theme-text transition-all duration-150"
          title="Sign out"
        >
           <LogOut className="w-3.5 h-3.5" />
           <span className="hidden sm:inline">Sign out</span>
        </button>

      </div>
    </header>
  )
}

export default Header
