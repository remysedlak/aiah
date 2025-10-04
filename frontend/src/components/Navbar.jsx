import { useState } from 'react'

const Navbar = ({ activeTab, setActiveTab }) => {
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      id: 'search',
      label: 'Table Search',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      id: 'chat',
      label: 'AI Chat',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      id: 'help',
      label: 'Help',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ]

  const handleNavClick = (itemId) => {
    if (itemId === 'help') {
      setIsHelpOpen(true)
    } else {
      setActiveTab(itemId)
    }
    setIsMobileMenuOpen(false) // Close mobile menu after selection
  }

  return (
    <>
      <nav className=" sticky top-0 z-50 bg-stone-800 shadow-lg border-b text-white border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <img src="FormForge.png" alt="FormForge Logo" className="size-8 bg-gray-100 p-1 rounded-full mr-2" />
                <span className="text-xl font-bold text-white hidden sm:block">FormForge</span>
                <span className="text-lg font-bold text-white sm:hidden">FF</span>
              </div>
            </div>

            {/* Desktop Navigation Items */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id && item.id !== 'help'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:text-white hover:bg-stone-700'
                    }`}
                >
                  <span className="mr-1 lg:mr-2">{item.icon}</span>
                  <span className="hidden lg:block">{item.label}</span>
                  <span className="lg:hidden">{item.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {!isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-stone-800 border-t border-stone-700">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center w-full px-3 py-3 rounded-md text-base font-medium transition-colors ${activeTab === item.id && item.id !== 'help'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-stone-700'
                    }`}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Help Modal */}
      {isHelpOpen && (
        <div
          onClick={() => setIsHelpOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          aria-hidden={!isHelpOpen}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="help-title"
            aria-describedby="help-desc"
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto max-h-[85vh] overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 border-b">
              <h3 id="help-title" className="text-xl font-semibold flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help & Guide
              </h3>
              <button
                onClick={() => setIsHelpOpen(false)}
                aria-label="Close help dialog"
                className="text-gray-500 hover:text-gray-700 text-3xl"
              >
                ×
              </button>
            </div>

            <div id="help-desc" className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Table Search
                  </h4>
                  <hr className="my-2 text-gray-400 bg-gray-400"></hr>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Instant fuzzy search through all IRS forms</li>
                    <li>• Search by form number, title, description, or use cases</li>
                    <li>• Click on any row to see detailed information</li>
                    <li>• Download PDFs directly from the table</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    AI Chat
                  </h4>
                  <hr className="my-2 text-gray-400 bg-gray-400"></hr>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Ask natural language questions about tax forms</li>
                    <li>• Get AI-powered answers with relevant form suggestions</li>
                    <li>• Adjust search settings for better results</li>
                    <li>• Uses RAG (Retrieval-Augmented Generation) technology</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Available Forms
                  </h4>
                  <hr className="my-2 text-gray-400 bg-gray-400"></hr>
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
                  <h4 className="text-lg font-medium text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Tips
                  </h4>
                  <hr className="my-2  text-gray-400 bg-gray-400"></hr>
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