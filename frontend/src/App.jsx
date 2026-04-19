import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useState } from "react"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { DashboardProvider } from "./context/DashboardContext"
import { AnalysisProvider } from "./context/AnalysisContext"
import PageTransition from "./components/PageTransition"
import CommandPalette from "./components/CommandPalette"
import FloatingChatbot from "./components/FloatingChatbot"

import Sidebar from "./components/sidebar"
import Header from "./components/Header"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Analyzer from "./pages/Analyzer"
import History from "./pages/History"
import Results from "./pages/Results"
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

  if (!user) return <Navigate to="/login" />
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
      <motion.div
        aria-hidden
        style={{
          position:"absolute",
          top:"-14%",
          right:"-8%",
          width:"42%",
          height:"42%",
          background:"radial-gradient(circle, rgba(124, 58, 237, 0.18) 0%, rgba(99, 102, 241, 0.05) 56%, transparent 74%)",
          borderRadius:"50%",
          filter:"blur(78px)",
          pointerEvents:"none",
          zIndex:0,
        }}
        animate={{ x: [0, 18, -10, 0], y: [0, -12, 8, 0], scale: [1, 1.06, 0.98, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        style={{
          position:"absolute",
          bottom:"-16%",
          left:"-10%",
          width:"40%",
          height:"40%",
          background:"radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, rgba(79, 70, 229, 0.05) 58%, transparent 76%)",
          borderRadius:"50%",
          filter:"blur(80px)",
          pointerEvents:"none",
          zIndex:0,
        }}
        animate={{ x: [0, -14, 12, 0], y: [0, 10, -8, 0], scale: [1, 0.95, 1.04, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
      <Sidebar onCommandPalette={() => setCmdOpen(true)} />

      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, height:"100%", overflow:"hidden", position:"relative", zIndex:10 }}>
        <Header notifications={notifications} onCommandPalette={() => setCmdOpen(true)} />
        <main style={{ flex:1, overflowY:"auto", width:"100%" }}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="analyzer"  element={<PageTransition><Analyzer /></PageTransition>} />
              <Route path="results/:id" element={<PageTransition><Results /></PageTransition>} />
              <Route path="results" element={<Navigate to="/history" replace />} />
              <Route path="history"   element={<PageTransition><History /></PageTransition>} />
              <Route path="profile"   element={<PageTransition><Profile /></PageTransition>} />
              <Route path="preferences" element={<PageTransition><Settings /></PageTransition>} />
              <Route path="settings"  element={<PageTransition><Settings /></PageTransition>} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
      <FloatingChatbot />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <AnalysisProvider>
          <Toaster 
            position="top-right" 
            containerStyle={{ zIndex: 1200, top: 16, right: 16 }}
            toastOptions={{ 
              className: '!border-theme-border !text-theme-text !bg-theme-surface !shadow-lg',
              duration: 4000,
              style: { maxWidth: "320px", marginTop: "20px", marginRight: "20px", borderRadius: "12px" }
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
        </AnalysisProvider>
      </DashboardProvider>
    </AuthProvider>
  )
}

export default App
