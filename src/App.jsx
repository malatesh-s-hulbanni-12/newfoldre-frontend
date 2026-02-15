import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './components/HomePage'
import AddDataPage from './components/AddDataPage'
import FetchDataPage from './components/FetchDataPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddDataPage />} />
        <Route path="/fetch" element={<FetchDataPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App