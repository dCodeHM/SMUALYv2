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
        <span className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center"><span className="text-primary-600 font-bold">&#9881;</span></span>
        <h2 id="export-options-title" className="text-xl font-bold text-primary-700">Export Options</h2>
      </div>
      <div className="p-4 bg-blue-50 rounded-lg shadow flex flex-col md:flex-row gap-4 items-center" role="group" aria-label="Export options">
        <div className="flex items-center gap-2">
          <label htmlFor="export-format" className="font-medium mr-2">Export Format</label>
          <select
            id="export-format"
            value={format}
            onChange={e => onFormatChange(e.target.value)}
            className="border rounded px-2 py-1 focus:ring focus:ring-blue-200"
            aria-label="Export format"
          >
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="csv">CSV (.csv)</option>
          </select>
          <span className="text-gray-400" title="Choose the file format for export."><Info className="w-4 h-4 inline ml-1" aria-hidden /></span>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="export-filter" className="font-medium mr-2">Filter</label>
          <select
            id="export-filter"
            value={filter}
            onChange={e => onFilterChange(e.target.value)}
            className="border rounded px-2 py-1 focus:ring focus:ring-blue-200"
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
          <label htmlFor="export-filename" className="font-medium mr-2">File Name</label>
          <input
            id="export-filename"
            type="text"
            value={fileName}
            onChange={e => onFileNameChange(e.target.value)}
            className="border rounded px-2 py-1 w-56 focus:ring focus:ring-blue-200"
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