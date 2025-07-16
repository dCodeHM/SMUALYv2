import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'
import { Upload, FileText, BarChart3, Download, AlertCircle, CheckCircle } from 'lucide-react'

function App() {
  const [oldData, setOldData] = useState(null)
  const [newData, setNewData] = useState(null)
  const [comparisonResults, setComparisonResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const onDropOld = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        setOldData({ file, data: jsonData })
      }
      reader.readAsArrayBuffer(file)
    }
  }, [])

  const onDropNew = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet)
        setNewData({ file, data: jsonData })
      }
      reader.readAsArrayBuffer(file)
    }
  }, [])

  const { getRootProps: getOldRootProps, getInputProps: getOldInputProps, isDragActive: isOldDragActive } = useDropzone({
    onDrop: onDropOld,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  })

  const { getRootProps: getNewRootProps, getInputProps: getNewInputProps, isDragActive: isNewDragActive } = useDropzone({
    onDrop: onDropNew,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false
  })

  const compareData = () => {
    if (!oldData || !newData) return

    setLoading(true)
    
    // Simulate processing time
    setTimeout(() => {
      const oldKeys = Object.keys(oldData.data[0] || {})
      const newKeys = Object.keys(newData.data[0] || {})
      
      const addedColumns = newKeys.filter(key => !oldKeys.includes(key))
      const removedColumns = oldKeys.filter(key => !newKeys.includes(key))
      
      const addedRows = newData.data.length - oldData.data.length
      const removedRows = oldData.data.length - newData.data.length
      
      const results = {
        addedColumns,
        removedColumns,
        addedRows: Math.max(0, addedRows),
        removedRows: Math.max(0, removedRows),
        totalOldRows: oldData.data.length,
        totalNewRows: newData.data.length,
        oldFile: oldData.file.name,
        newFile: newData.file.name
      }
      
      setComparisonResults(results)
      setLoading(false)
    }, 1000)
  }

  const exportResults = () => {
    if (!comparisonResults) return
    
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet([comparisonResults])
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Comparison Results')
    XLSX.writeFile(workbook, 'excel-comparison-results.xlsx')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Excel Comparison Tool
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Compare Excel data between old and new datasets to identify changes, additions, and removals in your asset management data.
          </p>
        </div>

        {/* File Upload Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Old Data Upload */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Old Dataset</h2>
            </div>
            <div
              {...getOldRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isOldDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : oldData
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
            >
              <input {...getOldInputProps()} />
              {oldData ? (
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mr-2" />
                  <div>
                    <p className="font-medium text-green-800">{oldData.file.name}</p>
                    <p className="text-sm text-green-600">{oldData.data.length} rows</p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {isOldDragActive ? 'Drop the file here' : 'Drag & drop old Excel file here, or click to select'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Supports .xlsx and .xls files</p>
                </div>
              )}
            </div>
          </div>

          {/* New Data Upload */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">New Dataset</h2>
            </div>
            <div
              {...getNewRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isNewDragActive
                  ? 'border-green-400 bg-green-50'
                  : newData
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-300 hover:border-green-400 hover:bg-gray-50'
              }`}
            >
              <input {...getNewInputProps()} />
              {newData ? (
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mr-2" />
                  <div>
                    <p className="font-medium text-green-800">{newData.file.name}</p>
                    <p className="text-sm text-green-600">{newData.data.length} rows</p>
                  </div>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {isNewDragActive ? 'Drop the file here' : 'Drag & drop new Excel file here, or click to select'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Supports .xlsx and .xls files</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compare Button */}
        <div className="text-center mb-8">
          <button
            onClick={compareData}
            disabled={!oldData || !newData || loading}
            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
              !oldData || !newData || loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Comparing...
              </div>
            ) : (
              <div className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Compare Datasets
              </div>
            )}
          </button>
        </div>

        {/* Results Section */}
        {comparisonResults && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Comparison Results</h2>
              <button
                onClick={exportResults}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Total Rows</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-600">Old: {comparisonResults.totalOldRows}</span>
                  <span className="text-sm text-blue-600">New: {comparisonResults.totalNewRows}</span>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">Added Rows</h3>
                <p className="text-2xl font-bold text-green-600">{comparisonResults.addedRows}</p>
              </div>

              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">Removed Rows</h3>
                <p className="text-2xl font-bold text-red-600">{comparisonResults.removedRows}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-2">Column Changes</h3>
                <div className="text-sm">
                  <p className="text-green-600">+{comparisonResults.addedColumns.length} added</p>
                  <p className="text-red-600">-{comparisonResults.removedColumns.length} removed</p>
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            {(comparisonResults.addedColumns.length > 0 || comparisonResults.removedColumns.length > 0) && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Column Changes Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {comparisonResults.addedColumns.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-800 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Added Columns
                      </h4>
                      <ul className="text-sm text-green-700">
                        {comparisonResults.addedColumns.map((column, index) => (
                          <li key={index} className="mb-1">• {column}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {comparisonResults.removedColumns.length > 0 && (
                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Removed Columns
                      </h4>
                      <ul className="text-sm text-red-700">
                        {comparisonResults.removedColumns.map((column, index) => (
                          <li key={index} className="mb-1">• {column}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App 