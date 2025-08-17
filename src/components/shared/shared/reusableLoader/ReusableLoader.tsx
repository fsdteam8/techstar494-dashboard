'use client'

import React from 'react'

interface ReusableLoaderProps {
  rows?: number
  headings: string[]
}

const ReusableLoader: React.FC<ReusableLoaderProps> = ({
  rows = 5,
  headings,
}) => {
  return (
    <div className="mt-8 animate-pulse">
      <table className="w-full">
        <thead className="bg-[#F9FAFB] rounded-t-[8px]">
          <tr
            className={`w-full grid grid-cols-${headings.length} py-3 px-4`}
            style={{
              gridTemplateColumns: `repeat(${headings.length}, minmax(0, 1fr))`, // Dynamic columns
            }}
          >
            {headings.map((heading, i) => (
              <th
                key={i}
                className="text-sm text-[#6B7280] font-medium text-left"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, rowIndex) => (
            <tr
              key={rowIndex}
              className={`w-full bg-white grid grid-cols-${headings.length} p-4 mb-[2px]`}
              style={{
                gridTemplateColumns: `repeat(${headings.length}, minmax(0, 1fr))`,
              }}
            >
              {headings.map((_, colIndex) => (
                <td key={colIndex} className="flex items-center justify-center">
                  {colIndex === 0 ? (
                    <div className="flex items-center gap-2">
                      <div className="w-[60px] h-[60px] bg-gray-200 rounded-[8px]"></div>
                      <div>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-20 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`bg-gray-200 rounded ${
                        colIndex === headings.length - 1
                          ? 'h-5 w-16 rounded-full' // last column status-এর জন্য pill shape
                          : 'h-3 w-20'
                      }`}
                    ></div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReusableLoader
