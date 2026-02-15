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

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await axios.get('https://finanace-one.vercel.app/api/data')
      
      // Handle different response structures
      let fetchedData = []
      if (response.data && Array.isArray(response.data)) {
        // Direct array response
        fetchedData = response.data
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        // Nested data property
        fetchedData = response.data.data
      } else {
        throw new Error('Invalid data format received from server')
      }
      
      setData(fetchedData)
      
      // Update stats
      if (fetchedData.length > 0) {
        const latest = fetchedData[0]
        const date = new Date(latest.createdAt)
        
        setStats({
          totalRecords: fetchedData.length,
          latestDate: date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          latestTime: date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })
        })
      } else {
        setStats({
          totalRecords: 0,
          latestDate: 'N/A',
          latestTime: 'N/A'
        })
      }
      
    } catch (err) {
      console.error('Error fetching data:', err)
      
      // More specific error messages
      if (err.response) {
        // Server responded with error status
        setError(`Server Error: ${err.response.status} - ${err.response.data?.message || 'Unknown error'}`)
      } else if (err.request) {
        // No response received
        setError('No response from server. Make sure backend is running on port 5000.')
      } else {
        // Other errors
        setError(`Error: ${err.message}`)
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
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return 'Invalid Date'
      }
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  // Debug: Log current state
  useEffect(() => {
    console.log('Current data:', data)
    console.log('Stats:', stats)
  }, [data, stats])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-blue-600 hover:text-blue-800 font-semibold mr-6"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
            <h1 className="text-3xl font-bold text-gray-800">All Stored Data</h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Debug button to check API response */}
            <button
              onClick={() => {
                axios.get('https://finanace-one.vercel.app/api/data')
                  .then(res => {
                    console.log('API Response:', res.data)
                    alert(`API Response Structure:\n\n${JSON.stringify(res.data, null, 2)}`)
                  })
                  .catch(err => console.error('Debug error:', err))
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm"
            >
              Debug API
            </button>
            
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center justify-center bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <svg className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <p className="text-gray-600">Loading data from database...</p>
              <p className="text-gray-400 text-sm mt-2">Connected to: https://finanace-one.vercel.app/api/data</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="text-red-800 font-semibold mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Connection Error
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="text-sm text-red-500">
              <p className="mb-1">Troubleshooting steps:</p>
              <ul className="list-disc pl-5">
                <li>Make sure backend server is running (port 5000)</li>
                <li>Check if MongoDB is connected</li>
                <li>Click "Debug API" button above to see server response</li>
              </ul>
            </div>
          </div>
        )}

        {/* Data Display */}
        {!loading && !error && (
          <>
            {/* Summary Card */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-blue-700">{stats.totalRecords}</div>
                  <div className="text-blue-600 font-semibold">Total Records</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-700">
                    {stats.latestDate}
                  </div>
                  <div className="text-green-600 font-semibold">Latest Entry Date</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-3xl font-bold text-purple-700">
                    {stats.latestTime}
                  </div>
                  <div className="text-purple-600 font-semibold">Latest Entry Time</div>
                </div>
              </div>
              
              {/* Debug info */}
              <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
                <p>Data structure: {Array.isArray(data) ? 'Array' : typeof data} | Length: {data.length}</p>
                <p className="mt-1">First item: {data[0] ? JSON.stringify(data[0]).substring(0, 100) + '...' : 'None'}</p>
              </div>
            </div>

            {/* Data List */}
            {data.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-xl">
                <svg className="w-24 h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-2xl font-semibold text-gray-600 mb-3">No Data Found</h3>
                <p className="text-gray-500 mb-6">Database is empty. Add some data from the Add Data page</p>
                <button
                  onClick={() => navigate('/add')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Go to Add Data
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {data.map((item, index) => (
                  <div 
                    key={item._id || index} 
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-800 rounded-full font-bold text-lg mr-4">
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 font-semibold">
                              Entry #{index + 1}
                            </div>
                            <div className="text-gray-400 text-sm font-mono text-xs">
                              ID: {item._id ? item._id.substring(0, 8) + '...' : 'temp-id'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-gray-700">
                            {item.createdAt ? formatDate(item.createdAt).split(',')[0] : 'Unknown Date'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.createdAt ? new Date(item.createdAt).toLocaleTimeString() : 'Unknown Time'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="text-gray-800 whitespace-pre-wrap break-words font-medium">
                          {item.content || 'No content'}
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                        <div>
                          Character Count: <span className="font-semibold">{item.content ? item.content.length : 0}</span>
                        </div>
                        <div>
                          Word Count: <span className="font-semibold">
                            {item.content ? item.content.split(/\s+/).filter(word => word.length > 0).length : 0}
                          </span>
                        </div>
                      </div>
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