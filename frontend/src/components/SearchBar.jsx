function SearchBar({ value, onChange }) {
  return (
    <input
      type="text"
      placeholder="Search analyses by skill, suggestion, or score..."
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className="border border-slate-200 rounded-xl px-4 py-2 w-full max-w-xl text-sm focus:outline-none focus:ring-2 focus:ring-pastelBlue bg-dashboardBg"
    />
  )
}

export default SearchBar

