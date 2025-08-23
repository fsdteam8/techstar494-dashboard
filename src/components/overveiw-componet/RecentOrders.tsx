'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useQuery } from '@tanstack/react-query'
import Link from "next/link"

interface OrderData {
  id: string
  orderNumber: string
  user: {
    id: string
    userName: string
    email: string
    name: string
    image: string | null
  }
  product: {
    id: string
    name: string
    photo: string
  }
  cartItems: []
  totalAmount: number
  status: string
  paymentMethod: string
  purchaseDate: string
}

interface ApiResponse {
  success: boolean
  data: OrderData[]
}

interface Order {
  id: string
  sales: string
  amount: string
  time: string
  status: string
  statusColor: string
  image: string
}

export function RecentOrders() {
  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ['recent-orders'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/recent-orders`)
      if (!response.ok) {
        throw new Error('Failed to fetch recent orders data')
      }
      return response.json()
    }
  })

  // Define status colors based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-[#C7FFD5] text-green-700'
      case 'Processing':
        return 'bg-[#C7F5FF] text-blue-700'
      case 'Shipped':
        return 'bg-[#C8D3FF] text-purple-700'
      case 'Pending':
        return 'bg-[#FFC7C7] text-orange-700'
      default:
        return 'bg-gray-200 text-gray-700'
    }
  }

  // Transform API data to component format
  const orders: Order[] = data?.data.map((item) => {
    const purchaseDate = new Date(item.purchaseDate)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - purchaseDate.getTime()) / (1000 * 60))
    const timeString = diffInMinutes < 60 
      ? `${diffInMinutes} min ago`
      : `${Math.floor(diffInMinutes / 60)} hr${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`

    return {
      id: `#${item.orderNumber.slice(-4)}`, // Use last 4 characters of orderNumber
      sales: `${item.cartItems.length || 1} Sales`, // Fallback to 1 if cartItems is empty
      amount: `$${item.totalAmount.toFixed(2)}`,
      time: timeString,
      status: item.status,
      statusColor: getStatusColor(item.status),
      image: item?.product?.photo || '/placeholder.svg'
    }
  }) || []

  if (isLoading) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="bg-[#D1C6EC] px-4 py-6 rounded-[8px]">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-[#6B46C1] pb-2">
              <span className="text-xl text-[#6B46C1] font-semibold">Order Details</span>
              <Button variant="link" className="text-purple-600 p-0">View All</Button>
            </div>
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-[#E9E3F6] rounded-[8px] animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                  <div className="space-y-2">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right space-y-2">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-3 w-20 bg-gray-200 rounded" />
                  </div>
                  <div className="h-6 w-[80px] bg-gray-200 rounded" />
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
          <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Recent Orders</CardTitle>
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
        <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="bg-[#D1C6EC] px-4 py-6 rounded-[8px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-[#6B46C1] pb-2">
            <span className="text-xl text-[#6B46C1] font-semibold">Order Details</span>
            <Link href="/orders" className="text-purple-600 p-0">
            <Button variant="link" className="text-purple-600 p-0">View All</Button>
            </Link>
          </div>
          {orders.slice(0, 5).map((order, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[#E9E3F6] rounded-[8px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Image
                    src={order.image}
                    alt={`Order ${order.id}`}
                    width={40}
                    height={40}
                    className="w-[40px] h-[40px] rounded-[8px]"
                    onError={(e) => { e.currentTarget.src = '/placeholder.svg' }}
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-500">{order.sales}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.amount}</p>
                  <p className="text-sm text-gray-500">{order.time}</p>
                </div>
                <Badge className={`${order.statusColor} border-0 w-[80px] !h-[24px] text-center items-center`}>
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}