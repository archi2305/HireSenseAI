function SkillBadge({ label, type = "matched" }) {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mr-2 mb-2 transition-all duration-200"

  const styles =
    type === "missing"
      ? "bg-softPink/20 text-rose-600 hover:bg-softPink/40"
      : "bg-mint/20 text-emerald-700 hover:bg-mint/40"

  return (
    <span className={`${base} ${styles}`}>
      {label}
    </span>
  )
}

export default SkillBadge

