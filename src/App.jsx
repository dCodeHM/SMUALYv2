<<<<<<< HEAD
import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'
import { Upload, FileText, BarChart3, Download, AlertCircle, CheckCircle } from 'lucide-react'
=======
import React, { useState } from 'react'
import FileUpload from './components/FileUpload'
import ComparisonResults from './components/ComparisonResults'
import Header from './components/Header'
import ExportOptions from './components/ExportOptions'
import ExportPreview from './components/ExportPreview'
import { FileSpreadsheet, BarChart3, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import * as XLSX from 'xlsx'
>>>>>>> main

function App() {
  const [oldData, setOldData] = useState(null)
  const [newData, setNewData] = useState(null)
  const [comparisonResults, setComparisonResults] = useState(null)
<<<<<<< HEAD
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
=======
  const [isLoading, setIsLoading] = useState(false)
  const [exportFormat, setExportFormat] = useState('xlsx')
  const [exportFilter, setExportFilter] = useState('all')
  const [exportFileName, setExportFileName] = useState(() => {
    const now = new Date()
    return `compared_export_${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}_${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}`
  })
  const [exportPreview, setExportPreview] = useState([])

  const handleFileUpload = (file, type) => {
    if (type === 'old') {
      setOldData(file)
    } else {
      setNewData(file)
    }
    setComparisonResults(null) // Reset results when new files are uploaded
  }

  const compareData = () => {
    if (!oldData || !newData) {
      alert('Please upload both old and new Excel files first.')
      return
    }

    setIsLoading(true)
    
    // Simulate processing time
    setTimeout(() => {
      const results = performComparison(oldData, newData)
      setComparisonResults(results)
      setIsLoading(false)
    }, 1000)
  }

  const performComparison = (oldFile, newFile) => {
    const oldRecords = oldFile.data
    const newRecords = newFile.data
    
    // Detect duplications within each file
    const oldDuplications = detectDuplications(oldRecords, 'Old File')
    const newDuplications = detectDuplications(newRecords, 'New File')
    
    // Create maps for efficient lookup
    const oldMap = new Map()
    const newMap = new Map()
    
    // Index old records by a combination of asset name and host ID
    oldRecords.forEach(record => {
      const key = `${record.assetName}-${record.hostId}`.toLowerCase()
      oldMap.set(key, record)
    })
    
    // Index new records
    newRecords.forEach(record => {
      const key = `${record.assetName}-${record.hostId}`.toLowerCase()
      newMap.set(key, record)
    })
    
    // Find added, removed, modified, and unchanged records
    const added = []
    const removed = []
    const modified = []
    const unchanged = []
    
    // Check for added and modified records
    newRecords.forEach(newRecord => {
      const key = `${newRecord.assetName}-${newRecord.hostId}`.toLowerCase()
      const oldRecord = oldMap.get(key)
      
      if (!oldRecord) {
        // This is a new record
        added.push({
          ...newRecord,
          type: 'added'
        })
      } else {
        // Check if modified
        if (oldRecord.ipv4Address !== newRecord.ipv4Address) {
          modified.push({
            ...newRecord,
            oldIpv4Address: oldRecord.ipv4Address,
            type: 'modified'
          })
        } else {
          unchanged.push({
            ...newRecord,
            type: 'unchanged'
          })
        }
      }
    })
    
    // Check for removed records
    oldRecords.forEach(oldRecord => {
      const key = `${oldRecord.assetName}-${oldRecord.hostId}`.toLowerCase()
      if (!newMap.has(key)) {
        removed.push({
          ...oldRecord,
          type: 'removed'
        })
      }
    })
    
    return {
      summary: {
        oldRecords: oldRecords.length,
        newRecords: newRecords.length,
        added: added.length,
        removed: removed.length,
        modified: modified.length,
        unchanged: unchanged.length,
        oldDuplications: oldDuplications.totalDuplicates,
        newDuplications: newDuplications.totalDuplicates
      },
      details: {
        added,
        removed,
        modified,
        unchanged
      },
      duplications: {
        old: oldDuplications,
        new: newDuplications
      }
    }
  }

  const detectDuplications = (records, fileType) => {
    const duplications = {
      assetName: [],
      hostId: [],
      ipv4Address: [],
      totalDuplicates: 0
    }
    
    // Group records by Asset Name
    const assetNameGroups = new Map()
    records.forEach((record, index) => {
      const assetName = record.assetName?.toString().trim().toLowerCase()
      if (assetName) {
        if (!assetNameGroups.has(assetName)) {
          assetNameGroups.set(assetName, [])
        }
        assetNameGroups.get(assetName).push({ ...record, originalIndex: index })
      }
    })
    
    // Find Asset Name duplications
    assetNameGroups.forEach((group, assetName) => {
      if (group.length > 1) {
        duplications.assetName.push({
          field: 'Asset Name',
          value: group[0].assetName,
          count: group.length,
          records: group.map(r => ({
            assetName: r.assetName,
            hostId: r.hostId,
            ipv4Address: r.ipv4Address,
            rowNumber: r.originalIndex + 2 // +2 because Excel is 1-indexed and we skip header
          }))
        })
      }
    })
    
    // Group records by Host ID
    const hostIdGroups = new Map()
    records.forEach((record, index) => {
      const hostId = record.hostId?.toString().trim().toLowerCase()
      if (hostId) {
        if (!hostIdGroups.has(hostId)) {
          hostIdGroups.set(hostId, [])
        }
        hostIdGroups.get(hostId).push({ ...record, originalIndex: index })
      }
    })
    
    // Find Host ID duplications
    hostIdGroups.forEach((group, hostId) => {
      if (group.length > 1) {
        duplications.hostId.push({
          field: 'Host ID',
          value: group[0].hostId,
          count: group.length,
          records: group.map(r => ({
            assetName: r.assetName,
            hostId: r.hostId,
            ipv4Address: r.ipv4Address,
            rowNumber: r.originalIndex + 2
          }))
        })
      }
    })
    
    // Group records by IPv4 Address
    const ipv4Groups = new Map()
    records.forEach((record, index) => {
      const ipv4Address = record.ipv4Address?.toString().trim().toLowerCase()
      if (ipv4Address) {
        if (!ipv4Groups.has(ipv4Address)) {
          ipv4Groups.set(ipv4Address, [])
        }
        ipv4Groups.get(ipv4Address).push({ ...record, originalIndex: index })
      }
    })
    
    // Find IPv4 Address duplications
    ipv4Groups.forEach((group, ipv4Address) => {
      if (group.length > 1) {
        duplications.ipv4Address.push({
          field: 'IPv4 Address',
          value: group[0].ipv4Address,
          count: group.length,
          records: group.map(r => ({
            assetName: r.assetName,
            hostId: r.hostId,
            ipv4Address: r.ipv4Address,
            rowNumber: r.originalIndex + 2
          }))
        })
      }
    })
    
    // Calculate total duplicates
    duplications.totalDuplicates = 
      duplications.assetName.length + 
      duplications.hostId.length + 
      duplications.ipv4Address.length
    
    return duplications
  }

  // Export headers as specified
  const exportHeaders = [
    'Asset Name',
    'Host Id',
    'IPV4 Addresses',
    'PoC',
    'Server Type',
    'RootCause (Select)',
    'Resolution',
    'Remarks',
    'Root Cause',
    'Remarks 2 - Qualys Console Status'
  ]

  // Helper to map row to export format
  const mapRowForExport = (row, oldRow) => ([
    row.assetName || '',
    row.hostId || '',
    row.ipv4Address || '',
    oldRow?.PoC || '',
    oldRow?.serverType || '',
    oldRow?.rootCauseSelect || '',
    oldRow?.resolution || '',
    oldRow?.remarks || '',
    oldRow?.rootCause || '',
    oldRow?.remarks2QualysConsoleStatus || ''
  ])

  // Helper to normalize keys for old data
  const normalizeOldRow = (row, headers) => {
    // Map headers to lower-case keys for easier access
    const headerMap = headers.reduce((acc, h, i) => {
      if (!h) return acc;
      const key = h.toString().toLowerCase().replace(/\s+/g, '')
      acc[key] = i
      return acc
    }, {})
    return {
      assetName: row[headerMap['assetname']] || '',
      hostId: row[headerMap['hostid']] || '',
      ipv4Address: row[headerMap['ipv4addresses']] || '',
      PoC: row[headerMap['poc']] || '',
      serverType: row[headerMap['servertype']] || '',
      rootCauseSelect: row[headerMap['rootcause(select)']] || '',
      resolution: row[headerMap['resolution']] || '',
      remarks: row[headerMap['remarks']] || '',
      rootCause: row[headerMap['rootcause']] || '',
      remarks2QualysConsoleStatus: row[headerMap['remarks2-qualysconsolestatus']] || ''
    }
  }

  // Helper to filter export rows
  const getFilteredRows = () => {
    if (!oldData || !newData) return []
    // Build a map of old data for quick lookup
    const oldRowsRaw = oldData.rawRows || []
    const oldHeaders = oldData.headers || []
    const oldMap = new Map()
    oldRowsRaw.forEach(row => {
      const norm = normalizeOldRow(row, oldHeaders)
      const key = `${norm.assetName}|||${norm.hostId}|||${norm.ipv4Address}`.toLowerCase()
      oldMap.set(key, norm)
    })
    // For each new row, build export row
    let filteredRows = []
    newData.data.forEach(row => {
      const key = `${row.assetName}|||${row.hostId}|||${row.ipv4Address}`.toLowerCase()
      const oldRow = oldMap.get(key)
      let include = true
      if (exportFilter === 'new') {
        include = !oldRow
      } else if (exportFilter === 'changed') {
        include = oldRow && (
          row.assetName !== oldRow.assetName ||
          row.hostId !== oldRow.hostId ||
          row.ipv4Address !== oldRow.ipv4Address
        )
      } else if (exportFilter === 'unchanged') {
        include = oldRow && (
          row.assetName === oldRow.assetName &&
          row.hostId === oldRow.hostId &&
          row.ipv4Address === oldRow.ipv4Address
        )
      }
      if (include) {
        filteredRows.push(mapRowForExport(row, oldRow))
      }
    })
    return filteredRows
  }

  // Update preview when options or data change
  React.useEffect(() => {
    if (!oldData || !newData) {
      setExportPreview([])
      return
    }
    const rows = getFilteredRows()
    setExportPreview([exportHeaders, ...rows].slice(0, 11)) // show up to 10 rows + header
  }, [oldData, newData, exportFilter])

  // Export function
  const handleExport = () => {
    if (!oldData || !newData) {
      alert('Please upload both old and new files first.')
      return
    }
    const rows = getFilteredRows()
    if (rows.length === 0) {
      alert('No data to export with current filter.')
      return
    }
    const fileName = exportFileName ? exportFileName : 'compared_export'
    if (exportFormat === 'csv') {
      // Export as CSV
      const csvContent = [exportHeaders, ...rows].map(r => r.map(v => `"${(v||'').toString().replace(/"/g,'""')}"`).join(',')).join('\r\n')
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName + '.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      // Export as Excel with summary sheet
      const ws = XLSX.utils.aoa_to_sheet([exportHeaders, ...rows])
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Export')
      // Add summary sheet
      if (comparisonResults) {
        const s = comparisonResults.summary
        const summarySheet = XLSX.utils.aoa_to_sheet([
          ['Summary'],
          ['Old Records', s.oldRecords],
          ['New Records', s.newRecords],
          ['Added', s.added],
          ['Removed', s.removed],
          ['Modified', s.modified],
          ['Unchanged', s.unchanged],
          ['Old Duplications', s.oldDuplications],
          ['New Duplications', s.newDuplications]
        ])
        XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary')
      }
      XLSX.writeFile(wb, fileName + '.xlsx')
    }
  }

  // Helper to get row type for preview (for color coding)
  const getRowType = (row) => {
    if (!oldData || !newData) return 'unknown'
    const oldRowsRaw = oldData.rawRows || []
    const oldHeaders = oldData.headers || []
    const oldMap = new Map()
    oldRowsRaw.forEach(r => {
      const norm = normalizeOldRow(r, oldHeaders)
      const key = `${norm.assetName}|||${norm.hostId}|||${norm.ipv4Address}`.toLowerCase()
      oldMap.set(key, norm)
    })
    const key = `${row[0]}|||${row[1]}|||${row[2]}`.toLowerCase()
    const oldRow = oldMap.get(key)
    if (!oldRow) return 'new'
    if (
      row[0] !== oldRow.assetName ||
      row[1] !== oldRow.hostId ||
      row[2] !== oldRow.ipv4Address
    ) return 'changed'
    return 'unchanged'
  }

  const resetData = () => {
    setOldData(null)
    setNewData(null)
    setComparisonResults(null)
  }

  return (
    <div className="min-h-screen">
      <Header />
<<<<<<< HEAD
      <div className="relative container mx-auto py-12">
        {/* Playful accent shape in background */}
        <div className="absolute -z-10 right-0 top-0 w-64 h-64 bg-gradient-to-br from-pink-50 via-accent-50 to-teal-50 rounded-full opacity-20 pointer-events-none"></div>
        <div className="bg-white rounded-3xl shadow-sm border-2 border-accent-100 p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <FileUpload
              title="Old Data File"
              description="Upload the previous (old) Excel or CSV file."
              onFileUpload={file => {
                setOldData(file ? { ...file, rawRows: file.rawRows || file.raw || [] } : null)
                setComparisonResults(null)
              }}
              uploadedFile={oldData}
              icon={<FileSpreadsheet className="w-6 h-6 text-accent-600" />}
            />
            <FileUpload
              title="New Data File"
              description="Upload the latest (new) Excel or CSV file."
              onFileUpload={file => setNewData(file)}
              uploadedFile={newData}
              icon={<FileSpreadsheet className="w-6 h-6 text-accent-600" />}
            />
          </div>
          {/* Export Options Section */}
          <ExportOptions
            format={exportFormat}
            filter={exportFilter}
            fileName={exportFileName}
            onFormatChange={setExportFormat}
            onFilterChange={setExportFilter}
            onFileNameChange={setExportFileName}
          />
          {/* Export Preview Section */}
          <ExportPreview
            previewRows={exportPreview}
            getRowType={getRowType}
            headers={exportHeaders}
          />
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-10 justify-center">
            <button
              className="btn-primary text-lg px-8 py-3 rounded-xl shadow-lg hover:scale-105 hover:bg-accent-600 transition-all duration-200"
              onClick={compareData}
              disabled={!oldData || !newData || isLoading}
              aria-label="Compare old and new data"
            >
              Compare Data
            </button>
            <button
              className="btn-secondary text-lg px-8 py-3 rounded-xl shadow-lg hover:scale-105 hover:bg-teal-600 hover:text-white transition-all duration-200"
              onClick={handleExport}
              disabled={!oldData || !newData}
              aria-label="Export compared data"
            >
              Export Compared Data
            </button>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-accent-600 mb-4">
              <BarChart3 className="w-5 h-5 animate-spin" />
              <span>Comparing data, please wait...</span>
            </div>
          )}
          {comparisonResults && (
            <ComparisonResults results={comparisonResults} />
          )}
        </div>
=======
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <FileUpload
            title="Old Data File"
            description="Upload the previous (old) Excel or CSV file."
            onFileUpload={file => {
              setOldData(file ? { ...file, rawRows: file.rawRows || file.raw || [] } : null)
              setComparisonResults(null)
            }}
            uploadedFile={oldData}
            icon={<FileSpreadsheet className="w-6 h-6 text-primary-600" />}
          />
          <FileUpload
            title="New Data File"
            description="Upload the latest (new) Excel or CSV file."
            onFileUpload={file => setNewData(file)}
            uploadedFile={newData}
            icon={<FileSpreadsheet className="w-6 h-6 text-primary-600" />}
          />
        </div>
        {/* Export Options Section */}
        <ExportOptions
          format={exportFormat}
          filter={exportFilter}
          fileName={exportFileName}
          onFormatChange={setExportFormat}
          onFilterChange={setExportFilter}
          onFileNameChange={setExportFileName}
        />
        {/* Export Preview Section */}
        <ExportPreview
          previewRows={exportPreview}
          getRowType={getRowType}
          headers={exportHeaders}
        />
        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            className="btn btn-primary text-lg px-6 py-2 rounded shadow hover:bg-primary-700 transition-colors"
            onClick={compareData}
            disabled={!oldData || !newData || isLoading}
            aria-label="Compare old and new data"
          >
            Compare Data
          </button>
          <button
            className="btn btn-success text-lg px-6 py-2 rounded shadow hover:bg-success-700 transition-colors"
            onClick={handleExport}
            disabled={!oldData || !newData}
            aria-label="Export compared data"
          >
            Export Compared Data
          </button>
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-primary-600 mb-4">
            <BarChart3 className="w-5 h-5 animate-spin" />
            <span>Comparing data, please wait...</span>
          </div>
        )}
        {comparisonResults && (
          <ComparisonResults results={comparisonResults} />
        )}
>>>>>>> c359019 (feat: improve importation of data using the old data set to the new excel data.)
>>>>>>> main
      </div>
    </div>
  )
}

export default App 