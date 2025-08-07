"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  { month: "Jan", sales: 12000 },
  { month: "Feb", sales: 13500 },
  { month: "Mar", sales: 14200 },
  { month: "Apr", sales: 15100 },
  { month: "May", sales: 14800 },
  { month: "Jun", sales: 13900 },
  { month: "Jul", sales: 16200 },
  { month: "Aug", sales: 17800 },
  { month: "Sep", sales: 18500 },
  { month: "Oct", sales: 19200 },
  { month: "Nov", sales: 20100 },
  { month: "Dec", sales: 21000 },
]

export function SalesChart() {
  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Sales Overview</CardTitle>
      </CardHeader>
      <CardContent className="bg-[#E9E3F6]">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#c4b5fd"
                strokeOpacity={0.6}
                horizontal={true}
                vertical={true}
              />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                domain={[0, 35000]}
                ticks={[0, 7000, 14000, 21000, 28000, 35000]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-3 border border-purple-200 rounded-lg shadow-lg">
                        <p className="text-purple-600 font-medium">15 July 2025</p>
                        <p className="text-purple-700 font-semibold">Sales: 1800</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={2} fill="url(#salesGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
