function SkillBadge({ label, type = "matched" }) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2 transition-all duration-200"

  const styles =
    type === "missing"
      ? "bg-brand-pink/20 text-error hover:bg-brand-pink/40"
      : "bg-success/20 text-success-700 hover:bg-success/40"

  return (
    <span className={`${base} ${styles}`}>
      {label}
    </span>
  )
}

export default SkillBadge

