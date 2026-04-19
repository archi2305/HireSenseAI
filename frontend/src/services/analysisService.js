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
    ai_suggestions: [
      {
        original: "Built inventory system",
        improved: "Developed scalable inventory system reducing stock errors by 30%.",
        tips: ["Add measurable results", "Use action verbs", "Mention tools used"],
      },
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

function buildAiSuggestions(result) {
  if (Array.isArray(result?.ai_suggestions) && result.ai_suggestions.length > 0) {
    const unique = result.ai_suggestions.filter(
      (item, idx, arr) =>
        arr.findIndex((other) => `${other?.original}|${other?.improved}` === `${item?.original}|${item?.improved}`) === idx
    )
    return unique.slice(0, 1)
  }

  const missing = Array.isArray(result?.missing_skills) ? result.missing_skills : []
  const target = missing.slice(0, 3)
  if (target.length === 0) {
    return [
      {
        original: "Built internal dashboard",
        improved: "Built internal dashboard that reduced manual reporting time by 35%.",
        tips: ["Add measurable results", "Use action verbs", "Mention tools used"],
      },
    ].slice(0, 1)
  }

  return target.map((skill) => ({
    original: `Worked on ${skill} features`,
    improved: `Implemented ${skill} features that improved delivery speed by 25%.`,
    tips: ["Add measurable results", "Use action verbs", `Mention tools used for ${skill}`],
  })).slice(0, 1)
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

    return { ...data, ai_suggestions: buildAiSuggestions(data), isMock: false }
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
    const data = await response.json()
    return { ...data, ai_suggestions: buildAiSuggestions(data) }
  } catch (_) {
    return null
  }
}

export async function improveBullet({ bullet, context }) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/improve-bullet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bullet, context }),
    })
    if (!response.ok) throw new Error("Unable to improve bullet")
    return await response.json()
  } catch (_) {
    return {
      original: bullet,
      improved: `Improved: ${bullet}. Delivered measurable business impact.`,
      tips: ["Add measurable results", "Use action verbs", "Mention tools used"],
    }
  }
}

export async function generateCoverLetter({
  resumeId,
  role,
  jobDescription,
  matchedSkills,
  highlights,
  tone,
  paragraphs,
}) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-cover-letter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume_id: resumeId,
        role,
        job_description: jobDescription,
        matched_skills: matchedSkills || [],
        highlights: highlights || [],
        tone: tone || "formal",
        paragraphs: paragraphs || 5,
      }),
    })
    if (!response.ok) {
      throw new Error("Failed to generate cover letter")
    }
    return await response.json()
  } catch (_) {
    return {
      cover_letter:
        "Dear Hiring Manager,\n\nI am excited to apply for this opportunity. My background aligns strongly with your requirements, and I focus on delivering measurable outcomes.\n\nI have hands-on experience across the required stack and consistently improve reliability, quality, and delivery speed.\n\nThank you for your consideration.\n\nSincerely,\nCandidate",
    }
  }
}
