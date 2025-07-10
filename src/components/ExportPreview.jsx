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
    { type: 'new', label: 'New', className: 'bg-teal-100 text-teal-800 border-teal-300' },
    { type: 'changed', label: 'Changed', className: 'bg-pink-100 text-pink-800 border-pink-300' },
    { type: 'unchanged', label: 'Unchanged', className: 'bg-gray-100 text-gray-700 border-gray-300' },
  ]
  return (
    <section aria-labelledby="export-preview-title" className="mb-8">
      <div className="mb-2 flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-success-500" />
        <h2 id="export-preview-title" className="text-xl font-extrabold text-teal-700 tracking-tight">Export Preview</h2>
      </div>
      <div className="flex items-center gap-4 mb-2">
        <span className="font-semibold text-gray-700">Legend:</span>
        {legend.map(l => (
          <span key={l.type} className={`inline-block px-3 py-1 rounded-full text-xs border font-semibold shadow-sm ${l.className}`}>{l.label}</span>
        ))}
        <span className="text-gray-400" title="Rows are color-coded by type (new, changed, unchanged)."><Info className="w-4 h-4 inline ml-1" aria-hidden /></span>
      </div>
      <div className="relative bg-white rounded-2xl shadow-sm p-6 overflow-x-auto border-2 border-teal-100 animate-fade-in">
        {/* Subtle accent shape */}
        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-teal-100 via-accent-50 to-pink-50 rounded-full opacity-10 z-0 pointer-events-none"></div>
        {previewRows.length > 1 ? (
          <>
            <div className="font-medium mb-2 text-gray-700">First 10 rows to be exported:</div>
            <table className="min-w-full text-xs border rounded-xl overflow-hidden shadow-md bg-white">
              <thead>
                <tr>
                  {headers.map((h, i) => (
                    <th key={i} className="border px-3 py-2 bg-gray-100 text-gray-700 font-semibold">{h}</th>
                  ))}
                  <th className="border px-3 py-2 bg-gray-100 text-gray-700 font-semibold">Type</th>
                </tr>
              </thead>
              <tbody>
                {previewRows.slice(1).map((row, i) => {
                  const type = getRowType(row)
                  let badgeClass = ''
                  let rowBg = ''
                  if (type === 'new') {
                    badgeClass = 'bg-teal-100 text-teal-800 border-teal-300'
                    rowBg = 'bg-teal-50/60'
                  } else if (type === 'changed') {
                    badgeClass = 'bg-pink-100 text-pink-800 border-pink-300'
                    rowBg = 'bg-pink-50/60'
                  } else if (type === 'unchanged') {
                    badgeClass = 'bg-gray-100 text-gray-700 border-gray-300'
                    rowBg = 'bg-gray-50/60'
                  }
                  return (
                    <tr key={i} className={i % 2 === 0 ? rowBg : ''}>
                      {row.map((cell, j) => (
                        <td key={j} className="border px-3 py-2">{cell}</td>
                      ))}
                      <td className={`border px-3 py-2 text-center`}>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs border font-semibold shadow-sm ${badgeClass}`}>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
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