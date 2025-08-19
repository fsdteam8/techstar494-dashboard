'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useQuery } from '@tanstack/react-query'

interface SalesData {
  year: number
  month: number
  monthLabel: string
  totalSales: number
  ordersCount: number
}

interface ApiResponse {
  success: boolean
  data: SalesData[]
}

export function SalesChart() {
  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ['sales-overview'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/sales-overview`)
      if (!response.ok) {
        throw new Error('Failed to fetch sales data')
      }
      return response.json()
    }
  })

  if (isLoading) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Sales Overview</CardTitle>
        </CardHeader>
        <CardContent className="bg-[#E9E3F6] h-80 flex items-center justify-center">
          <div className="w-full h-full p-4">
            <div className="animate-pulse">
              {/* Chart area placeholder */}
              <div className="h-[70%] w-full bg-gray-200 rounded-lg" />
              {/* X-axis placeholder */}
              <div className="h-1 w-full bg-gray-300 mt-4 rounded" />
              {/* Y-axis placeholder */}
              <div className="h-[70%] w-1 bg-gray-300 absolute top-10 left-4 rounded" />
              {/* Grid lines placeholders */}
              <div className="h-1 w-[90%] bg-gray-200 mt-2 opacity-50 rounded" />
              <div className="h-1 w-[90%] bg-gray-200 mt-4 opacity-50 rounded" />
              <div className="h-1 w-[90%] bg-gray-200 mt-4 opacity-50 rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Sales Overview</CardTitle>
        </CardHeader>
        <CardContent className="bg-[#E9E3F6] h-80 flex items-center justify-center">
          <div className="text-red-500">Error: {error.message}</div>
        </CardContent>
      </Card>
    )
  }

  // Transform API data to match chart format
  const chartData = data?.data.map(item => ({
    month: item.monthLabel,
    sales: item.totalSales,
    orders: item.ordersCount,
    year: item.year
  })) || []

  // Calculate max value for YAxis with some padding
  const maxSalesValue = Math.max(...chartData.map(item => item.sales), 0) * 1.2

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Sales Overview</CardTitle>
      </CardHeader>
      <CardContent className="bg-[#E9E3F6]">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
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
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: "#6b7280", fontSize: 12 }} 
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                domain={[0, maxSalesValue]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="bg-white p-3 border border-purple-200 rounded-lg shadow-lg">
                        <p className="text-purple-600 font-medium">{data.month} {data.year}</p>
                        <p className="text-purple-700 font-semibold">Sales: ${data.sales.toFixed(2)}</p>
                        <p className="text-purple-500">Orders: {data.orders}</p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="#8b5cf6" 
                strokeWidth={2} 
                fill="url(#salesGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}