import { Link } from "react-router-dom"
function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">HireSense</h1>

    <ul className="space-y-4">

  <li>
    <Link to="/" className="hover:text-blue-400">
      Dashboard
    </Link>
  </li>

  <li>
    <Link to="/" className="hover:text-blue-400">
      Analyze Resume
    </Link>
  </li>

  <li>
    <Link to="/history" className="hover:text-blue-400">
      History
    </Link>
  </li>

</ul>
    </div>
  )
}

export default Sidebar