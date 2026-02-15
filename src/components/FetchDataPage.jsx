import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function FetchDataPage() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    totalRecords: 0,
    latestDate: 'N/A',
    latestTime: 'N/A'
  })
  const navigate = useNavigate()

  // ✅ Your deployed backend URL
  const API_BASE_URL = "https://newfolder-backend-583v.vercel.app"

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await axios.get(`${API_BASE_URL}/api/data`)

      let fetchedData = []

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        fetchedData = response.data.data
      } else if (Array.isArray(response.data)) {
        fetchedData = response.data
      } else {
        throw new Error('Invalid response format')
      }

      setData(fetchedData)

      if (fetchedData.length > 0) {
        const latest = fetchedData[0]
        const date = new Date(latest.createdAt)

        setStats({
          totalRecords: fetchedData.length,
          latestDate: date.toLocaleDateString(),
          latestTime: date.toLocaleTimeString()
        })
      } else {
        setStats({
          totalRecords: 0,
          latestDate: 'N/A',
          latestTime: 'N/A'
        })
      }

    } catch (err) {
      console.error("Fetch Error:", err)

      if (err.response) {
        setError(`Server Error: ${err.response.status}`)
      } else {
        setError("Cannot connect to backend server")
      }

      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return "Invalid Date"
    return date.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-blue-600 hover:text-blue-800 font-semibold mr-6"
            >
              ← Back to Home
            </button>
            <h1 className="text-3xl font-bold text-gray-800">All Stored Data</h1>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>

        {loading && (
          <div className="text-center py-20">
            <p className="text-gray-600">Loading data from database...</p>
            <p className="text-gray-400 text-sm mt-2">
              Connected to: {API_BASE_URL}/api/data
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-700">{stats.totalRecords}</div>
                  <div className="text-blue-600 font-semibold">Total Records</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-xl font-bold text-green-700">{stats.latestDate}</div>
                  <div className="text-green-600 font-semibold">Latest Entry Date</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-xl font-bold text-purple-700">{stats.latestTime}</div>
                  <div className="text-purple-600 font-semibold">Latest Entry Time</div>
                </div>
              </div>
            </div>

            {data.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-xl">
                <h3 className="text-2xl font-semibold text-gray-600 mb-3">No Data Found</h3>
                <button
                  onClick={() => navigate('/add')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Go to Add Data
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {data.map((item, index) => (
                  <div
                    key={item._id || index}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                  >
                    <div className="flex justify-between mb-3">
                      <div className="font-semibold">
                        Entry #{index + 1}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.createdAt ? formatDate(item.createdAt) : "Unknown Date"}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  )
}

export default FetchDataPage
