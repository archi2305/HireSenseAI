import { API_BASE_URL } from "./api"

const mockRoleDefaults = {
  skills: 72,
  experience: 68,
  projects: 64,
}

function buildMockAnalysis({ file, role, jobDescription }) {
  const seed = Date.now() % 17
  const atsScore = Math.max(55, Math.min(89, 68 + seed))
  return {
    id: Date.now(),
    resume_name: file?.name || "mock_resume.pdf",
    job_role: role || "Software Engineer",
    ats_score: atsScore,
    matched_skills: ["communication", "problem solving", "javascript"],
    missing_skills: ["system design", "testing"],
    suggestions: [
      "Add measurable impact statements for recent projects",
      "Highlight role-specific keywords from the job description",
      "Include a dedicated skills section near the top",
    ],
    score_breakdown: {
      skills: mockRoleDefaults.skills + (seed % 6),
      experience: mockRoleDefaults.experience + (seed % 8),
      projects: mockRoleDefaults.projects + (seed % 10),
    },
    created_at: new Date().toISOString(),
    warning: "Using fallback analysis because the API request failed.",
    isMock: true,
    job_description: jobDescription || "",
  }
}

export async function analyzeResume({ file, role, jobDescription }) {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("role", role)
    formData.append("job_description", jobDescription || "")

    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      body: formData,
    })
    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(data?.detail?.message || data?.detail || "Analysis failed")
    }

    return { ...data, isMock: false }
  } catch (_) {
    return buildMockAnalysis({ file, role, jobDescription })
  }
}

export async function fetchAnalysesHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/analyses`)
    if (!response.ok) {
      throw new Error("Failed to fetch analyses")
    }
    return await response.json()
  } catch (_) {
    return []
  }
}

export async function fetchAnalysisById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/analyses/${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch analysis")
    }
    return await response.json()
  } catch (_) {
    return null
  }
}
