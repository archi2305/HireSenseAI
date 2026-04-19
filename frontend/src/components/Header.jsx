import React, { useState, useRef, useEffect, useMemo } from "react"
import { Bell, Search, LogOut, ChevronRight, Moon, Sun, Briefcase, Command } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import NotificationDropdown from "./NotificationDropdown"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { motion, AnimatePresence } from "framer-motion"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function Header({ notifications, onCommandPalette }) {
  const { theme, toggleTheme } = useTheme()
  const [bellOpen, setBellOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const navigate = useNavigate()
  const { logout } = useAuth()
  const location = useLocation()
  const bellRef = useRef(null)
  const searchRef = useRef(null)

  const pageTitle = location.pathname.split("/").filter(Boolean)[0] || "Dashboard"
  const formattedTitle = pageTitle.charAt(0).toUpperCase() + pageTitle.slice(1)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setBellOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim())
    }, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  useEffect(() => {
    if (!debouncedSearch) {
      setSuggestions([])
      return
    }
    let cancelled = false
    const query = debouncedSearch.toLowerCase()

    const fetchSuggestions = async () => {
      setSearchLoading(true)
      try {
        const [candidateRes, analysesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/candidates?search=${encodeURIComponent(debouncedSearch)}`),
          axios.get(`${API_BASE_URL}/analyses`),
        ])

        const next = []
        const seen = new Set()
        const pushSuggestion = (type, label) => {
          const normalized = (label || "").trim()
          if (!normalized) return
          if (!normalized.toLowerCase().includes(query)) return
          const key = `${type}:${normalized.toLowerCase()}`
          if (seen.has(key)) return
          seen.add(key)
          next.push({ id: key, type, label: normalized })
        }

        ;(candidateRes.data || []).forEach((candidate) => {
          pushSuggestion("candidate", candidate.name)
          pushSuggestion("role", candidate.role)
          ;(candidate.skills || []).forEach((skill) => pushSuggestion("skill", skill))
        })

        ;(analysesRes.data || []).forEach((analysis) => {
          pushSuggestion("resume", analysis.resume_name)
          pushSuggestion("role", analysis.job_role)
        })

        if (!cancelled) {
          setSuggestions(next.slice(0, 8))
          setSearchOpen(true)
        }
      } catch (error) {
        if (!cancelled) {
          setSuggestions([])
        }
      } finally {
        if (!cancelled) setSearchLoading(false)
      }
    }

    fetchSuggestions()
    return () => {
      cancelled = true
    }
  }, [debouncedSearch])

  const suggestionLabel = useMemo(
    () => ({
      candidate: "Candidate",
      resume: "Resume",
      role: "Role",
      skill: "Skill",
    }),
    []
  )

  const handleSearchSubmit = (value) => {
    const q = value.trim()
    if (!q) return
    navigate(`/history?q=${encodeURIComponent(q)}`)
    setSearchOpen(false)
  }

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      handleSearchSubmit(searchTerm)
    }
  }

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
        <div className="relative" ref={searchRef}>
          <div className="flex items-center gap-2 w-80 px-3 py-2 rounded-xl border border-theme-border bg-theme-surface">
            <Search className="w-4 h-4 text-theme-textSecondary" />
            <input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setSearchOpen(Boolean(e.target.value.trim()))
              }}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => setSearchOpen(Boolean(searchTerm.trim()))}
              placeholder="Search candidates, resumes, roles, skills"
              className="w-full bg-transparent outline-none text-sm text-theme-text placeholder:text-theme-textSecondary"
            />
            <button
              onClick={onCommandPalette}
              className="px-2 py-0.5 rounded border border-theme-border text-[10px] font-bold text-theme-textSecondary hover:border-theme-accent"
              title="Open command palette"
            >
              <Command className="w-3 h-3 inline mr-1" />
              K
            </button>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute left-0 mt-2 w-full bg-theme-surface border border-theme-border rounded-xl shadow-premium z-[95] max-h-72 overflow-y-auto"
              >
                {searchLoading && (
                  <div className="px-3 py-3 text-xs text-theme-textSecondary">Searching...</div>
                )}
                {!searchLoading && suggestions.length === 0 && (
                  <div className="px-3 py-3 text-xs text-theme-textSecondary">
                    No data yet. Upload your first resume.
                  </div>
                )}
                {!searchLoading &&
                  suggestions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSearchTerm(item.label)
                        handleSearchSubmit(item.label)
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-theme-hover border-b last:border-b-0 border-theme-border/40"
                    >
                      <p className="text-sm text-theme-text">{item.label}</p>
                      <p className="text-[11px] text-theme-textSecondary uppercase tracking-wide">
                        {suggestionLabel[item.type] || "Result"}
                      </p>
                    </button>
                  ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
                className="fixed top-20 right-6 w-full max-w-[320px] z-[90] bg-theme-surface border border-theme-border rounded-xl shadow-premium overflow-hidden"
              >
                <NotificationDropdown
                  items={notifications}
                  open={bellOpen}
                  onDismissAll={() => setBellOpen(false)}
                />
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
