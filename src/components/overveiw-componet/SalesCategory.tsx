"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip } from "recharts"

const data = [
  { name: "Gummies", value: 60, color: "#B38AD8" },
  { name: "Edibles", value: 50, color: "#D5A96C" },
  { name: "Flower", value: 40, color: "#A1C78F" },
  { name: "Prerolls", value: 30, color: "#EA8585" },
  { name: "Vapes", value: 20, color: "#5EC5C9" },
  { name: "Beverage", value: 10, color: "#6F8CCC" },
]

export function SalesCategory() {
  return (
    <Card className=" border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Sales by Category</CardTitle>
      </CardHeader>
      <CardContent className="bg-[#E9E3F6]">
        <div className="flex items-center gap-8">
          <div className="flex-1 w-[50%] space-y-3 py-10">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between ">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#595959] text-base font-normal">{item.name}</span>
                </div>
                <span className="text-gray-600 text-sm">{item.value}%</span>
              </div>
            ))}
          </div>
          <div className="relative w-[50%]">
            <div className="flex justify-end">
              <div style={{ width: '238px', height: '238px' }}>
                <PieChart width={238} height={238}>
                  <Pie 
                    data={data} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={60} 
                    outerRadius={100} 
                    paddingAngle={2} 
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border border-purple-200 rounded shadow-lg">
                            <p className="text-purple-600 font-medium">{`${payload[0].name}: 1800`}</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}