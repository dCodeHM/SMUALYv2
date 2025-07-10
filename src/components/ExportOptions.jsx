import React from 'react'
import PropTypes from 'prop-types'
import { Info } from 'lucide-react'

/**
 * ExportOptions - UI for selecting export format, filter, and file name.
 * Accessible, production-ready, and styled with Tailwind.
 */
function ExportOptions({ format, filter, fileName, onFormatChange, onFilterChange, onFileNameChange }) {
  return (
    <section aria-labelledby="export-options-title" className="mb-8">
      <div className="mb-2 flex items-center gap-2">
        <span className="w-5 h-5 bg-accent-100 rounded-full flex items-center justify-center"><span className="text-accent-600 font-bold">&#9881;</span></span>
        <h2 id="export-options-title" className="text-xl font-extrabold text-accent-700 tracking-tight">Export Options</h2>
      </div>
      <div className="relative p-6 bg-white rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center border-2 border-accent-100">
        <div className="flex items-center gap-2">
          <label htmlFor="export-format" className="font-semibold mr-2 text-accent-700">Export Format</label>
          <select
            id="export-format"
            value={format}
            onChange={e => onFormatChange(e.target.value)}
            className="border-2 border-accent-100 rounded-xl px-3 py-2 focus:ring-2 focus:ring-accent-200 bg-white text-accent-700 font-medium shadow-sm"
            aria-label="Export format"
          >
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="csv">CSV (.csv)</option>
          </select>
          <span className="text-gray-400" title="Choose the file format for export."><Info className="w-4 h-4 inline ml-1" aria-hidden /></span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="export-filter" className="font-semibold mr-2 text-accent-700">Filter</label>
          <select
            id="export-filter"
            value={filter}
            onChange={e => onFilterChange(e.target.value)}
            className="border-2 border-accent-100 rounded-xl px-3 py-2 focus:ring-2 focus:ring-accent-200 bg-white text-accent-700 font-medium shadow-sm"
            aria-label="Export filter"
          >
            <option value="all">All Rows</option>
            <option value="new">Only New Assets</option>
            <option value="changed">Only Changed Assets</option>
            <option value="unchanged">Only Unchanged Assets</option>
          </select>
          <span className="text-gray-400" title="Filter which rows to include in the export."><Info className="w-4 h-4 inline ml-1" aria-hidden /></span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="export-filename" className="font-semibold mr-2 text-accent-700">File Name</label>
          <input
            id="export-filename"
            type="text"
            value={fileName}
            onChange={e => onFileNameChange(e.target.value)}
            className="border-2 border-accent-100 rounded-xl px-3 py-2 w-56 focus:ring-2 focus:ring-accent-200 bg-white text-accent-700 font-medium shadow-sm"
            aria-label="Export file name"
          />
          <span className="text-gray-400" title="Set the export file name. Timestamp is included by default."><Info className="w-4 h-4 inline ml-1" aria-hidden /></span>
        </div>
      </div>
    </section>
  )
}

ExportOptions.propTypes = {
  format: PropTypes.string.isRequired,
  filter: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  onFormatChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onFileNameChange: PropTypes.func.isRequired,
}

export default ExportOptions 