'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, Tooltip } from "recharts"
import { useQuery } from '@tanstack/react-query'

interface SalesCategoryData {
  categoryId: string
  categoryName: string
  image: string
  totalSales: number
  ordersCount: number
  percent: number
}

interface ApiResponse {
  success: boolean
  data: SalesCategoryData[]
  totalAll: number
}

interface ChartData {
  name: string
  value: number
  color: string
}

export function SalesCategory() {
  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ['sales-by-category'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/sales-by-category`)
      if (!response.ok) {
        throw new Error('Failed to fetch sales category data')
      }
      return response.json()
    }
  })

  // Define colors for categories (map to API data dynamically)
  const COLORS = ["#B38AD8", "#D5A96C", "#A1C78F", "#EA8585", "#5EC5C9", "#6F8CCC"]

  // Transform API data to chart format
  const chartData: ChartData[] = data?.data.map((item, index) => ({
    name: item.categoryName,
    value: item.percent,
    color: COLORS[index % COLORS.length] // Cycle through colors if more categories than colors
  })) || []

  if (isLoading) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Sales by Category</CardTitle>
        </CardHeader>
        <CardContent className="bg-[#E9E3F6]">
          <div className="flex items-center gap-8">
            <div className="flex-1 w-[50%] space-y-3 py-10">
              {/* Skeleton for legend list */}
              {Array(3).fill(0).map((_, index) => (
                <div key={index} className="flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-300 rounded-full" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                  <div className="h-4 w-12 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
            <div className="relative w-[50%]">
              <div className="flex justify-end">
                {/* Skeleton for pie chart */}
                <div className="w-[238px] h-[238px] bg-gray-200 rounded-full animate-pulse" />
              </div>
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
          <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Sales by Category</CardTitle>
        </CardHeader>
        <CardContent className="bg-[#E9E3F6] h-80 flex items-center justify-center">
          <div className="text-red-500">Error: {error.message}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Sales by Category</CardTitle>
      </CardHeader>
      <CardContent className="bg-[#E9E3F6]">
        <div className="flex items-center gap-8">
          <div className="flex-1 w-[50%] space-y-3 py-10">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#595959] text-base font-normal">{item.name}</span>
                </div>
                <span className="text-gray-600 text-sm">{item.value.toFixed(2)}%</span>
              </div>
            ))}
          </div>
          <div className="relative w-[50%]">
            <div className="flex justify-end">
              <div style={{ width: '238px', height: '238px' }}>
                <PieChart width={238} height={238}>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const value = Number(payload[0].value);
                        return (
                          <div className="bg-white p-2 border border-purple-200 rounded shadow-lg">
                            <p className="text-purple-600 font-medium">{`${payload[0].name}: ${value.toFixed(2)}%`}</p>
                          </div>
                        );
                      }
                      return null;
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