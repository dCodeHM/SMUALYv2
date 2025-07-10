import React from 'react'
import { FileSpreadsheet, BarChart3 } from 'lucide-react'

function Header() {
  return (
    <header className="bg-white/90 shadow-sm border-b border-gray-200">
      <div className="relative container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 z-10">
          <div className="flex items-center gap-2 text-accent-600">
            <FileSpreadsheet className="w-10 h-10" />
            <BarChart3 className="w-8 h-8 text-primary-500" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-accent-600 via-primary-600 to-pink-500 bg-clip-text text-transparent tracking-tight">Excel Comparison Tool</h1>
            <p className="text-base md:text-lg text-gray-600 font-medium mt-1">Compare Asset Management Data <span className="text-accent-500">✨</span></p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm text-gray-600 z-10">
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
    </header>
  )
}

export default Header 