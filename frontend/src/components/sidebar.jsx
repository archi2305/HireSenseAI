function Sidebar({ setPage }) {

  return (

    <div className="w-64 h-screen bg-gray-900 text-white p-6">

      <h1 className="text-2xl font-bold mb-10">
        HireSense AI
      </h1>

      <div className="flex flex-col gap-4">

        <button
          onClick={() => setPage("analyze")}
          className="text-left hover:bg-gray-700 p-2 rounded"
        >
          Analyze Resume
        </button>

        <button
          onClick={() => setPage("history")}
          className="text-left hover:bg-gray-700 p-2 rounded"
        >
          History
        </button>

      </div>

    </div>

  )

}

export default Sidebar