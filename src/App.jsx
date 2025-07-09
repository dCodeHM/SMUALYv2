import React, { useState } from 'react'
import FileUpload from './components/FileUpload'
import ComparisonResults from './components/ComparisonResults'
import Header from './components/Header'
import ExportOptions from './components/ExportOptions'
import ExportPreview from './components/ExportPreview'
import { FileSpreadsheet, BarChart3, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import * as XLSX from 'xlsx'

function App() {
  const [oldData, setOldData] = useState(null)
  const [newData, setNewData] = useState(null)
  const [comparisonResults, setComparisonResults] = useState(null)
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
    <div className="min-h-screen bg-gray-50">
      <Header />
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
      </div>
    </div>
  )
}

export default App 