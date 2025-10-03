import React from 'react'

const MobileCard = ({ form, onClick }) => {
  return (
    <div onClick={() => onClick(form)} className="bg-white border rounded-lg p-3 shadow-sm cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="text-sm font-medium text-blue-600">{form.form_number}</div>
        <div className="text-sm text-gray-600">{form.title}</div>
      </div>
      <div className="mt-2 text-sm text-gray-700 truncate">{form.description}</div>
      <div className="mt-2 flex items-center gap-2">
        {form.use_cases.slice(0,2).map((uc, idx) => (
          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">{uc}</span>
        ))}
        {form.use_cases.length > 2 && <span className="text-xs text-gray-600">+{form.use_cases.length - 2}</span>}
      </div>
    </div>
  )
}

export default MobileCard
