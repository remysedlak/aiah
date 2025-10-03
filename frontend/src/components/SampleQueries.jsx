const SampleQueries = ({ onQuerySelect }) => {
  const sampleQueries = [
    "What form do I need for individual income tax?",
    "How do I report contractor payments?",
    "What's the form for business expenses in my home office?",
    "I need to file quarterly taxes for my corporation",
    "How do I apply for an EIN number?",
    "What form do partnerships use?",
    "How do I report self-employment tax?",
    "What's the difference between W-2 and 1099-NEC?"
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">💡</span>
        Try these sample questions:
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {sampleQueries.map((query, index) => (
          <button
            key={index}
            onClick={() => onQuerySelect(query)}
            className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <span className="text-sm text-gray-700">{query}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default SampleQueries