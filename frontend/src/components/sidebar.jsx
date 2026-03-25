import React, { useState, useRef, useEffect } from "react"
import { LayoutDashboard, FileText, History, Settings, Target, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { motion, LayoutGroup } from "framer-motion"
import Tooltip from "./Tooltip"

function Sidebar() {
  const location = useLocation()
  
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Resume Analyzer", path: "/analyzer", icon: FileText },
    { name: "Candidate Match", path: "/matching", icon: Target },
    { name: "History", path: "/history", icon: History },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings }
  ]

  // Linear-inspired animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: -30 },
    show: {
      opacity: 1,
      x: 0,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.9 },
    show: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25,
        mass: 0.8
      } 
    }
  }

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    show: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 20
      } 
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-72 h-full bg-white/70 backdrop-blur-md border-r border-white/50 flex flex-col p-6 shadow-glass z-30"
    >
      <motion.div 
        variants={logoVariants}
        className="mb-12 px-3 flex items-center gap-4"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div 
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-indigo to-brand-purple flex items-center justify-center shadow-card"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <FileText className="w-6 h-6 text-white" />
        </motion.div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-indigo to-brand-purple tracking-tight">
          HireSense
        </h2>
      </motion.div>

      <nav className="flex-1">
        <LayoutGroup>
          <ul className="space-y-3 relative">
            {menu.map((item, index) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <motion.li 
                  key={item.name} 
                  variants={itemVariants}
                  className="relative group"
                  layout
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-pastel-indigo to-pastel-purple border border-brand-indigo/20 rounded-2xl shadow-sm"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Tooltip content={item.name}>
                    <Link
                      to={item.path}
                      className={`relative z-10 flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium text-sm
                      ${isActive 
                        ? "text-brand-indigo" 
                        : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                      }`}
                    >
                      <motion.div 
                        whileHover={{ scale: 1.15, rotate: 5 }} 
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                      >
                        <Icon 
                          size={20} 
                          className={`transition-colors duration-300 ${isActive ? "text-brand-indigo" : "text-slate-400 group-hover:text-brand-indigo"}`} 
                        />
                      </motion.div>
                      <span className="font-medium tracking-tight">{item.name}</span>
                      
                      {isActive && (
                        <motion.div 
                          layoutId="sidebar-dot"
                          className="ml-auto w-2.5 h-2.5 rounded-full bg-gradient-to-r from-brand-indigo to-brand-purple shadow-sm" 
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </Link>
                  </Tooltip>
                </motion.li>
              )
            })}
          </ul>
        </LayoutGroup>
      </nav>
      
      <motion.div 
        variants={itemVariants}
        className="mt-auto pt-12"
      >
        <div className="p-6 bg-gradient-to-br from-pastel-indigo/50 to-pastel-purple/50 rounded-2xl border border-brand-indigo/20 text-center hover:shadow-card transition-all duration-300">
          <motion.div 
            className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-indigo to-brand-purple flex items-center justify-center shadow-card"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Target className="w-6 h-6 text-white" />
          </motion.div>
          <p className="text-sm font-semibold text-slate-700 mb-2 tracking-tight">Upgrade to Pro</p>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">Get unlimited resume parsing and advanced analytics</p>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-gradient-to-r from-brand-indigo to-brand-purple text-white rounded-xl text-sm font-semibold shadow-card hover:shadow-card-hover transition-all duration-300"
          >
            View Plans
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Sidebar