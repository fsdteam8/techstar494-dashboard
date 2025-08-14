'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import TechstarPagination from '@/components/ui/TechstarPagination'
import { Loader2 } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { OrdersApiResponse } from '../../../../../types/orders.types'

// -------- API Fetch Function --------
const fetchOrders = async (
  page: number,
  search: string
): Promise<OrdersApiResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '8',
  })

  if (search.trim()) {
    params.append('search', search.trim())
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/order?${params.toString()}`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch orders')
  }
  return res.json()
}

// -------- Component --------
interface OrdersContainerProps {
  search: string
}

const OrdersContainer: React.FC<OrdersContainerProps> = ({ search }) => {
  const [currentPage, setCurrentPage] = useState<number>(1)

  // ✅ debounce search
  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading, isError, error } = useQuery<OrdersApiResponse>({
    queryKey: ['orders', currentPage, debouncedSearch],
    queryFn: () => fetchOrders(currentPage, debouncedSearch),
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full mt-12">
        <Loader2 className="animate-spin text-primary mx-auto" />
        <p className="text-center py-3">Loading orders...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <p className="text-center text-red-500 py-10">
        {(error as Error).message}
      </p>
    )
  }

  return (
    <div className="mt-8">
      <table className="w-full">
        <thead className="bg-[#F9FAFB] rounded-t-[8px]">
          <tr className="w-full grid grid-cols-5 py-3 px-4">
            <th className="text-sm text-[#6B7280] font-medium text-left">
              Customer
            </th>
            <th className="text-sm text-[#6B7280] font-medium text-center">
              Product
            </th>
            <th className="text-sm text-[#6B7280] font-medium text-center">
              Date
            </th>
            <th className="text-sm text-[#6B7280] font-medium text-center">
              Price
            </th>
            <th className="text-sm text-[#6B7280] font-medium text-center">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.map((order) => (
            <tr
              key={order._id}
              className="w-full bg-white grid grid-cols-5 p-4 mb-[2px]"
            >
              {/* Customer */}
              <td className="flex items-center gap-2">
                <Image
                  src={order.product?.photo[0] || '/assets/images/user.jpg'}
                  alt={order.user?.userName || 'Customer'}
                  width={60}
                  height={60}
                  className="w-[60px] h-[60px] rounded-[8px]"
                />
                <div>
                  <p className="text-lg text-[#111827] font-semibold">
                    {order.user?.firstName || order.user?.lastName
                      ? `${order.user?.firstName ?? ''} ${
                          order.user?.lastName ?? ''
                        }`
                      : order.user?.userName}
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    {order.user?.userName}
                  </p>
                </div>
              </td>

              {/* Product */}
              <td className="flex items-center justify-center text-sm text-[#6B7280]">
                {order.product?.name}
              </td>

              {/* Date */}
              <td className="flex items-center justify-center text-sm text-[#6B7280]">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>

              {/* Price */}
              <td className="flex items-center justify-center text-sm text-[#6B7280]">
                ${order.totalAmount?.toFixed(2)}
              </td>

              {/* Status */}
              <td className="flex items-center justify-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'Pending'
                      ? 'bg-[#FFD5D5] text-red-700'
                      : order.status === 'Ongoing'
                      ? 'bg-[#FBCA85] text-yellow-800'
                      : 'bg-[#D5FFD5] text-green-700'
                  }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="bg-white flex items-center justify-between py-[10px] px-[50px]">
          <p className="text-sm text-[#707070]">
            Showing page {currentPage} of {data.pagination.totalPages} — Total{' '}
            {data.pagination.totalData} orders
          </p>
          <TechstarPagination
            totalPages={data.pagination.totalPages}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </div>
  )
}

export default OrdersContainer
