'use client'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface SubscriberHeaderProps {
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

const SubscriberHeader: React.FC<SubscriberHeaderProps> = ({
  search,
  setSearch,
}) => {
  return (
    <div className="w-full flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-[#1F2937] leading-[120%]">
          Subscribers List
        </h2>
        <p className="text-sm text-[#4B5563] pt-2">
          See your subscribers list.
        </p>
      </div>
      <div className="relative w-1/3">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#707070]"
          size={24}
        />
        <Input
          type="search"
          placeholder="Search by email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={cn(
            'pl-10',
            'border-primary',
            'h-[48px] rounded-[8px] placeholder:text-sm placeholder:text-[#707070]',
            'focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-secondary-100 focus-visible:outline-none'
          )}
        />
      </div>
      <div>
        <Link href="/subscribers/send-mail">
          <Button className="h-[51px] text-base font-medium text-white py-4 px-8 rounded-[8px] bg-[#6B46C1]">
            Send Email
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default SubscriberHeader
