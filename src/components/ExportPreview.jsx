import React from 'react'
import PropTypes from 'prop-types'
import { CheckCircle, Info } from 'lucide-react'

/**
 * ExportPreview - Shows a preview table of export data with color-coded row types and a legend.
 * Accessible, production-ready, and styled with Tailwind.
 */
function ExportPreview({ previewRows, getRowType, headers }) {
  // Color legend for row types
  const legend = [
    { type: 'new', label: 'New', className: 'bg-green-100 text-green-800 border-green-300' },
    { type: 'changed', label: 'Changed', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { type: 'unchanged', label: 'Unchanged', className: 'bg-gray-100 text-gray-700 border-gray-300' },
  ]
  return (
    <section aria-labelledby="export-preview-title" className="mb-8">
      <div className="mb-2 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-success-500" />
        <h2 id="export-preview-title" className="text-xl font-bold text-success-700">Export Preview</h2>
      </div>
      <div className="flex items-center gap-4 mb-2">
        <span className="font-medium text-gray-700">Legend:</span>
        {legend.map(l => (
          <span key={l.type} className={`inline-block px-2 py-0.5 rounded text-xs border ${l.className}`}>{l.label}</span>
        ))}
        <span className="text-gray-400" title="Rows are color-coded by type (new, changed, unchanged)."><Info className="w-4 h-4 inline ml-1" aria-hidden /></span>
      </div>
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        {previewRows.length > 1 ? (
          <>
            <div className="font-medium mb-2 text-gray-700">First 10 rows to be exported:</div>
            <table className="min-w-full text-xs border rounded-lg overflow-hidden" role="table">
              <thead>
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="border px-2 py-1 bg-gray-100 text-gray-700 font-semibold">{h}</th>
                  ))}
                  <th className="border px-2 py-1 bg-gray-100 text-gray-700 font-semibold">Type</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.slice(1).map((row, i) => {
                  const type = getRowType(row)
                  let badgeClass = ''
                  let rowBg = ''
                  if (type === 'new') {
                    badgeClass = 'bg-green-100 text-green-800 border-green-300'
                    rowBg = 'bg-green-50'
                  } else if (type === 'changed') {
                    badgeClass = 'bg-yellow-100 text-yellow-800 border-yellow-300'
                    rowBg = 'bg-yellow-50'
                  } else if (type === 'unchanged') {
                    badgeClass = 'bg-gray-100 text-gray-700 border-gray-300'
                    rowBg = 'bg-gray-50'
                  }
                  return (
                    <tr key={i} className={i % 2 === 0 ? rowBg : ''}>
                      {row.map((cell, j) => (
                        <td key={j} className="border px-2 py-1">{cell}</td>
                      ))}
                      <td className={`border px-2 py-1 text-center`}>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs border ${badgeClass}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {previewRows.length === 11 && (
              <div className="text-xs text-gray-500 mt-2">... (showing first 10 rows)</div>
            )}
          </>
        ) : (
          <div className="text-gray-500 italic">No preview data available. Please upload files and select export options.</div>
        )}
      </div>
    </section>
  )
}

ExportPreview.propTypes = {
  previewRows: PropTypes.array.isRequired,
  getRowType: PropTypes.func.isRequired,
  headers: PropTypes.array.isRequired,
}

export default ExportPreview 