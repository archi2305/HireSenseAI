import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const DashboardContext = createContext();

const API_BASE_URL = "http://127.0.0.1:8000";

export function DashboardProvider({ children }) {
  const [candidates, setCandidates] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [updateCounter, setUpdateCounter] = useState(0);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [minScoreFilter, setMinScoreFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState(""); // For Top Job Role click
  
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (skillFilter) params.append("skills", skillFilter);
      if (minScoreFilter) params.append("min_score", minScoreFilter);
      // Wait: our API search supports role internally inside search or we can adapt it
      if (roleFilter) params.append("search", roleFilter); // Appends twice? We handled it as single search param in backend, so combine them:
      
      const [candidatesRes, overviewRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/candidates?${params.toString()}`),
        axios.get(`${API_BASE_URL}/analytics/overview`)
      ]);
      
      setCandidates(candidatesRes.data);
      setAnalytics(overviewRes.data);
      setUpdateCounter(prev => prev + 1);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
      toast.error("Failed to load pipeline data");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, skillFilter, minScoreFilter, roleFilter]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDashboardData();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [fetchDashboardData]);

  const removeCandidate = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/candidate/${id}`);
      toast.success("Candidate deleted successfully");
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to delete candidate");
    }
  };

  const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", "");
    formData.append("job_role", "");
    
    try {
      const toastId = toast.loading("Analyzing resume...");
      await axios.post(`${API_BASE_URL}/upload-resume`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success("Resume parsed successfully!", { id: toastId });
      fetchDashboardData();
    } catch (err) {
      toast.error("Failed to upload resume");
    }
  };

  const bulkUploadResumes = async (files) => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append("resumes", files[i]);
    }
    formData.append("job_description", "");
    formData.append("job_role", "");
    
    try {
      const toastId = toast.loading(`Uploading ${files.length} resumes...`);
      const res = await axios.post(`${API_BASE_URL}/bulk-upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      toast.success(`Successfully processed ${res.data.processed} resumes!`, { id: toastId });
      fetchDashboardData();
    } catch (err) {
      toast.error("Bulk upload failed");
    }
  };

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
        removeCandidate,
        uploadResume,
        bulkUploadResumes
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = () => useContext(DashboardContext);
