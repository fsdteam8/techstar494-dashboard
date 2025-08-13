'use client'

import Image from 'next/image'
import { UsersApiResponse } from '../../../../../types/user.types'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import TechstarPagination from '@/components/ui/TechstarPagination'
import { Loader2 } from 'lucide-react'

interface UsersContainerProps {
  search: string
}

// API function with search parameter
const fetchUsers = async (
  page: number,
  search: string
): Promise<UsersApiResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: '8',
  })

  if (search.trim()) {
    params.append('search', search.trim())
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user?${params.toString()}`,
    { cache: 'no-store' }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }
  return res.json()
}

const UsersContainer: React.FC<UsersContainerProps> = ({ search }) => {
  const [currentPage, setCurrentPage] = useState<number>(1)

  const { data, isLoading, isError, error } = useQuery<UsersApiResponse>({
    queryKey: ['users', currentPage, search],
    queryFn: () => fetchUsers(currentPage, search),
    // keepPreviousData: true,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full mt-12">
        <Loader2 className="animate-spin text-primary mx-auto" />
        <p className="text-center py-4">Loading users...</p>
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
      <div className="mt-8">
        <table className="w-full">
          <thead className="bg-[#F9FAFB] rounded-t-[8px]">
            <tr className="w-full grid grid-cols-6 py-3 px-4">
              <th className="text-sm text-[#6B7280] font-medium text-left">
                Customer Name
              </th>
              <th className="text-sm text-[#6B7280] font-medium text-center">
                Joined Date
              </th>
              <th className="text-sm text-[#6B7280] font-medium text-center">
                Last Purchased Date
              </th>
              <th className="text-sm text-[#6B7280] font-medium text-center">
                Total Spend
              </th>
              <th className="text-sm text-[#6B7280] font-medium text-center">
                Points
              </th>
              <th className="text-sm text-[#6B7280] font-medium text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.data?.map((user) => (
              <tr
                key={user._id}
                className="w-full bg-white grid grid-cols-6 p-4 mb-[2px]"
              >
                {/* Customer Name */}
                <td className="flex items-center gap-2">
                  <Image
                    src={user.imageLink || '/assets/images/user.jpg'}
                    alt="user"
                    width={60}
                    height={60}
                    className="w-[60px] h-[60px] rounded-[8px]"
                  />
                  <div>
                    <p className="text-lg text-[#111827] font-semibold">
                      {user.firstName || user.lastName
                        ? `${user.firstName ?? ''} ${user.lastName ?? ''}`
                        : user.userName}
                    </p>
                    <p className="text-sm text-[#6B7280]">{user.userName}</p>
                  </div>
                </td>

                {/* Joined Date */}
                <td className="flex items-center justify-center text-sm text-[#6B7280]">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                {/* Last Purchased Date */}
                <td className="flex items-center justify-center text-sm text-[#6B7280]">
                  —
                </td>

                {/* Total Spend */}
                <td className="flex items-center justify-center text-sm text-[#6B7280]">
                  —
                </td>

                {/* Points */}
                <td className="flex items-center justify-center text-sm text-[#6B7280]">
                  {user.points ?? 0}
                </td>

                {/* Status */}
                <td className="flex items-center justify-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      user.isVerified
                        ? 'bg-[#D5FFD5] text-green-700'
                        : 'bg-[#FFD5D5] text-red-700'
                    }`}
                  >
                    {user.isVerified ? 'Active' : 'Inactive'}
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
              {data.pagination.totalData} users
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

export default UsersContainer
