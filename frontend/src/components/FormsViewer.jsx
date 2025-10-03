import { useState, useEffect } from 'react'

const FormsViewer = ({ isOpen, onClose }) => {
  const [forms, setForms] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const API_BASE = 'http://127.0.0.1:8000'

  useEffect(() => {
    if (isOpen) {
      fetchForms()
    }
  }, [isOpen])

  const fetchForms = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/forms`)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data = await res.json()
      setForms(data.forms || [])
    } catch (error) {
      console.error('Failed to fetch forms:', error)
      setError('Failed to load forms. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm"
      aria-hidden={!isOpen}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="forms-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 id="forms-title" className="text-xl font-semibold text-gray-900">Available IRS Forms</h2>
          <button
            onClick={onClose}
            aria-label="Close forms dialog"
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[70vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading forms...</p>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-8">
              <p>{error}</p>
              <button
                onClick={fetchForms}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-600 mb-4">
                Total: {forms.length} forms available
              </p>
              {forms.map((form, index) => (
                <div key={index} className="p-3 border border-gray-200 rounded hover:bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">{form.filename}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FormsViewer