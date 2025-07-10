import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import * as XLSX from 'xlsx'
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle } from 'lucide-react'

function FileUpload({ title, description, onFileUpload, uploadedFile, icon }) {
  const [error, setError] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    setError(null)
    
    if (acceptedFiles.length === 0) {
      setError('Please select a valid Excel file (.xlsx, .xls)')
      return
    }

    const file = acceptedFiles[0]
    
    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv'
    ]
    
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
      setError('Please upload a valid Excel file (.xlsx, .xls) or CSV file')
      return
    }

    // Read and parse the Excel file
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        // Validate required columns
        const headers = jsonData[0] || []
        const requiredColumns = ['Asset Name', 'Host ID', 'IPv4 Addresses']
        const missingColumns = requiredColumns.filter(col => 
          !headers.some(header => 
            header && header.toString().toLowerCase().includes(col.toLowerCase())
          )
        )
        
        if (missingColumns.length > 0) {
          setError(`Missing required columns: ${missingColumns.join(', ')}`)
          return
        }
        
        // Find column indices
        const assetNameIndex = headers.findIndex(header => 
          header && header.toString().toLowerCase().includes('asset name')
        )
        const hostIdIndex = headers.findIndex(header => 
          header && header.toString().toLowerCase().includes('host id')
        )
        const ipv4Index = headers.findIndex(header => 
          header && header.toString().toLowerCase().includes('ipv4')
        )
        
        // Only extract the three columns for new data
        // Use a prop or file name to determine if this is the new file
        // We'll use a convention: if the file name includes 'new', treat as new data
        const isNewFile = file.name.toLowerCase().includes('new')

        let processedData
        if (isNewFile) {
          processedData = jsonData.slice(1).map(row => ({
            assetName: row[assetNameIndex] || '',
            hostId: row[hostIdIndex] || '',
            ipv4Address: row[ipv4Index] || ''
          })).filter(row => row.assetName || row.hostId || row.ipv4Address)
        } else {
          // For old file, keep all columns for mapping
          processedData = jsonData.slice(1).map(row => ({
            assetName: row[assetNameIndex] || '',
            hostId: row[hostIdIndex] || '',
            ipv4Address: row[ipv4Index] || '',
            fullRow: row
          })).filter(row => row.assetName || row.hostId || row.ipv4Address)
        }
        
        onFileUpload({
          file,
          data: processedData,
          headers,
          rowCount: processedData.length,
          rawRows: jsonData.slice(1)
        })
        
      } catch (err) {
        setError('Error reading Excel file. Please ensure it\'s a valid Excel file.')
        console.error('Excel parsing error:', err)
      }
    }
    
    reader.onerror = () => {
      setError('Error reading file. Please try again.')
    }
    
    reader.readAsArrayBuffer(file)
  }, [onFileUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv']
    },
    multiple: false
  })

  const removeFile = () => {
    onFileUpload(null)
    setError(null)
  }

  return (
    <div className="card bg-white border-2 border-accent-100 shadow-sm relative">
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <div>
          <h3 className="text-lg font-semibold text-accent-700">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>

      {!uploadedFile ? (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'dropzone-active ring-2 ring-accent-500' : ''}`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-accent-400" />
          {isDragActive ? (
            <p className="text-accent-600 font-semibold">Drop the Excel file here...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-2">
                Drag & drop an Excel file here, or <span className="text-accent-600 font-semibold">click to browse</span>
              </p>
              <p className="text-xs text-gray-500">
                Supports .xlsx, .xls, and .csv files
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-success-200 bg-success-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-success-600" />
              <div>
                <p className="font-medium text-success-900">{uploadedFile.file.name}</p>
                <p className="text-sm text-success-700">
                  {uploadedFile.rowCount} records loaded successfully
                </p>
              </div>
            </div>
            <button
              onClick={removeFile}
              className="text-gray-400 hover:text-accent-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-danger-600" />
            <p className="text-sm text-danger-700">{error}</p>
          </div>
        </div>
      )}

      {uploadedFile && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">File Preview:</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Columns: {uploadedFile.headers.join(', ')}</p>
            <p>Records: {uploadedFile.rowCount}</p>
            <p>Size: {(uploadedFile.file.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUpload 