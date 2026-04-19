import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import axios from "axios"
import toast from "react-hot-toast"

const DashboardContext = createContext()

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export function DashboardProvider({ children }) {
  const [candidates, setCandidates] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [updateCounter, setUpdateCounter] = useState(0)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [skillFilter, setSkillFilter] = useState("")
  const [minScoreFilter, setMinScoreFilter] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm || roleFilter) {
        params.append("search", `${searchTerm} ${roleFilter}`.trim())
      }
      if (skillFilter) params.append("skills", skillFilter)
      if (minScoreFilter) params.append("min_score", minScoreFilter)

      const [candidatesRes, overviewRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/candidates?${params.toString()}`),
        axios.get(`${API_BASE_URL}/analytics/overview`)
      ])

      setCandidates(candidatesRes.data)
      setAnalytics(overviewRes.data)
      setUpdateCounter((prev) => prev + 1)
    } catch (err) {
      console.error("Failed to load dashboard data", err)
      toast.error("Failed to load pipeline data")
    } finally {
      setLoading(false)
    }
  }, [searchTerm, skillFilter, minScoreFilter, roleFilter])

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDashboardData()
    }, 300)
    return () => clearTimeout(delayDebounce)
  }, [fetchDashboardData])

  const removeCandidate = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/candidate/${id}`)
      toast.success("Candidate deleted successfully")
      fetchDashboardData()
    } catch (err) {
      toast.error("Failed to delete candidate")
    }
  }

  return (
    <DashboardContext.Provider
      value={{
        candidates,
        analytics,
        updateCounter,
        loading,
        searchTerm, setSearchTerm,
        skillFilter, setSkillFilter,
        minScoreFilter, setMinScoreFilter,
        roleFilter, setRoleFilter,
        fetchDashboardData,
        removeCandidate
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => useContext(DashboardContext)
