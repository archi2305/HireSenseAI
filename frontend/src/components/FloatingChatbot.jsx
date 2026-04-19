import { useEffect, useRef, useState } from "react"
import { MessageCircle, Send, X } from "lucide-react"
import { API_BASE_URL } from "../services/api"
import { useAnalysis } from "../context/AnalysisContext"

const initialMessages = [
  { id: 1, role: "bot", text: "Hi, I am your resume assistant. Ask me how to improve your resume." },
]

export default function FloatingChatbot() {
  const { analysisResult, analysisInput } = useAnalysis()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState(initialMessages)
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, open])

  const sendMessage = async () => {
    const content = input.trim()
    if (!content || loading) return

    const userMsg = { id: Date.now(), role: "user", text: content }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const history = messages
        .map((msg) => msg.text)
        .filter(Boolean)
        .slice(-8)
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history,
          role: analysisInput?.role || analysisResult?.job_role,
          resume_id: analysisResult?.id,
        }),
      })
      const data = await response.json().catch(() => ({}))
      const reply = data?.reply || "Add quantified achievements and relevant skills."
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "bot", text: reply }])
    } catch (_) {
      const lower = content.toLowerCase()
      let reply = "Add quantified achievements and relevant skills."
      if (lower.includes("improve")) {
        reply = "Try stronger verbs and include measurable outcomes for each bullet."
      } else if (lower.includes("skills")) {
        reply = "Add a clear skills section and match skills from the target job description."
      }
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: "bot", text: reply }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 130 }}>
      {!open ? (
        <button className="btn btn-primary" onClick={() => setOpen(true)} style={{ borderRadius: 999, width: 54, height: 54, justifyContent: "center", padding: 0 }}>
          <MessageCircle size={20} />
        </button>
      ) : (
        <div className="card" style={{ width: 340, height: 440, display: "grid", gridTemplateRows: "auto 1fr auto", overflow: "hidden", backdropFilter: "blur(10px)" }}>
          <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong style={{ fontSize: 14 }}>AI Resume Assistant</strong>
            <button className="btn btn-secondary" style={{ padding: 6 }} onClick={() => setOpen(false)}>
              <X size={14} />
            </button>
          </div>

          <div ref={listRef} style={{ padding: 12, overflowY: "auto", display: "grid", gap: 8, alignContent: "start" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  justifySelf: msg.role === "user" ? "end" : "start",
                  background: msg.role === "user" ? "var(--accent)" : "var(--bg)",
                  color: msg.role === "user" ? "#fff" : "var(--text)",
                  border: msg.role === "user" ? "none" : "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "8px 10px",
                  maxWidth: "85%",
                  fontSize: 13,
                }}
              >
                {msg.text}
              </div>
            ))}
            {loading ? <p style={{ margin: 0, color: "var(--text-2)", fontSize: 12 }}>Thinking...</p> : null}
          </div>

          <div style={{ borderTop: "1px solid var(--border)", padding: 10, display: "flex", gap: 8 }}>
            <input
              className="input"
              placeholder="Ask about resume improvements..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  sendMessage()
                }
              }}
            />
            <button className="btn btn-primary" onClick={sendMessage} disabled={loading}>
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
