import { useState, useEffect } from 'react'
import './index.css'
import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import FormsViewer from './components/FormsViewer'
import SampleQueries from './components/SampleQueries'
import FuzzySearchTable from './components/FuzzySearchTable'
import AIBot from './components/AIBot'

function App() {
  const [activeTab, setActiveTab] = useState('home') // 'home', 'search' or 'chat'

  const API_BASE = 'http://127.0.0.1:8000'

  // Check API health on component mount
  useEffect(() => {
    checkHealth()
  }, [])

  const checkHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/`)
      const data = await res.json()
      setHealthStatus(data)
    } catch (error) {
      console.error('Health check failed:', error)
      setHealthStatus({ status: 'error', model_loaded: false, total_documents: 0 })
    }
  }

  return (
    <div className="h-[100dvh] bg-stone-200 flex flex-col overflow-y-auto ">
      {/* Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Main Content */}
      <div className="bg-stone-200 px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Content */}
        {activeTab === 'home' ? (
          <HomePage setActiveTab={setActiveTab} />
        ) : activeTab === 'search' ? (
          <FuzzySearchTable />
        ) : (
          <AIBot />
        )}

        {/* Footer */}
        <div className="text-center mt-12 py-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Powered by RAG (Retrieval-Augmented Generation) • IRS Forms Database
          </p>
        </div>

        {/* Forms Modal moved into AIBot component if used there */}
      </div>
    </div>
  )
}

export default App
