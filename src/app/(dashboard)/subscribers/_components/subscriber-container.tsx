'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import TechstarPagination from '@/components/ui/TechstarPagination'
import { ListFilter } from 'lucide-react'
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
import ReusableLoader from '@/components/shared/shared/reusableLoader/ReusableLoader'
import ErrorContainer from '@/components/shared/shared/ErrorContainer/ErrorContainer'
import NotFound from '@/components/shared/shared/NotFound/NotFound'

interface SubscriberContainerProps {
  search: string
  filter: string
  setFilter: React.Dispatch<React.SetStateAction<string>>
}

const SubscriberContainer: React.FC<SubscriberContainerProps> = ({
  search,
  filter,
  setFilter,
}) => {
  const session = useSession()
  const token = (session?.data?.user as { accessToken: string })?.accessToken
  const [currentPage, setCurrentPage] = useState(1)
  const debouncedSearch = useDebounce(search, 500)

  const { data, isLoading, isError, error } = useQuery<SubscribersApiResponse>({
    queryKey: ['all-subscribers', debouncedSearch, currentPage, filter],
    queryFn: () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      })

      if (debouncedSearch.trim()) {
        params.append('search', debouncedSearch.trim())
      }

      if (filter) {
        params.append('filter', filter)
      }

      return fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscriber/all?page=${currentPage}&limt=10&${params}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      ).then((res) => res.json())
    },
    enabled: !!token, // only run if token exists
  })

  // console.log(data?.pagination)

  const rowsNumber = data?.data.length

  if (isLoading) {
    return (
      <ReusableLoader
        rows={rowsNumber}
        headings={['Subscriber Email', 'Subscribed Date', 'Status']}
      />
    )
  }

  if (isError) {
    return (
      <div className="my-10 rounded-lg">
        <ErrorContainer message={error?.message || 'Something went wrong'} />
      </div>
    )
  }

  if (data?.data?.length === 0) {
    return (
      <div className="my-10 rounded-lg">
        <NotFound message="Oops! No data available. Modify your filters or check your internet connection." />
      </div>
    )
  }

  return (
    <div>
      {/* Filters */}
      <div className="w-full flex items-center justify-end py-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-[10px] py-[15px] px-[32px] rounded-[8px] border-[1.5px] border-primary text-sm font-medium text-black leading-[120%]">
            <ListFilter size={20} className="text-primary" />{' '}
            {filter ? filter : 'Filters'}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[5rem] bg-[#F0EDF9]">
            <DropdownMenuLabel
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setFilter('this-month')}
            >
              This Month
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#B3B3B3]" />
            <DropdownMenuLabel
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setFilter('previous-month')}
            >
              Previous Month
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#B3B3B3]" />
            <DropdownMenuLabel
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setFilter('last-month')}
            >
              Last Month
            </DropdownMenuLabel>
            <DropdownMenuLabel
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => setFilter('')}
            >
              Clear Filter
            </DropdownMenuLabel>
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
                  <span className="text-lg text-gray-500 font-semibold">
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
        {data?.pagination && data.pagination.totalPages > 0 && (
          <div className="w-full bg-white flex items-center justify-between py-[10px] px-[50px] ">
            <p className="text-sm text-[#707070]">
              Showing page {currentPage} of {data.pagination.totalPages} — Total{' '}
              {data.pagination.totalSubscribers} subscribers
            </p>
            <div>
              <TechstarPagination
                totalPages={data.pagination.totalPages}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriberContainer
