import { useState, useEffect } from 'react'
import SampleQueries from './SampleQueries'
import FormsViewer from './FormsViewer'

const AIBot = () => {
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)
  const [healthStatus, setHealthStatus] = useState(null)
  const [useGeneration, setUseGeneration] = useState(true)
  const [topK, setTopK] = useState(3)
  const [showFormsModal, setShowFormsModal] = useState(false)

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          use_generation: useGeneration,
          top_k: topK
        })
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      setResponse(data)
    } catch (error) {
      console.error('Query failed:', error)
      setResponse({
        error: 'Failed to get response from API. Make sure the backend is running.',
        query: query
      })
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResponse(null)
    setQuery('')
  }

  const handleSampleQuery = (sampleQuery) => {
    setQuery(sampleQuery)
    setResponse(null)
  }

  return (
    <div>
      {/* Health Status */}
      <div className="mb-6 p-4 rounded-lg border bg-white shadow-sm lg:max-w-7xl mx-auto ">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <span className="font-semibold text-gray-700 text-sm sm:text-base">API Status:</span>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              healthStatus?.status === 'healthy'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {healthStatus?.status || 'Unknown'}
            </span>
            {healthStatus && (
              <span className="text-xs sm:text-sm text-gray-600">
                {healthStatus.total_documents} documents loaded
              </span>
            )}
            <button 
              onClick={checkHealth}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Sample Queries - Show only when no response */}
      {!response && !loading && (
        <SampleQueries onQuerySelect={handleSampleQuery} />
      )}

      {/* Query Form */}
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6 lg:max-w-7xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ask about IRS forms:
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'What form do I need for individual income tax?' or 'How do I report contractor payments?'"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
              rows={3}
              disabled={loading}
            />
          </div>

          {/* Options */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 sm:items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={useGeneration}
                onChange={(e) => setUseGeneration(e.target.checked)}
                className="mr-2 rounded"
              />
              <span className="text-sm text-gray-700">Generate AI answer</span>
            </label>

            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-700">Top results:</label>
              <select
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1</option>
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
            >
              {loading ? 'Searching...' : 'Search IRS Forms'}
            </button>
            
            {response && (
              <button
                type="button"
                onClick={clearResults}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Results */}
      {response && (
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          {response.error ? (
            <div className="text-red-600">
              <h3 className="text-lg font-semibold mb-2 flex items-center">
                <span className="mr-2">⚠️</span>
                Error
              </h3>
              <p className="text-sm sm:text-base">{response.error}</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* AI Answer */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2">🤖</span>
                  AI Answer
                </h3>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded-r-lg">
                  <p className="text-gray-800 leading-relaxed text-sm sm:text-base">{response.answer}</p>
                </div>
              </div>

              {/* Relevant Documents */}
              {response.relevant_files && response.relevant_files.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="mr-2">📋</span>
                    Relevant Forms ({response.relevant_files.length})
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {response.relevant_files.map((file, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-sm transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 space-y-1 sm:space-y-0">
                          <h4 className="font-medium text-gray-900 text-sm sm:text-base">{file.filename}</h4>
                          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full self-start">
                            {(file.similarity * 100).toFixed(1)}% match
                          </span>
                        </div>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed">{file.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Query Info */}
              <div className="text-xs sm:text-sm text-gray-500 pt-3 sm:pt-4 border-t">
                <div className="break-words">
                  Query: "{response.query}" • Total documents: {response.total_documents}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Searching through IRS forms...</p>
        </div>
      )}

      {/* Forms Modal */}
      <FormsViewer 
        isOpen={showFormsModal} 
        onClose={() => setShowFormsModal(false)} 
      />
    </div>
  )
}

export default AIBot
