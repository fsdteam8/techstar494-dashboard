'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import { useQuery } from '@tanstack/react-query'
import Link from "next/link"

interface ProductData {
  _id: string
  revenue: number
  salesCount: number
  productId: string
  name?: string
  slug?: string
  photo: string[]
  category: string
}

interface ApiResponse {
  success: boolean
  data: ProductData[]
}

interface Product {
  name: string
  sales: string
  revenue: string
  image: string
  color: string
}

export function TopProducts() {
  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ['top-products'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/top-products`)
      if (!response.ok) {
        throw new Error('Failed to fetch top products data')
      }
      return response.json()
    }
  })

  // Define colors for products (cycle through if more products than colors)
  const COLORS = ["bg-red-100", "bg-orange-100", "bg-green-100", "bg-yellow-100", "bg-blue-100"]

  // Transform API data to component format
  const products: Product[] = data?.data.map((item, index) => ({
    name: item.name || 'Unknown Product', // Fallback for missing name
    sales: `${item.salesCount} Sales`,
    revenue: `$${item.revenue.toFixed(2)}`,
    image: item?.photo?.[0] || '', 
    color: COLORS[index % COLORS.length] 
  })) || []

  if (isLoading) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Top Products</CardTitle>
        </CardHeader>
        <CardContent className="bg-[#D1C6EC] px-4 py-6 rounded-[8px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xl text-[#6B46C1] font-semibold">Product Name</span>
              <Button variant="link" className="text-purple-600 p-0">View All</Button>
            </div>
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#E9E3F6] rounded-[8px] animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                  <div className="h-4 w-4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Top Products</CardTitle>
        </CardHeader>
        <CardContent className="bg-[#D1C6EC] px-4 py-6 rounded-[8px] h-80 flex items-center justify-center">
          <div className="text-red-500">Error: {error.message}</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Top Products</CardTitle>
      </CardHeader>
      <CardContent className="bg-[#D1C6EC] px-4 py-6 rounded-[8px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xl text-[#6B46C1] font-semibold">Product Name</span>
            <Link href="/products" className="text-purple-600 p-0">
            <Button variant="link" className="text-purple-600 p-0">View All</Button>
            </Link>
          </div>
          {products.slice(0, 5).map((product, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[#E9E3F6] rounded-[8px]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${product.color} flex items-center justify-center`}>
                  <Image 
                    src={product.image} 
                    alt={product.name} 
                    width={40} 
                    height={40} 
                    className="w-[40px] h-[40px] rounded-[8px]"
                    onError={(e) => { e.currentTarget.src = '/placeholder.svg' }} // Fallback on image error
                  />
                </div>
                <div>
                  <p className="font-medium text-[#595959] text-base">{product.name}</p>
                  <p className="text-sm text-[#595959]">{product.sales}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{product.revenue}</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}