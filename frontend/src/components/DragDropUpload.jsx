import { useCallback } from "react"
import { Upload } from "lucide-react"

function DragDropUpload({ onFileSelected }) {
  const handleDrop = useCallback(
    (event) => {
      event.preventDefault()
      const file = event.dataTransfer.files?.[0]
      if (file && onFileSelected) onFileSelected(file)
    },
    [onFileSelected],
  )

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleChange = (event) => {
    const file = event.target.files?.[0]
    if (file && onFileSelected) onFileSelected(file)
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-pastelBlue/70 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-pastelBlue/10 hover:bg-pastelBlue/20 transition-all duration-200 cursor-pointer"
    >
      <Upload className="w-8 h-8 text-pastelBlue mb-3" />
      <p className="text-sm text-slate-700 mb-1">
        Drag &amp; drop your resume here
      </p>
      <p className="text-xs text-slate-500 mb-3">
        or click to browse files (PDF, DOC, DOCX)
      </p>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleChange}
        className="hidden"
        id="resume-input"
      />
      <label
        htmlFor="resume-input"
        className="text-xs font-medium text-white bg-pastelBlue px-3 py-1 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
      >
        Choose File
      </label>
    </div>
  )
}

export default DragDropUpload

