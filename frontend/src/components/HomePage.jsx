const HomePage = ({ setActiveTab }) => {
  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4">
      {/* Hero Section */}
      <div className="text-center py-4">
        <img src="FormForgeLogoText.png" alt="FormForge Logo" className="mx-auto w-100 mb-2" />
        <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto px-2">
          Your intelligent companion for navigating IRS tax forms. Search instantly or chat with our AI to find exactly what you need.
        </p>

        {/* Feature Cards */}
        <div className="grid gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="md:grid md:grid-cols-2 md:gap-8 space-y-6 md:space-y-0">
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow">
              <img src="icons/Search.svg" alt="Search Interface" className="w-12 h-12 sm:w-15 sm:h-15 mb-4 mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 text-center">Instant Search</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base text-center">
                Lightning-fast fuzzy search through all IRS forms. Find forms by number, title, description, or use case in real-time.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Fuzzy Search</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Real-time</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">27+ Forms</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 hover:shadow-md transition-shadow">
              <img src="icons/ChatInterface.svg" alt="Chat Interface" className="w-12 h-12 mb-4 mx-auto" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 text-center">AI Chat</h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base text-center">
                Ask natural language questions and get intelligent answers powered by RAG technology with relevant form suggestions.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">RAG Technology</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Natural Language</span>
                <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">Smart Answers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12 px-2">
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 flex flex-col items-center text-center border border-blue-200">
          <img src="icons/IRS.svg" alt="IRS Forms" className="w-8 h-8 sm:w-10 sm:h-10 mb-2" />
          <div className="text-xs sm:text-sm text-blue-600">27+ IRS Forms</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 sm:p-4 flex flex-col items-center text-center border border-green-200">
          <img src="icons/Fast.svg" alt="Instant Search" className="w-8 h-8 sm:w-10 sm:h-10 mb-2" />
          <div className="text-xs sm:text-sm text-green-600">Instant Search</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 sm:p-4 flex flex-col items-center text-center border border-purple-200">
          <img src="icons/AIPowered.svg" alt="AI Powered" className="w-8 h-8 sm:w-10 sm:h-10 mb-2" />
          <div className="text-xs sm:text-sm text-purple-600">AI Powered</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 sm:p-4 flex flex-col items-center text-center border border-orange-200">
          <img src="icons/MobilePhone.svg" alt="Mobile Ready" className="w-8 h-8 sm:w-10 sm:h-10 mb-2" />
          <div className="text-xs sm:text-sm text-orange-600">Mobile Ready</div>
        </div>
      </div>

      {/* Form Categories */}
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-8 sm:mb-12">
        <div className="flex flex-row items-center justify-center mx-auto gap-x-2 mb-8">
          <img src="icons/form_categories/Category.svg" alt="Available Forms" className="w-6 h-6" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center">
            Available Form Categories
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-3xl mb-2"><img src="icons/form_categories/User.svg" alt="Individual Returns" className="w-8 h-8 mx-auto" /></div>
            <h4 className="font-semibold text-gray-900 mb-2">Individual Returns</h4>
            <p className="text-sm text-gray-600">Forms 1040, 1040-ES, Schedule SE, Schedule 8812</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2"><img src="icons/form_categories/Corporate.svg" alt="Business Returns" className="w-8 h-8 mx-auto" /></div>
            <h4 className="font-semibold text-gray-900 mb-2">Corporate Returns</h4>
            <p className="text-sm text-gray-600">Forms 1120, 1120-S, 1120-W, Schedule M-3</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2"><img src="icons/form_categories/Employment.svg" alt="Employment Forms" className="w-8 h-8 mx-auto" /></div>
            <h4 className="font-semibold text-gray-900 mb-2">Employment Forms</h4>
            <p className="text-sm text-gray-600">Forms W-2, W-4, 941, 940, 944, 1095-C</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2"><img src="icons/form_categories/Handshake.svg" alt="Contractor Forms" className="w-8 h-8 mx-auto" /></div>
            <h4 className="font-semibold text-gray-900 mb-2">Contractor Forms</h4>
            <p className="text-sm text-gray-600">Forms 1099-NEC, 1099-MISC, W-9, SS-8</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2"><img src="icons/form_categories/Handshake.svg" alt="Contractor Forms" className="w-8 h-8 mx-auto" /></div>
            <h4 className="font-semibold text-gray-900 mb-2">Partnership Forms</h4>
            <p className="text-sm text-gray-600">Forms 1065, Schedule K-1</p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-2"><img src="icons/form_categories/Business.svg" alt="Business Forms" className="w-8 h-8 mx-auto" /></div>
            <h4 className="font-semibold text-gray-900 mb-2">Business Forms</h4>
            <p className="text-sm text-gray-600">Forms SS-4, 8829, 4562, 2553, 720</p>
          </div>
        </div>
      </div>

      {/* Popular Searches */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-12">
        <div className="flex flex-row justify-center items-center mb-8">
          <img src="icons/Trending.svg" alt="Trending" className="w-10 h-10 mr-4" />
          <h2 className=" text-2xl text font-bold text-gray-900 text-center">
            Popular Searches
          </h2>


        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-medium">1.</span>
              <span className="text-gray-700">Individual income tax return</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Form 1040</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-medium">2.</span>
              <span className="text-gray-700">Contractor payments</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Form 1099-NEC</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-medium">3.</span>
              <span className="text-gray-700">EIN application</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Form SS-4</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-medium">4.</span>
              <span className="text-gray-700">Home office expenses</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Form 8829</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-medium">5.</span>
              <span className="text-gray-700">Self-employment tax</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Schedule SE</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-medium">6.</span>
              <span className="text-gray-700">Corporate tax return</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Form 1120</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-medium">7.</span>
              <span className="text-gray-700">Partnership income</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Form 1065</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-blue-600 font-medium">8.</span>
              <span className="text-gray-700">Quarterly payroll taxes</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">Form 941</span>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 border border-blue-200">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Choose your preferred way to find IRS forms. Use the instant search for quick lookups or chat with our AI for detailed guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setActiveTab('search')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            > <img src="icons/Search.svg" alt="Search" className="w-6 h-6 mr-2 inline" />
              Try Instant Search
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <img src="icons/ChatInterface.svg" alt="Chat" className="w-6 h-6 mr-2 inline" />
              Chat with AI
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage