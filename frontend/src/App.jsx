import { useState, useEffect } from "react"
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AnimatePresence, motion } from "framer-motion"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { DashboardProvider } from "./context/DashboardContext"
import ToastContainer from "./components/ToastContainer"

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
import Profile from "./pages/Profile"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-theme-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-accent"></div>
      </div>
    )
  }
  if (!user) return <Navigate to="/login" replace />
  return children
}

const pageVariants = {
  initial: { opacity: 0, y: 10, scale: 0.99 },
  in: { opacity: 1, y: 0, scale: 1 },
  out: { opacity: 0, y: -10, scale: 0.99 }
}

const pageTransition = {
  type: "tween",
  ease: "circOut",
  duration: 0.25
}

function AnimatedOutlet() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="h-full w-full"
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  )
}

function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const notifications = [
    { id: 1, message: "Welcome to HireSense UI!" },
    { id: 2, message: "Your ATS score is now available for John Doe." }
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-theme-bg text-theme-text font-sans selection:bg-theme-accent/30 selection:text-white">
      {/* SIDEBAR (Left) */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative w-full h-full bg-theme-bg overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.5)] z-20">
        <Header notifications={notifications} />
        
        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto w-full px-6 py-6 pb-20 scroll-smooth">
            <AnimatedOutlet />
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
        <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff', border: '1px solid #2a2a2a' } }} />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyzer" element={<ResumeAnalyzer />} />
            <Route path="/matching" element={<CandidateMatching />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </DashboardProvider>
    </AuthProvider>
  )
}

export default App
