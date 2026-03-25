import React, { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import {
  Search, Command, LayoutDashboard, Users, FileText,
  Settings, History, Zap, ArrowRight, User, BarChart2, X
} from "lucide-react"
import { useDashboard } from "../context/DashboardContext"

const PAGES = [
  { id:"dashboard", label:"Dashboard",      icon:LayoutDashboard, path:"/dashboard",   group:"Pages"   },
  { id:"analyzer",  label:"Resume Analyzer",icon:FileText,         path:"/analyzer",    group:"Pages"   },
  { id:"matching",  label:"Candidate Match",icon:Users,            path:"/matching",    group:"Pages"   },
  { id:"history",   label:"History",         icon:History,          path:"/history",     group:"Pages"   },
  { id:"settings",  label:"Settings",        icon:Settings,         path:"/settings",    group:"Pages"   },
  { id:"profile",   label:"Profile",         icon:User,             path:"/profile",     group:"Pages"   },
]

const ACTIONS = [
  { id:"upload",    label:"Upload Resume",   icon:Zap,              action:"upload",     group:"Actions" },
  { id:"match",     label:"Match Candidates",icon:BarChart2,        action:"match",      group:"Actions" },
  { id:"analyze",   label:"New Analysis",   icon:FileText,          action:"analyze",    group:"Actions" },
]

export default function CommandPalette({ open, onClose }) {
  const [query, setQuery]   = useState("")
  const [cursor, setCursor] = useState(0)
  const { candidates }      = useDashboard()
  const navigate            = useNavigate()
  const inputRef            = useRef(null)

  useEffect(() => {
    if (open) { setQuery(""); setCursor(0); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [open])

  const candidateItems = candidates
    .filter(c => c.name?.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4)
    .map(c => ({
      id: c.id,
      label: c.name,
      sub: c.email,
      icon: User,
      group: "Candidates",
      score: c.score ?? c.ats_score ?? 0,
    }))

  const pageItems = PAGES.filter(p =>
    p.label.toLowerCase().includes(query.toLowerCase())
  )

  const actionItems = ACTIONS.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase())
  )

  const allItems = [...candidateItems, ...pageItems, ...actionItems]

  const handleSelect = useCallback((item) => {
    if (item.path)   { navigate(item.path); onClose() }
    else if (item.action === "upload")  { navigate("/analyzer"); onClose() }
    else if (item.action === "match")   { navigate("/matching"); onClose() }
    else if (item.action === "analyze") { navigate("/analyzer"); onClose() }
    else onClose()
  }, [navigate, onClose])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === "Escape")     { onClose(); return }
      if (e.key === "ArrowDown")  { e.preventDefault(); setCursor(c => Math.min(c+1, allItems.length-1)) }
      if (e.key === "ArrowUp")    { e.preventDefault(); setCursor(c => Math.max(c-1, 0)) }
      if (e.key === "Enter" && allItems[cursor]) { handleSelect(allItems[cursor]) }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, cursor, allItems, handleSelect, onClose])

  const groups = {}
  allItems.forEach((item, idx) => {
    if (!groups[item.group]) groups[item.group] = []
    groups[item.group].push({ ...item, _idx: idx })
  })

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onClose}
            style={{
              position:"fixed", inset:0, zIndex:9998,
              background:"rgba(0,0,0,0.35)", backdropFilter:"blur(6px)"
            }}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity:0, scale:.96, y:-20 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:.96, y:-20 }}
            transition={{ type:"spring", damping:30, stiffness:360 }}
            style={{
              position:"fixed", top:"18%", left:"50%", transform:"translateX(-50%)",
              width:"min(600px, 94vw)", zIndex:9999,
              background:"var(--surface)", border:"1px solid var(--border)",
              borderRadius:20, overflow:"hidden",
              boxShadow:"0 24px 64px rgba(0,0,0,.2), 0 0 0 1px rgba(0,0,0,.06)"
            }}
          >
            {/* Search row */}
            <div style={{
              display:"flex", alignItems:"center", gap:12,
              padding:"14px 18px", borderBottom:"1px solid var(--border)"
            }}>
              <Search size={18} style={{ color:"var(--accent)", flexShrink:0 }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setCursor(0) }}
                placeholder="Search pages, candidates, actions…"
                style={{
                  flex:1, border:"none", outline:"none", background:"transparent",
                  fontSize:16, fontWeight:500, color:"var(--text)"
                }}
              />
              <button onClick={onClose} style={{ background:"var(--bg)", border:"1px solid var(--border)", borderRadius:8, padding:"4px 8px", cursor:"pointer", display:"flex", alignItems:"center" }}>
                <X size={13} style={{ color:"var(--text-2)" }} />
              </button>
            </div>

            {/* Results */}
            <div style={{ maxHeight:380, overflowY:"auto", padding:"8px 0" }}>
              {allItems.length === 0 ? (
                <div style={{ textAlign:"center", padding:"40px 24px", color:"var(--text-2)" }}>
                  <Search size={28} style={{ margin:"0 auto 12px", opacity:.3 }} />
                  <p style={{ fontWeight:600, fontSize:14 }}>No results for "{query}"</p>
                </div>
              ) : Object.entries(groups).map(([group, items]) => (
                <div key={group}>
                  <p style={{
                    padding:"6px 18px", fontSize:10, fontWeight:800,
                    color:"var(--text-2)", textTransform:"uppercase", letterSpacing:".1em"
                  }}>
                    {group}
                  </p>
                  {items.map(item => {
                    const Icon = item.icon
                    const isActive = item._idx === cursor
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setCursor(item._idx)}
                        style={{
                          display:"flex", alignItems:"center", gap:12,
                          padding:"10px 18px", cursor:"pointer",
                          background: isActive ? `rgba(99,102,241,.08)` : "transparent",
                          transition:"background .1s",
                          borderLeft: isActive ? "3px solid var(--accent)" : "3px solid transparent"
                        }}
                      >
                        <div style={{
                          width:32, height:32, borderRadius:8, flexShrink:0,
                          background: isActive ? `rgba(99,102,241,.15)` : "var(--bg)",
                          border:"1px solid var(--border)",
                          display:"flex", alignItems:"center", justifyContent:"center"
                        }}>
                          <Icon size={14} style={{ color: isActive ? "var(--accent)" : "var(--text-2)" }} />
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontWeight:700, fontSize:14, color:"var(--text)", margin:0 }}>{item.label}</p>
                          {item.sub && <p style={{ fontSize:11, color:"var(--text-2)", margin:0 }}>{item.sub}</p>}
                        </div>
                        {item.score !== undefined && (
                          <span style={{
                            fontSize:11, fontWeight:800,
                            color: item.score >= 85 ? "#10b981" : item.score >= 60 ? "#f59e0b" : "#ef4444"
                          }}>
                            {item.score}%
                          </span>
                        )}
                        {(item.path || item.action) && (
                          <ArrowRight size={13} style={{ color:"var(--text-2)", opacity:.4 }} />
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              display:"flex", gap:16, padding:"10px 18px",
              borderTop:"1px solid var(--border)", background:"var(--bg)",
            }}>
              {[["↑↓","Navigate"],["↵","Open"],["Esc","Close"]].map(([key, label]) => (
                <div key={key} style={{ display:"flex", alignItems:"center", gap:5 }}>
                  <kbd style={{ background:"var(--surface)", border:"1px solid var(--border)", borderRadius:5, padding:"2px 6px", fontSize:10, fontWeight:700, fontFamily:"monospace" }}>
                    {key}
                  </kbd>
                  <span style={{ fontSize:10, color:"var(--text-2)" }}>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
