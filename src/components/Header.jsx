import React from 'react'
import { FileSpreadsheet, BarChart3 } from 'lucide-react'

function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-primary-600">
              <FileSpreadsheet className="w-8 h-8" />
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Excel Comparison Tool</h1>
              <p className="text-sm text-gray-600">Compare Asset Management Data</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              Asset Name
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              Host ID
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-warning-500 rounded-full"></div>
              IPv4 Address
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 