import { useState, useEffect, useMemo } from 'react'
import Fuse from 'fuse.js'
import { irsFormsData } from '../data/irsFormsData'

const FuzzySearchTable = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState(irsFormsData)
  const [selectedForm, setSelectedForm] = useState(null)

  // Configure Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    const options = {
      includeScore: true,
      threshold: 0.4, // Lower = more strict matching
      keys: [
        { name: 'form_number', weight: 0.3 },
        { name: 'title', weight: 0.3 },
        { name: 'description', weight: 0.2 },
        { name: 'use_cases', weight: 0.2 }
      ]
    }
    return new Fuse(irsFormsData, options)
  }, [])

  // Perform search whenever searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults(irsFormsData)
    } else {
      const results = fuse.search(searchTerm)
      setSearchResults(results.map(result => result.item))
    }
  }, [searchTerm, fuse])

  const handleFormClick = (form) => {
    setSelectedForm(form)
  }

  const handleDownload = (url, formNumber) => {
    window.open(url, '_blank')
  }

  const clearSearch = () => {
    setSearchTerm('')
    setSearchResults(irsFormsData)
  }

  return (
    <div className="bg-white lg:max-w-7xl mx-auto rounded-lg shadow-sm border p-6">
      {/* Search Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <img src="icons/Search.svg" alt="Search Icon" className="w-6 h-6 mr-2" />
            IRS Forms Search
          </h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {searchResults.length} of {irsFormsData.length} forms
          </span>
        </div>
        
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by form number, title, description, or use case... (e.g., '1040', 'payroll', 'contractor')"
            className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600">
            Searching for: "<span className="font-medium">{searchTerm}</span>"
          </p>
        )}
      </div>

      {/* Results Table */}
      <div className="overflow-hidden border border-gray-200 rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Form #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Use Cases
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchResults.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-lg font-medium">No forms found</p>
                      <p className="text-sm">Try adjusting your search terms</p>
                    </div>
                  </td>
                </tr>
              ) : (
                searchResults.map((form, index) => (
                  <tr 
                    key={form.form_number} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    onClick={() => handleFormClick(form)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">
                        {form.form_number}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 leading-5">
                        {form.title}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 leading-5 max-w-md">
                        {form.description.length > 120 
                          ? `${form.description.substring(0, 120)}...`
                          : form.description
                        }
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {form.use_cases.slice(0, 3).map((useCase, idx) => (
                          <span 
                            key={idx}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {useCase}
                          </span>
                        ))}
                        {form.use_cases.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            +{form.use_cases.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(form.file_url, form.form_number)
                        }}
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{searchResults.length}</div>
          <div className="text-sm text-blue-600">Forms Found</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-2xl font-bold text-green-600">{irsFormsData.length}</div>
          <div className="text-sm text-green-600">Total Forms</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round((searchResults.length / irsFormsData.length) * 100)}%
          </div>
          <div className="text-sm text-purple-600">Match Rate</div>
        </div>
      </div>

      {/* Form Detail Modal */}
      {selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-900">
                Form {selectedForm.form_number}
              </h3>
              <button
                onClick={() => setSelectedForm(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <h4 className="text-lg font-medium text-gray-900 mb-3">
                {selectedForm.title}
              </h4>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Description:</h5>
                <p className="text-gray-600 leading-relaxed">{selectedForm.description}</p>
              </div>
              
              <div className="mb-6">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Use Cases:</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedForm.use_cases.map((useCase, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleDownload(selectedForm.file_url, selectedForm.form_number)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Download PDF
                </button>
                <button
                  onClick={() => setSelectedForm(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FuzzySearchTable