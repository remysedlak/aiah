import React from 'react'

const ResultRow = ({ form, onClick, onDownload, onShowMore }) => {
  return (
    <tr className="hover:bg-gray-50 cursor-pointer transition-colors duration-150" onClick={() => onClick(form)}>
      <td className="px-6 py-2 whitespace-nowrap">
        <div className="h-full flex items-center text-sm font-medium text-blue-600">{form.form_number}</div>
      </td>
      <td className="px-6 py-2 align-top">
        <div className="text-sm font-medium text-gray-900 leading-5 break-words whitespace-normal">{form.title}</div>
      </td>
      <td className="px-6 py-2 align-top">
        <div className="text-sm text-gray-700 leading-6 break-words whitespace-normal">{form.description}</div>
      </td>
      <td className="px-6 py-2 align-top">
        <div className="flex flex-wrap gap-2 text-sm">
          {form.use_cases.map((useCase, idx) => (
            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 break-words">{useCase}</span>
          ))}
        </div>
      </td>
      <td className="px-6 py-2 whitespace-nowrap text-sm font-medium">
        <div className="h-full flex items-center">
          <button onClick={(e) => { e.stopPropagation(); onDownload(form.file_url, form.form_number) }} className="text-blue-600 hover:text-blue-900 transition-colors">Download PDF</button>
        </div>
      </td>
    </tr>
  )
}

export default ResultRow
