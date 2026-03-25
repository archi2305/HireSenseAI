import { useEffect, useState } from "react"
import axios from "axios"
import { TrendingUp, FileCheck, Zap, CheckCircle, ArrowUpRight, ArrowDownRight, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function CountUp({ end }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!end || isNaN(+end)) { setVal(end); return }
    const n = parseFloat(end)
    let start = 0
    const dur = 1600
    const step = 16
    const inc = n / (dur / step)
    const t = setInterval(() => {
      start += inc
      if (start >= n) { setVal(end); clearInterval(t) }
      else setVal(typeof end === "string" && end.includes("%") ? `${Math.round(start)}%` : Math.round(start))
    }, step)
    return () => clearInterval(t)
  }, [end])
  return <span>{val}</span>
}

/* ── Detail Modal ── */
function StatModal({ item, onClose }) {
  return (
    <AnimatePresence>
      {item && (
        <>
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onClose}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.3)", backdropFilter:"blur(4px)", zIndex:40 }}
          />
          <motion.div
            initial={{ opacity:0, scale:.9, y:24 }}
            animate={{ opacity:1, scale:1, y:0 }}
            exit={{ opacity:0, scale:.9, y:24 }}
            style={{
              position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
              background:"var(--surface)", border:"1px solid var(--border)", borderRadius:20,
              padding:36, zIndex:50, width: "min(440px, 92vw)",
              boxShadow:"0 24px 64px rgba(0,0,0,.15)"
            }}
          >
            <button
              onClick={onClose}
              style={{ position:"absolute", top:16, right:16, background:"var(--bg)", border:"1px solid var(--border)", borderRadius:8, padding:6, cursor:"pointer", display:"flex" }}
            >
              <X size={15} style={{ color:"var(--text-2)" }} />
            </button>

            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
              <div style={{ background:`${item.color}18`, borderRadius:14, padding:12 }}>
                <item.icon size={22} style={{ color:item.color }} />
              </div>
              <div>
                <p style={{ fontWeight:800, fontSize:18, color:"var(--text)", margin:0 }}>{item.title}</p>
                <p style={{ fontSize:12, color:"var(--text-2)", margin:0 }}>Detailed breakdown</p>
              </div>
            </div>

            <div style={{ fontSize:48, fontWeight:900, color:"var(--text)", marginBottom:8 }}>
              <CountUp end={item.value} />
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:20 }}>
              <span style={{ fontSize:13, fontWeight:700, color: item.isPositive ? "#10b981" : "#ef4444" }}>
                {item.change}
              </span>
              <span style={{ fontSize:12, color:"var(--text-2)" }}>vs last period</span>
            </div>
            <p style={{ fontSize:13, color:"var(--text-2)", lineHeight:1.7 }}>
              This metric reflects the {item.title.toLowerCase()} across all active pipelines.
              Performance has been {item.isPositive ? "trending upward" : "declining"} over the selected period.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function StatsCards() {
  const [stats, setStats] = useState({ total_resumes:0, avg_score:0, total_analyses:0, active_jobs:12 })
  const [loading, setLoading] = useState(true)
  const [activeModal, setActiveModal] = useState(null)

  useEffect(() => {
    axios.get(`${API_BASE}/dashboard`)
      .then(r => setStats(prev => ({ ...prev, ...r.data })))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const items = [
    { title:"Processed Files",   value: stats.total_resumes ?? 0,      change:"+12.5%", isPositive:true,  icon:FileCheck,    color:"#6366f1" },
    { title:"Average Match",     value:`${stats.avg_score ?? 0}%`,     change:"-2.1%",  isPositive:false, icon:TrendingUp,   color:"#10b981" },
    { title:"System Throughput", value: stats.total_analyses ?? 0,     change:"+5.1%",  isPositive:true,  icon:Zap,          color:"#f59e0b" },
    { title:"Active Pipelines",  value: stats.active_jobs ?? 12,       change:"Stable", isPositive:true,  icon:CheckCircle,  color:"#3b82f6" },
  ]

  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:18 }}>
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
            transition={{ delay: idx*0.07 }}
            whileHover={{ y:-4, boxShadow:"var(--shadow-lg)" }}
            onClick={() => setActiveModal(item)}
            style={{
              background:"var(--surface)", border:"1px solid var(--border)",
              borderRadius:16, padding:22, cursor:"pointer",
              boxShadow:"var(--shadow-sm)", transition:"box-shadow .3s, border-color .3s",
              position:"relative", overflow:"hidden"
            }}
          >
            {/* Glow orb */}
            <div style={{
              position:"absolute", top:-20, right:-20, width:80, height:80,
              background:`${item.color}20`, borderRadius:"50%", filter:"blur(20px)",
              pointerEvents:"none"
            }} />
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14, position:"relative" }}>
              <div style={{ background:`${item.color}18`, borderRadius:10, padding:9 }}>
                <item.icon size={17} style={{ color:item.color }} />
              </div>
              <div style={{
                display:"flex", alignItems:"center", gap:3,
                background: item.isPositive ? "#10b98114" : "#ef444414",
                border: `1px solid ${item.isPositive ? "#10b98130" : "#ef444430"}`,
                color: item.isPositive ? "#10b981" : "#ef4444",
                borderRadius:99, padding:"2px 8px", fontSize:10, fontWeight:800
              }}>
                {item.isPositive ? <ArrowUpRight size={11}/> : <ArrowDownRight size={11}/>}
                {item.change}
              </div>
            </div>
            <p style={{ fontSize:11, fontWeight:700, color:"var(--text-2)", margin:"0 0 4px", textTransform:"uppercase", letterSpacing:".06em" }}>
              {item.title}
            </p>
            <p style={{ fontSize:28, fontWeight:900, color:"var(--text)", margin:0, letterSpacing:"-.02em" }}>
              {loading ? <span className="skeleton" style={{ display:"inline-block",width:60,height:24 }} /> : <CountUp end={item.value} />}
            </p>
          </motion.div>
        ))}
      </div>

      <StatModal item={activeModal} onClose={() => setActiveModal(null)} />
    </>
  )
}

export default StatsCards
