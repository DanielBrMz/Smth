import React from 'react'

interface SpreadsheetProps {
  labels: string[]
  items: string[]
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ labels, items }) => {
  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Labels */}
      <div className="flex justify-between w-full max-w-5/6">
        {labels.map((label, index) => (
          <div key={index} className="flex-1 text-center text-gray-500">
            {label}
          </div>
        ))}
      </div>

      {/* Spreadsheet Container */}
      <div className="bg-gray-800 rounded-lg p-4 w-full max-w-5/6">
        <div className="flex justify-between">
          {items.map((item, index) => (
            <div key={index} className="flex-1 text-center text-white">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Spreadsheet
