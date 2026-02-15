import { useNavigate } from 'react-router-dom'

function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-12">
        Data Manager Application
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Add Data Button */}
        <div 
          onClick={() => navigate('/add')}
          className="bg-white p-8 rounded-2xl shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-blue-100"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Add Data</h2>
            <p className="text-gray-600 mb-4">
              Click here to add new data to the database
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Go to Add Page
            </button>
          </div>
        </div>

        {/* Fetch Data Button */}
        <div 
          onClick={() => navigate('/fetch')}
          className="bg-white p-8 rounded-2xl shadow-xl cursor-pointer hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-green-100"
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Fetch Data</h2>
            <p className="text-gray-600 mb-4">
              Click here to fetch all data from the database with timestamps
            </p>
            <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Go to Fetch Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage