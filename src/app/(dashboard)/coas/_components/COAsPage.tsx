"use client"

import { useState, useEffect } from "react"
import {Trash } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from "react-toastify"

// Type definitions
type CoaItem = {
  productId: string
  productName: string
  batch: string
  description: string
  index: number
  url: string
}

type CoaCategory = {
  _id: string
  categoryName: string
  coas: CoaItem[]
}

type CoaApiResponse = {
  success: boolean
  data: CoaCategory[]
}

type SelectedItem = {
  categoryId: string
  itemId: number
} | null

type SelectedCoa = {
  productId: string
  coaIndex: number
} | null

type UploadCOAModalProps = {
  open: boolean 
  onOpenChange: (open: boolean) => void
  onUpload: (file: File) => Promise<void>
  isPending?: boolean
}

// Upload Modal Component
function UploadCOAModal({ 
  open, 
  onOpenChange,
  onUpload,
  isPending = false
}: UploadCOAModalProps) {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleUpload = async () => {
    if (file) {
      try {
        await onUpload(file)
        onOpenChange(false)
        setFile(null)
      } catch (error) {
        console.error('Upload failed:', error)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] !rounded-[8px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#1A1C21]">COAs</DialogTitle>
          <p className="text-base text-[#1A1C21]">Upload COAs</p>
        </DialogHeader>
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <input
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
            />
            {file ? (
              <div className="text-sm text-gray-700">
                <p className="font-medium">Selected file:</p>
                <p className="mt-1 text-[#6B46C1]">{file.name}</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-2">Drag and drop your file here</p>
                <p className="text-sm text-gray-500">or</p>
                <p className="text-sm text-[#6B46C1] font-medium mt-2">click to upload</p>
              </>
            )}
          </div>
          <Button 
            className="w-full bg-[#6B46C1] hover:bg-[#6B46C1]/85 text-white h-[51px] text-base rounded-[8px]"
            onClick={handleUpload}
            disabled={!file || isPending}
          >
            {isPending ? 'Uploading...' : 'Add File'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Delete Confirmation Modal Component
function DeleteConfirmationModal({
  open,
  onOpenChange,
  onConfirm
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] !rounded-[8px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#1A1C21]">Confirm Deletion</DialogTitle>
          <p className="text-base text-[#1A1C21]">Are you sure you want to delete this COA?</p>
        </DialogHeader>
        <div className="flex justify-end gap-4">
          <Button 
            variant="outline"
            className="border-[#6B46C1] text-[#6B46C1]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={onConfirm}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// API Functions
async function fetchCoas(): Promise<CoaCategory[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coas`)
  const json: CoaApiResponse = await response.json()
  if (!json.success) {
    throw new Error('Failed to fetch COAs')
  }
  return json.data
}

// Main Component
export default function COAsPage() {

  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [currentItem, setCurrentItem] = useState<SelectedItem>(null)
  const [selectedCoa, setSelectedCoa] = useState<SelectedCoa>(null)

  const queryClient = useQueryClient()

  const { data: categories, isLoading } = useQuery<CoaCategory[]>({
    queryKey: ['coas'],
    queryFn: fetchCoas,
  })

  const deleteMutation = useMutation({
    mutationFn: async ({ productId, coaIndex }: { productId: string; coaIndex: number }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coas/${productId}/${coaIndex}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete COA')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coas'] })
      toast.success('COA deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete COA')
    }
  })

  const reuploadMutation = useMutation({
    mutationFn: async ({ productId, coaIndex, file }: { productId: string; coaIndex: number; file: File }) => {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coas/${productId}/${coaIndex}/reupload`, {
        method: 'PUT',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Failed to re-upload COA')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coas'] })
      toast.success('COA re-uploaded successfully')
    },
    onError: () => {
      toast.error('Failed to re-upload COA')
    }
  })

  const handleReUploadClick = (categoryId: string, itemId: number) => {
    setCurrentItem({ categoryId, itemId })
    setUploadModalOpen(true)
  }

  const handleDeleteClick = (productId: string, coaIndex: number) => {
    setSelectedCoa({ productId, coaIndex })
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (selectedCoa) {
      deleteMutation.mutate(selectedCoa)
    }
    setDeleteModalOpen(false)
    setSelectedCoa(null)
  }

  useEffect(() => {
    if (!uploadModalOpen) {
      setCurrentItem(null)
    }
  }, [uploadModalOpen])

  const filteredCategories = categories?.map(cat => ({
    ...cat,
    // coas: cat.coas.filter(coa => coa.productName.toLowerCase().includes(searchQuery.toLowerCase()))
  })).filter(cat => cat.coas.length > 0) || []

  return (
    <div className="min-h-screen">
      <div className="w-full rounded-lg">
        {/* Upload Modal */}
        <UploadCOAModal 
          open={uploadModalOpen} 
          onOpenChange={setUploadModalOpen}
          onUpload={async (file) => {
            if (currentItem) {
              await reuploadMutation.mutateAsync({
                productId: currentItem.categoryId, 
                coaIndex: currentItem.itemId,
                file
              })
            }
          }}
          isPending={reuploadMutation.isPending}
        />

        {/* Delete Modal */}
        <DeleteConfirmationModal 
          open={deleteModalOpen} 
          onOpenChange={setDeleteModalOpen}
          onConfirm={handleConfirmDelete}
        />

        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-[10%]">
              <h1 className="text-xl font-bold text-[#1F2937]">COAs List</h1>
              <p className="text-sm text-[#4B5563] font-normal">Set your COAs list</p>
            </div>
            {/* Search Bar */}
            
          </div>
        </div>

        {/* COAs Title & Subtitle */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#1F2937]">COAs Title & Subtitle</h2>
           
          </div>

          <div className="space-y-3 mt-8">
            <h3 className="text-[24px] font-bold text-[#444444]">
              Certificates of Analysis (COAs), the gold standard in the cannabis world and a testament to a product&apos;s
              potency and purity.
            </h3>
            <p className="text-base text-[#444444] leading-relaxed">
              Providing customers with detailed information about the cannabinoid levels and test for pesticides, mold,
              microbials and other contaminants. It&apos;s a crucial step to ensure every product aligns with federal law and
              more importantly, safe for consumption. Mood treats COAs on gospel it&apos;s not just about ticking boxes; it&apos;s
              about a commitment to transparency and safety.
            </p>
          </div>

        </div>

        {/* COAs All Categories */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#1F2937] mb-4">COAs All Categories</h2>

          {isLoading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, catIndex) => (
                <div key={catIndex} className="border border-gray-200 rounded-[8px]">
                  <div className="px-4 py-3 bg-[#6B46C1] text-white rounded-[8px]">
                    <div className="bg-gray-300 animate-pulse h-5 w-32 rounded"></div>
                  </div>
                  <div className="bg-white">
                    {[...Array(3)].map((_, itemIndex) => (
                      <div
                        key={itemIndex}
                        className={`flex items-center justify-between px-4 py-3 bg-white ${
                          itemIndex !== 2 ? "border-b border-gray-200" : ""
                        } ${itemIndex === 2 ? "rounded-b-lg" : ""}`}
                      >
                        <div className="bg-gray-200 animate-pulse h-4 w-48 rounded"></div>
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-300 animate-pulse h-6 w-20 rounded"></div>
                          <div className="bg-gray-300 animate-pulse h-6 w-7 rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Accordion type="single" collapsible defaultValue={filteredCategories[0]?._id} className="space-y-2">
              {filteredCategories.map((category) => (
                <AccordionItem key={category._id} value={category._id} className="border border-gray-200 rounded-[8px]">
                  <AccordionTrigger className="px-4 py-3 bg-[#6B46C1] text-white rounded-[8px] [&[data-state=closed]]:rounded-lg [&>svg]:text-white">
                    <span className="text-[18px] font-bold text-white">{category.categoryName}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 py-0">
                    <div className="bg-white">
                      {category.coas.map((coa, index) => (
                        <div
                          key={`${coa.productId}-${coa.index}`}
                          className={`flex items-center justify-between px-4 py-3 bg-white ${
                            index !== category.coas.length - 1 ? "border-b border-gray-200" : ""
                          } ${index === category.coas.length - 1 ? "rounded-b-lg" : ""}`}
                        >
                          <span className="text-base text-[#323232] font-normal">{coa.productName}</span>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="bg-[#6B46C1] text-white px-3 h-[24px] rounded-[8px] text-xs font-medium"
                              onClick={() => handleReUploadClick(coa.productId, coa.index)}
                            >
                              Re Upload
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="p-1 h-7 w-7 bg-[#6B46C1] rounded-[4px]"
                              onClick={() => handleDeleteClick(coa.productId, coa.index)}
                            >
                              <Trash className="h-4 w-4 text-white" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  )
}