import { useState } from 'react'

const Navbar = ({ activeTab, setActiveTab }) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'search', label: 'Table Search', icon: '📋' },
    { id: 'chat', label: 'AI Chat', icon: '💬' },
    { id: 'help', label: 'Help', icon: '❓' }
  ]

  const handleNavClick = (itemId) => {
    if (itemId === 'help') {
      setIsHelpOpen(true)
    } else {
      setActiveTab(itemId)
    }
  }

  return (
    <>
      <nav className="bg-stone-800 shadow-lg border-b text-white border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-blue-600">🏛️</span>
                <span className="ml-2 text-xl font-bold text-white">FormForge</span>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
                    activeTab === item.id && item.id !== 'help'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Help Modal */}
      {isHelpOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold flex items-center">
                <span className="mr-2 ">❓</span>
                Help & Guide
              </h3>
              <button
                onClick={() => setIsHelpOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-80">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                    <span className="mr-2">📋</span>
                    <p className="text-white">Table Search</p>
                  </h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Instant fuzzy search through all IRS forms</li>
                    <li>• Search by form number, title, description, or use cases</li>
                    <li>• Click on any row to see detailed information</li>
                    <li>• Download PDFs directly from the table</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-white mb-3 flex items-center">
                    <span className="mr-2">💬</span>
                    AI Chat
                  </h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Ask natural language questions about tax forms</li>
                    <li>• Get AI-powered answers with relevant form suggestions</li>
                    <li>• Adjust search settings for better results</li>
                    <li>• Uses RAG (Retrieval-Augmented Generation) technology</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    📋 Available Forms
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div>• Individual Returns (1040, 1040-ES)</div>
                    <div>• Corporate Returns (1120, 1120-S)</div>
                    <div>• Employment Forms (W-2, W-4, 941)</div>
                    <div>• Contractor Forms (1099-NEC, W-9)</div>
                    <div>• Partnership Forms (1065, K-1)</div>
                    <div>• Business Forms (SS-4, 8829, 4562)</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">
                    💡 Tips
                  </h4>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Try searches like "payroll", "contractor", or "home office"</li>
                    <li>• Use specific form numbers for exact matches</li>
                    <li>• The AI chat works best with complete questions</li>
                    <li>• All forms link to official IRS PDFs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar