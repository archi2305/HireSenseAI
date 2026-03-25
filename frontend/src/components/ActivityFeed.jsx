import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, UserPlus, Star, CheckCircle, Zap, RefreshCw } from "lucide-react"

const MOCK = [
  { id:1, type:"parse",  actor:"System",    target:"John_Doe.pdf",           time:"2m ago",  icon:FileText,   color:"#6366f1" },
  { id:2, type:"match",  actor:"Recruiter", target:"Senior Frontend Role",   time:"15m ago", icon:Star,       color:"#f59e0b" },
  { id:3, type:"added",  actor:"HireSense", target:"Sarah Smith",            time:"1h ago",  icon:UserPlus,   color:"#10b981" },
  { id:4, type:"update", actor:"Engine",    target:"Model Updated v2.4",     time:"3h ago",  icon:RefreshCw,  color:"#6b7280" },
  { id:5, type:"parse",  actor:"System",    target:"Mike_Ross.pdf",          time:"5h ago",  icon:FileText,   color:"#6366f1" },
  { id:6, type:"match",  actor:"AI Engine", target:"Backend Engineer",       time:"6h ago",  icon:Zap,        color:"#8b5cf6" },
]

export default function ActivityFeed() {
  const [items, setItems] = useState(MOCK)
  const [tick, setTick] = useState(0)

  // Simulate a new item arriving every 12 s
  useEffect(() => {
    const id = setInterval(() => {
      const newItem = {
        id: Date.now(),
        type:"parse", actor:"System",
        target:`Resume_${Math.floor(Math.random()*1000)}.pdf`,
        time:"just now",
        icon: [FileText, UserPlus, Star, Zap][Math.floor(Math.random()*4)],
        color:["#6366f1","#10b981","#f59e0b","#8b5cf6"][Math.floor(Math.random()*4)],
      }
      setItems(prev => [newItem, ...prev.slice(0, 7)])
      setTick(t => t+1)
    }, 12000)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      background:"var(--surface)", border:"1px solid var(--border)",
      borderRadius:16, padding:"20px", boxShadow:"var(--shadow-sm)",
      height:"100%", minHeight:400
    }}>
      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div className="dot-live" />
          <span style={{ fontSize:12, fontWeight:800, color:"var(--text)", textTransform:"uppercase", letterSpacing:".1em" }}>
            Live Stream
          </span>
        </div>
        <span style={{
          fontSize:9, fontWeight:800, color:"var(--accent)", textTransform:"uppercase",
          letterSpacing:".08em", background:"rgba(99,102,241,.1)", borderRadius:99,
          padding:"2px 8px", border:"1px solid rgba(99,102,241,.2)"
        }}>
          Real-time
        </span>
      </div>

      {/* Timeline */}
      <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
        <AnimatePresence>
          {items.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.id}
                initial={{ opacity:0, x:20, height:0 }}
                animate={{ opacity:1, x:0, height:"auto" }}
                exit={{ opacity:0, x:-20, height:0 }}
                transition={{ duration:.35, ease:"easeOut" }}
                style={{ display:"flex", gap:12, paddingBottom:16, position:"relative" }}
              >
                {/* Line */}
                {idx < items.length-1 && (
                  <div style={{
                    position:"absolute", left:14, top:28, bottom:0, width:1,
                    background:"var(--border)"
                  }} />
                )}
                {/* Icon dot */}
                <div style={{
                  width:28, height:28, borderRadius:"50%", flexShrink:0,
                  background:`${item.color}18`, border:`1.5px solid ${item.color}40`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  position:"relative", zIndex:1
                }}>
                  <Icon size={13} style={{ color:item.color }} />
                </div>
                {/* Text */}
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:12, color:"var(--text)", fontWeight:600, margin:0, lineHeight:1.4 }}>
                    <span style={{ fontWeight:800 }}>{item.actor}</span>
                    <span style={{ color:"var(--text-2)" }}> · {item.type} </span>
                  </p>
                  <p style={{ fontSize:11, color:"var(--text-2)", margin:"2px 0 0", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {item.target}
                  </p>
                  <p style={{ fontSize:10, color:"var(--text-2)", opacity:.5, margin:"3px 0 0", fontFamily:"monospace" }}>
                    {item.time}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
