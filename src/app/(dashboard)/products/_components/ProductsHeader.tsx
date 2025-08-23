"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductsHeaderProps {
  onAddProductClick: () => void
  onSearchChange: (query: string) => void
  searchQuery?: string
}

export default function ProductsHeader({ onAddProductClick, onSearchChange, searchQuery }: ProductsHeaderProps) {
  return (
    <div className="w-full flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-[#1F2937] leading-[120%]">
          Products List
        </h2>
        <p className="text-sm text-[#4B5563] leading-[120%] font-normal pt-2">
          Manage your Products
        </p>
      </div>
      <div className="relative w-1/3">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#707070]"
          size={24}
        />
        <Input
          type="search"
          placeholder="Search by name/product"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "pl-10",
            "border-primary",
            "h-[48px] rounded-[8px] placeholder:text-sm placeholder:text-[#707070] placeholder:leading-[120%] placeholder:font-normal",
            "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-secondary-100 focus-visible:outline-none"
          )}
        />
      </div>
      <div>
        <Button 
          className="ml-auto bg-[#6B46C1] text-white h-[48px] rounded-[8px]" 
          onClick={onAddProductClick}
        >
          Add product
        </Button>
      </div>
    </div>
  )
}