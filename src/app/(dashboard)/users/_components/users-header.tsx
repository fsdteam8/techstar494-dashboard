'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ListFilter, Search } from 'lucide-react'
import React from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UsersHeaderProps {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

const UsersHeader: React.FC<UsersHeaderProps> = ({ search, setSearch }) => {
  return (
    <div className="w-full flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-[#1F2937] leading-[120%]">
          Users List
        </h2>
        <p className="text-sm text-[#4B5563] leading-[120%] font-normal pt-2">
          See your users list.
        </p>
      </div>
      <div className="relative w-1/3">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#707070]"
          size={24}
        />
        <Input
          type="search"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            'pl-10',
            'border-primary',
            'h-[48px] rounded-[8px] placeholder:text-sm placeholder:text-[#707070] placeholder:leading-[120%] placeholder:font-normal',
            'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-secondary-100 focus-visible:outline-none'
          )}
        />
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-[10px] py-[15px] px-[32px] rounded-[8px] border-[1.5px] border-primary text-sm font-medium text-black leading-[120%]">
            <ListFilter size={20} className="text-primary" /> Filters
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-[5rem] bg-white">
            <DropdownMenuLabel>This Month</DropdownMenuLabel>
            <DropdownMenuLabel>Previous Month</DropdownMenuLabel>
            <DropdownMenuLabel>Last Year</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default UsersHeader
