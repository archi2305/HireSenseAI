import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { DashboardProvider } from "./context/DashboardContext"
import ToastContainer from "./components/ToastContainer"
import PageTransition from "./components/PageTransition"
import CommandPalette from "./components/CommandPalette"

import Sidebar from "./components/sidebar"
import Header from "./components/Header"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import ResumeAnalyzer from "./components/ResumeAnalyzer"
import CandidateMatching from "./pages/CandidateMatching"
import History from "./pages/History"
import Settings from "./pages/Settings"
import OAuthSuccess from "./pages/OAuthSuccess"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Profile from "./pages/Profile"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ height:"100vh", width:"100vw", display:"flex", alignItems:"center", justifyContent:"center", background:"var(--bg)" }}>
        <motion.div
          animate={{ scale:[1,1.2,1], opacity:[.5,1,.5] }}
          transition={{ repeat:Infinity, duration:1.5 }}
          style={{ width:48, height:48, background:"var(--accent)", borderRadius:"50%", boxShadow:"0 0 32px rgba(99,102,241,.4)" }}
        />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}

function Layout() {
  const location = useLocation()
  const [cmdOpen, setCmdOpen] = useState(false)

  const notifications = [
    { id:1, message:"Welcome to HireSense AI!" },
    { id:2, message:"Engine successfully calibrated." },
  ]

  // Global keyboard shortcut: "/" or Cmd+K
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "/" && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault(); setCmdOpen(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault(); setCmdOpen(true)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <div style={{ display:"flex", height:"100vh", width:"100%", background:"var(--bg)", overflow:"hidden", position:"relative" }}>
      {/* Soft bg glows */}
      <div style={{ position:"absolute", top:"-10%", right:"-10%", width:"40%", height:"40%", background:"rgba(99,102,241,.04)", borderRadius:"50%", filter:"blur(120px)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-10%", left:"-10%", width:"40%", height:"40%", background:"rgba(59,130,246,.04)", borderRadius:"50%", filter:"blur(120px)", pointerEvents:"none" }} />

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <Sidebar onCommandPalette={() => setCmdOpen(true)} />

      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, height:"100%", overflow:"hidden", position:"relative", zIndex:10 }}>
        <Header notifications={notifications} onCommandPalette={() => setCmdOpen(true)} />
        <main style={{ flex:1, overflowY:"auto", width:"100%" }}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="analyzer"  element={<PageTransition><ResumeAnalyzer /></PageTransition>} />
              <Route path="matching"  element={<PageTransition><CandidateMatching /></PageTransition>} />
              <Route path="history"   element={<PageTransition><History /></PageTransition>} />
              <Route path="profile"   element={<PageTransition><Profile /></PageTransition>} />
              <Route path="settings"  element={<PageTransition><Settings /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <Toaster 
          position="bottom-right" 
          toastOptions={{ 
            className: 'floating-layer backdrop-premium !border-theme-border !text-theme-text !bg-theme-surface/80',
            duration: 4000
          }} 
        />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </DashboardProvider>
    </AuthProvider>
  )
}

export default App
