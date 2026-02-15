import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function AddDataPage() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  // ✅ Your Vercel backend URL
  const API_BASE_URL = "https://newfolder-backend-583v.vercel.app"

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!content.trim()) {
      setMessage('Please enter some data')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/data`,
        { content },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )

      setMessage('✅ Data saved successfully!')
      setContent('')

      setTimeout(() => {
        setMessage('')
      }, 3000)

    } catch (error) {
      console.error("Full Error:", error)

      if (error.response) {
        setMessage(`❌ ${error.response.data.message}`)
      } else {
        setMessage('❌ Cannot connect to server')
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
          >
            ← Back to Home
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Add New Data</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-3">
                Enter Your Data
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your data here..."
                className="w-full h-48 p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none resize-none"
                disabled={loading}
              />
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('✅')
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-colors ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading ? 'Saving...' : 'Save to Database'}
              </button>

              <button
                type="button"
                onClick={() => setContent('')}
                disabled={loading}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  )
}

export default AddDataPage
