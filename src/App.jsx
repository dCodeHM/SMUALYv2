import React, { useState } from 'react'
import FileUpload from './components/FileUpload'
import ComparisonResults from './components/ComparisonResults'
import Header from './components/Header'
import { FileSpreadsheet, BarChart3, AlertTriangle, CheckCircle } from 'lucide-react'

function App() {
  const [oldData, setOldData] = useState(null)
  const [newData, setNewData] = useState(null)
  const [comparisonResults, setComparisonResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

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

  const resetData = () => {
    setOldData(null)
    setNewData(null)
    setComparisonResults(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* File Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <FileUpload
              title="Old Excel Data"
              description="Upload the previous Excel file with Asset Name, Host ID, and IPv4 Addresses"
              onFileUpload={(file) => handleFileUpload(file, 'old')}
              uploadedFile={oldData}
              icon={<FileSpreadsheet className="w-8 h-8 text-primary-600" />}
            />
            
            <FileUpload
              title="New Excel Data"
              description="Upload the current Excel file with Asset Name, Host ID, and IPv4 Addresses"
              onFileUpload={(file) => handleFileUpload(file, 'new')}
              uploadedFile={newData}
              icon={<FileSpreadsheet className="w-8 h-8 text-success-600" />}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={compareData}
              disabled={!oldData || !newData || isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Comparing...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4" />
                  Compare Data
                </>
              )}
            </button>
            
            <button
              onClick={resetData}
              className="btn-secondary flex items-center gap-2"
            >
              Reset
            </button>
          </div>

          {/* Results Section */}
          {comparisonResults && (
            <ComparisonResults results={comparisonResults} />
          )}

          {/* Instructions */}
          {!comparisonResults && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning-500" />
                How to Use
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>1. Upload your old Excel file containing Asset Name, Host ID, and IPv4 Addresses</p>
                <p>2. Upload your new Excel file with the same column structure</p>
                <p>3. Click "Compare Data" to analyze differences and similarities</p>
                <p>4. Review the detailed comparison results below</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App 