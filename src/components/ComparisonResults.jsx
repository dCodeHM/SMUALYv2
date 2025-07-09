import React, { useState } from 'react'
import { 
  BarChart3, 
  Plus, 
  Minus, 
  Edit, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Download,
  Filter,
  AlertTriangle,
  Copy
} from 'lucide-react'

function ComparisonResults({ results }) {
  const [activeTab, setActiveTab] = useState('summary')
  const [filterType, setFilterType] = useState('all')

  const { summary, details, duplications } = results

  const tabs = [
    { id: 'summary', label: 'Summary', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'added', label: `Added (${summary.added})`, icon: <Plus className="w-4 h-4" /> },
    { id: 'removed', label: `Removed (${summary.removed})`, icon: <Minus className="w-4 h-4" /> },
    { id: 'modified', label: `Modified (${summary.modified})`, icon: <Edit className="w-4 h-4" /> },
    { id: 'unchanged', label: `Unchanged (${summary.unchanged})`, icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'duplications', label: `Duplications (${summary.oldDuplications + summary.newDuplications})`, icon: <Copy className="w-4 h-4" /> }
  ]

  const getStatusColor = (type) => {
    switch (type) {
      case 'added': return 'text-success-600 bg-success-50 border-success-200'
      case 'removed': return 'text-danger-600 bg-danger-50 border-danger-200'
      case 'modified': return 'text-warning-600 bg-warning-50 border-warning-200'
      case 'unchanged': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (type) => {
    switch (type) {
      case 'added': return <Plus className="w-4 h-4" />
      case 'removed': return <Minus className="w-4 h-4" />
      case 'modified': return <Edit className="w-4 h-4" />
      case 'unchanged': return <CheckCircle className="w-4 h-4" />
      default: return <CheckCircle className="w-4 h-4" />
    }
  }

  const exportResults = () => {
    const csvContent = generateCSV()
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', 'excel_comparison_results.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generateCSV = () => {
    const headers = ['Asset Name', 'Host ID', 'IPv4 Address', 'Status', 'Change Type', 'Row Number']
    const rows = []
    
    // Add comparison results
    Object.entries(details).forEach(([type, items]) => {
      items.forEach(item => {
        rows.push([
          item.assetName,
          item.hostId,
          item.ipv4Address,
          type.charAt(0).toUpperCase() + type.slice(1),
          type,
          ''
        ])
      })
    })
    
    // Add duplication results
    if (duplications) {
      // Old file duplications
      Object.entries(duplications.old).forEach(([fieldType, dups]) => {
        if (Array.isArray(dups)) {
          dups.forEach(dup => {
            dup.records.forEach(record => {
              rows.push([
                record.assetName,
                record.hostId,
                record.ipv4Address,
                `Duplicate ${dup.field}`,
                `Old File - ${dup.field} Duplication`,
                record.rowNumber
              ])
            })
          })
        }
      })
      
      // New file duplications
      Object.entries(duplications.new).forEach(([fieldType, dups]) => {
        if (Array.isArray(dups)) {
          dups.forEach(dup => {
            dup.records.forEach(record => {
              rows.push([
                record.assetName,
                record.hostId,
                record.ipv4Address,
                `Duplicate ${dup.field}`,
                `New File - ${dup.field} Duplication`,
                record.rowNumber
              ])
            })
          })
        }
      })
    }
    
    return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Old Records</p>
              <p className="text-2xl font-bold text-gray-900">{summary.oldRecords}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <TrendingDown className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total New Records</p>
              <p className="text-2xl font-bold text-gray-900">{summary.newRecords}</p>
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Added</p>
              <p className="text-2xl font-bold text-success-600">{summary.added}</p>
            </div>
            <div className="p-2 bg-success-100 rounded-lg">
              <Plus className="w-6 h-6 text-success-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Removed</p>
              <p className="text-2xl font-bold text-danger-600">{summary.removed}</p>
            </div>
            <div className="p-2 bg-danger-100 rounded-lg">
              <Minus className="w-6 h-6 text-danger-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Old File Duplications</p>
              <p className="text-2xl font-bold text-warning-600">{summary.oldDuplications}</p>
            </div>
            <div className="p-2 bg-warning-100 rounded-lg">
              <Copy className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">New File Duplications</p>
              <p className="text-2xl font-bold text-warning-600">{summary.newDuplications}</p>
            </div>
            <div className="p-2 bg-warning-100 rounded-lg">
              <Copy className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Analysis</h3>
          <button
            onClick={exportResults}
            className="btn-secondary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Results
          </button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Change Summary</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
                      <span className="text-success-700">Added Records</span>
                      <span className="font-semibold text-success-900">{summary.added}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-danger-50 rounded-lg">
                      <span className="text-danger-700">Removed Records</span>
                      <span className="font-semibold text-danger-900">{summary.removed}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                      <span className="text-warning-700">Modified Records</span>
                      <span className="font-semibold text-warning-900">{summary.modified}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Unchanged Records</span>
                      <span className="font-semibold text-gray-900">{summary.unchanged}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                      <span className="text-warning-700">Old File Duplications</span>
                      <span className="font-semibold text-warning-900">{summary.oldDuplications}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                      <span className="text-warning-700">New File Duplications</span>
                      <span className="font-semibold text-warning-900">{summary.newDuplications}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Statistics</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Change Rate</span>
                      <span className="font-semibold">
                        {((summary.added + summary.removed + summary.modified) / summary.oldRecords * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Growth Rate</span>
                      <span className="font-semibold">
                        {((summary.newRecords - summary.oldRecords) / summary.oldRecords * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Stability Rate</span>
                      <span className="font-semibold">
                        {(summary.unchanged / summary.oldRecords * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Old File Duplication Rate</span>
                      <span className="font-semibold">
                        {summary.oldDuplications > 0 ? (summary.oldDuplications / summary.oldRecords * 100).toFixed(1) : '0.0'}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">New File Duplication Rate</span>
                      <span className="font-semibold">
                        {summary.newDuplications > 0 ? (summary.newDuplications / summary.newRecords * 100).toFixed(1) : '0.0'}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'duplications' && (
            <div className="space-y-6">
              {/* Old File Duplications */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning-500" />
                  Old File Duplications ({duplications.old.totalDuplicates})
                </h4>
                
                {duplications.old.totalDuplicates === 0 ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700">No duplications found in the old file.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {duplications.old.assetName.length > 0 && (
                      <div className="border border-warning-200 rounded-lg overflow-hidden">
                        <div className="bg-warning-50 px-4 py-2 border-b border-warning-200">
                          <h5 className="font-medium text-warning-800">Asset Name Duplications ({duplications.old.assetName.length})</h5>
                        </div>
                        <div className="divide-y divide-warning-100">
                          {duplications.old.assetName.map((dup, index) => (
                            <div key={index} className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-warning-700">{dup.value}</span>
                                <span className="text-sm text-warning-600 bg-warning-100 px-2 py-1 rounded">
                                  {dup.count} duplicates
                                </span>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                  <thead className="bg-warning-50">
                                    <tr>
                                      <th className="px-3 py-2 text-left text-warning-700">Row</th>
                                      <th className="px-3 py-2 text-left text-warning-700">Asset Name</th>
                                      <th className="px-3 py-2 text-left text-warning-700">Host ID</th>
                                      <th className="px-3 py-2 text-left text-warning-700">IPv4 Address</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {dup.records.map((record, idx) => (
                                      <tr key={idx} className="border-b border-warning-100">
                                        <td className="px-3 py-2 text-warning-600">{record.rowNumber}</td>
                                        <td className="px-3 py-2 font-medium">{record.assetName}</td>
                                        <td className="px-3 py-2">{record.hostId}</td>
                                        <td className="px-3 py-2">{record.ipv4Address}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {duplications.old.hostId.length > 0 && (
                      <div className="border border-warning-200 rounded-lg overflow-hidden">
                        <div className="bg-warning-50 px-4 py-2 border-b border-warning-200">
                          <h5 className="font-medium text-warning-800">Host ID Duplications ({duplications.old.hostId.length})</h5>
                        </div>
                        <div className="divide-y divide-warning-100">
                          {duplications.old.hostId.map((dup, index) => (
                            <div key={index} className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-warning-700">{dup.value}</span>
                                <span className="text-sm text-warning-600 bg-warning-100 px-2 py-1 rounded">
                                  {dup.count} duplicates
                                </span>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                  <thead className="bg-warning-50">
                                    <tr>
                                      <th className="px-3 py-2 text-left text-warning-700">Row</th>
                                      <th className="px-3 py-2 text-left text-warning-700">Asset Name</th>
                                      <th className="px-3 py-2 text-left text-warning-700">Host ID</th>
                                      <th className="px-3 py-2 text-left text-warning-700">IPv4 Address</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {dup.records.map((record, idx) => (
                                      <tr key={idx} className="border-b border-warning-100">
                                        <td className="px-3 py-2 text-warning-600">{record.rowNumber}</td>
                                        <td className="px-3 py-2">{record.assetName}</td>
                                        <td className="px-3 py-2 font-medium">{record.hostId}</td>
                                        <td className="px-3 py-2">{record.ipv4Address}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {duplications.old.ipv4Address.length > 0 && (
                      <div className="border border-warning-200 rounded-lg overflow-hidden">
                        <div className="bg-warning-50 px-4 py-2 border-b border-warning-200">
                          <h5 className="font-medium text-warning-800">IPv4 Address Duplications ({duplications.old.ipv4Address.length})</h5>
                        </div>
                        <div className="divide-y divide-warning-100">
                          {duplications.old.ipv4Address.map((dup, index) => (
                            <div key={index} className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-warning-700">{dup.value}</span>
                                <span className="text-sm text-warning-600 bg-warning-100 px-2 py-1 rounded">
                                  {dup.count} duplicates
                                </span>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                  <thead className="bg-warning-50">
                                    <tr>
                                      <th className="px-3 py-2 text-left text-warning-700">Row</th>
                                      <th className="px-3 py-2 text-left text-warning-700">Asset Name</th>
                                      <th className="px-3 py-2 text-left text-warning-700">Host ID</th>
                                      <th className="px-3 py-2 text-left text-warning-700">IPv4 Address</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {dup.records.map((record, idx) => (
                                      <tr key={idx} className="border-b border-warning-100">
                                        <td className="px-3 py-2 text-warning-600">{record.rowNumber}</td>
                                        <td className="px-3 py-2">{record.assetName}</td>
                                        <td className="px-3 py-2">{record.hostId}</td>
                                        <td className="px-3 py-2 font-medium">{record.ipv4Address}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* New File Duplications */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning-500" />
                  New File Duplications ({duplications.new.totalDuplicates})
                </h4>
                
                {duplications.new.totalDuplicates === 0 ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700">No duplications found in the new file.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {duplications.new.assetName.length > 0 && (
                      <div className="border border-warning-200 rounded-lg overflow-hidden">
                        <div className="bg-warning-50 px-4 py-2 border-b border-warning-200">
                          <h5 className="font-medium text-warning-800">Asset Name Duplications ({duplications.new.assetName.length})</h5>
                        </div>
                        <div className="divide-y divide-warning-100">
                          {duplications.new.assetName.map((dup, index) => (
                            <div key={index} className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-warning-700">{dup.value}</span>
                                <span className="text-sm text-warning-600 bg-warning-100 px-2 py-1 rounded">
                                  {dup.count} duplicates
                                </span>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                  <thead className="bg-warning-50">
                                    <tr>
                                      <th className="px-3 py-2 text-left text-warning-700">Row</th>
                                      <th className="px-3 py-2 text-left text-warning-700">Asset Name</th>
                                      <th className="px-3 py-2 text-left text-warning-700">Host ID</th>
                                      <th className="px-3 py-2 text-left text-warning-700">IPv4 Address</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {dup.records.map((record, idx) => (
                                      <tr key={idx} className="border-b border-warning-100">
                                        <td className="px-3 py-2 text-warning-600">{record.rowNumber}</td>
                                        <td className="px-3 py-2 font-medium">{record.assetName}</td>
                                        <td className="px-3 py-2">{record.hostId}</td>
                                        <td className="px-3 py-2">{record.ipv4Address}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {duplications.new.hostId.length > 0 && (
                      <div className="border border-warning-200 rounded-lg overflow-hidden">
                        <div className="bg-warning-50 px-4 py-2 border-b border-warning-200">
                          <h5 className="font-medium text-warning-800">Host ID Duplications ({duplications.new.hostId.length})</h5>
                        </div>
                        <div className="divide-y divide-warning-100">
                          {duplications.new.hostId.map((dup, index) => (
                            <div key={index} className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-warning-700">{dup.value}</span>
                                <span className="text-sm text-warning-600 bg-warning-100 px-2 py-1 rounded">
                                  {dup.count} duplicates
                                </span>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                  <thead className="bg-warning-50">
                                    <tr>
                                      <th className="px-3 py-2 text-left text-warning-700">Row</th>
                                      <th className="px-3 py-2 text-left text-warning-700">Asset Name</th>
                                      <th className="px-3 py-2 text-left text-warning-700">Host ID</th>
                                      <th className="px-3 py-2 text-left text-warning-700">IPv4 Address</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {dup.records.map((record, idx) => (
                                      <tr key={idx} className="border-b border-warning-100">
                                        <td className="px-3 py-2 text-warning-600">{record.rowNumber}</td>
                                        <td className="px-3 py-2">{record.assetName}</td>
                                        <td className="px-3 py-2 font-medium">{record.hostId}</td>
                                        <td className="px-3 py-2">{record.ipv4Address}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {duplications.new.ipv4Address.length > 0 && (
                      <div className="border border-warning-200 rounded-lg overflow-hidden">
                        <div className="bg-warning-50 px-4 py-2 border-b border-warning-200">
                          <h5 className="font-medium text-warning-800">IPv4 Address Duplications ({duplications.new.ipv4Address.length})</h5>
                        </div>
                        <div className="divide-y divide-warning-100">
                          {duplications.new.ipv4Address.map((dup, index) => (
                            <div key={index} className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-warning-700">{dup.value}</span>
                                <span className="text-sm text-warning-600 bg-warning-100 px-2 py-1 rounded">
                                  {dup.count} duplicates
                                </span>
                              </div>
                              <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                  <thead className="bg-warning-50">
                                    <tr>
                                      <th className="px-3 py-2 text-left text-warning-700">Row</th>
                                      <th className="px-3 py-2 text-left text-warning-700">Asset Name</th>
                                      <th className="px-3 py-2 text-left text-warning-700">Host ID</th>
                                      <th className="px-3 py-2 text-left text-warning-700">IPv4 Address</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {dup.records.map((record, idx) => (
                                      <tr key={idx} className="border-b border-warning-100">
                                        <td className="px-3 py-2 text-warning-600">{record.rowNumber}</td>
                                        <td className="px-3 py-2">{record.assetName}</td>
                                        <td className="px-3 py-2">{record.hostId}</td>
                                        <td className="px-3 py-2 font-medium">{record.ipv4Address}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab !== 'summary' && activeTab !== 'duplications' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Records
                </h4>
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="text-sm border border-gray-300 rounded-md px-2 py-1"
                  >
                    <option value="all">All Records</option>
                    <option value="assetName">Asset Name</option>
                    <option value="hostId">Host ID</option>
                    <option value="ipv4Address">IPv4 Address</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asset Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Host ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IPv4 Address
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {details[activeTab].map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.assetName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.hostId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.ipv4Address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(activeTab)}`}>
                            {getStatusIcon(activeTab)}
                            <span className="ml-1">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {details[activeTab].length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No {activeTab} records found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ComparisonResults 