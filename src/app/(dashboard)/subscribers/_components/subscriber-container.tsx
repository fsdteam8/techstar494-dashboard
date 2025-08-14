'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import TechstarPagination from '@/components/ui/TechstarPagination'
import { Loader2, ListFilter } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSession } from 'next-auth/react'
import { SubscribersApiResponse } from '../../../../../types/subscribers.types'

interface SubscriberContainerProps {
  search: string
}

const SubscriberContainer: React.FC<SubscriberContainerProps> = ({
  search,
}) => {
  const session = useSession()
  const token = (session?.data?.user as { accessToken: string })?.accessToken
  const [currentPage, setCurrentPage] = useState(1)
  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading, isError, error } = useQuery<SubscribersApiResponse>({
    queryKey: ['all-subscribers', debouncedSearch, currentPage],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriber/all?page=${currentPage}&search=${debouncedSearch}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      ).then((res) => res.json()),
    enabled: !!token, // only run if token exists
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full mt-12">
        <Loader2 className="animate-spin text-primary mx-auto" />
        <p className="text-center py-3">Loading subscribers...</p>
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
    <div>
      {/* Filters */}
      <div className="w-full flex items-center justify-end py-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-[10px] py-[15px] px-[32px] rounded-[8px] border-[1.5px] border-primary text-sm font-medium text-black leading-[120%]">
            <ListFilter size={20} className="text-primary" /> Filters
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[5rem] bg-[#F0EDF9]">
            <DropdownMenuLabel>This Month</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#B3B3B3]" />
            <DropdownMenuLabel>Previous Month</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#B3B3B3]" />
            <DropdownMenuLabel>Last Month</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="mt-2">
        <table className="w-full table-fixed border-collapse">
          <thead className="bg-[#F9FAFB]">
            <tr>
              <th className="w-1/2 text-sm text-[#6B7280] font-medium text-left py-3 px-4">
                Subscriber Email
              </th>
              <th className="w-1/4 text-sm text-[#6B7280] font-medium text-center py-3 px-4">
                Subscribed Date
              </th>
              <th className="w-1/4 text-sm text-[#6B7280] font-medium text-center py-3 px-4">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((subscriber) => (
              <tr key={subscriber._id} className="bg-white border-b">
                <td className="flex items-center gap-2 py-4 px-4">
                  <Image
                    src="/assets/images/user.jpg"
                    alt="Subscriber"
                    width={60}
                    height={60}
                    className="w-[60px] h-[60px] rounded-[8px]"
                  />
                  <span className="text-lg text-[#111827] font-semibold">
                    {subscriber?.email}
                  </span>
                </td>
                <td className="text-sm text-[#6B7280] text-center py-4 px-4">
                  {new Date(subscriber?.subscribedAt).toLocaleDateString()}
                </td>
                <td className="text-center py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      subscriber?.isActive
                        ? 'bg-[#D5FFD5] text-green-700'
                        : 'bg-[#FFD5D5] text-red-700'
                    }`}
                  >
                    {subscriber?.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}

            {/* No results found */}
            {data?.data?.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="text-center text-gray-500 py-6 font-medium"
                >
                  No subscribers found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="bg-white flex items-center justify-between py-[10px] px-[50px]">
            <p className="text-sm text-[#707070]">
              Showing page {currentPage} of {data.pagination.totalPages} — Total{' '}
              {data.pagination.totalSubscribers} subscribers
            </p>
            <TechstarPagination
              totalPages={data.pagination.totalPages}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriberContainer
