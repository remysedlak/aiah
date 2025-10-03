import React from 'react'

const Pagination = ({ currentPage, totalPages, onPageChange, startIndex, itemsPerPage, totalResults }) => {
  const maxButtons = 5
  let start = Math.max(1, currentPage - Math.floor(maxButtons / 2))
  let end = start + maxButtons - 1
  if (end > totalPages) {
    end = totalPages
    start = Math.max(1, end - maxButtons + 1)
  }
  const pages = []
  for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="flex items-center justify-between mt-4 px-2">
      <div className="text-sm text-gray-600">
        {totalResults > 0 ? `Showing ${startIndex + 1}–${Math.min(totalResults, startIndex + itemsPerPage)} of ${totalResults}` : 'No results'}
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md text-sm ${currentPage === 1 ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-white border'}`}
        >
          Prev
        </button>

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded-md text-sm ${p === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            {p}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className={`px-3 py-1 rounded-md text-sm ${currentPage >= totalPages ? 'text-gray-400 bg-gray-100' : 'text-gray-700 bg-white border'}`}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Pagination
