import { CheckCircle2, Circle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const steps = [
  "Please wait...",
  "Loading your resume...",
  "Parsing your resume...",
  "Identifying core sections...",
]

export default function AnalyzerLoadingSteps({ currentStep = 0 }) {
  return (
    <div className="card" style={{ padding: 24, display: "grid", gap: 14 }}>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".08em" }}>
        AI Processing
      </p>
      <AnimatePresence mode="wait">
        <motion.h3
          key={currentStep}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          style={{ margin: 0, fontSize: 20, fontWeight: 800 }}
        >
          {steps[currentStep] || steps[steps.length - 1]}
        </motion.h3>
      </AnimatePresence>
      <div style={{ display: "grid", gap: 10 }}>
        {steps.map((step, idx) => {
          const done = idx < currentStep
          const active = idx === currentStep
          return (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: 8, color: done || active ? "var(--text)" : "var(--text-2)" }}>
              {done ? <CheckCircle2 size={15} color="var(--success)" /> : <Circle size={15} />}
              <span style={{ fontSize: 13, fontWeight: active ? 700 : 500 }}>{step}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
