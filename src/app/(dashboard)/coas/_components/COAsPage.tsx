
"use client"

import { useState } from "react"
import { Search, SquarePen, Trash,  } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

function UploadCOAModal({ 
  open, 
  onOpenChange 
}: { 
  open: boolean 
  onOpenChange: (open: boolean) => void 
}) {
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

  const handleUpload = () => {
    // Implement your upload logic here
    console.log("Uploading file:", file)
    onOpenChange(false)
    setFile(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] !rounded-[8px] bg-white ">
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
            disabled={!file}
          >
            Add File
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function COAsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<{categoryId: string, itemId: number} | null>(null)
  console.log(currentItem)

  const handleReUploadClick = (categoryId: string, itemId: number) => {
    setCurrentItem({categoryId, itemId})
    setUploadModalOpen(true)
  }

  const categories = [
    {
      id: "flower",
      name: "Flower",
      items: [
        { id: 1, name: "COAs 1" },
        { id: 2, name: "COAs 2" },
        { id: 3, name: "COAs 3" },
        { id: 4, name: "COAs 4" },
        { id: 5, name: "COAs 5" },
        { id: 6, name: "COAs 6" },
      ],
    },
    {
      id: "gummies",
      name: "Gummies",
      items: [
        { id: 1, name: "COAs 1" },
        { id: 2, name: "COAs 2" },
        { id: 3, name: "COAs 3" },
        { id: 4, name: "COAs 4" },
        { id: 5, name: "COAs 5" },
        { id: 6, name: "COAs 6" },
      ],
    },
    {
      id: "edibles",
      name: "Edibles",
      items: [
        { id: 1, name: "COAs 1" },
        { id: 2, name: "COAs 2" },
        { id: 3, name: "COAs 3" },
        { id: 4, name: "COAs 4" },
        { id: 5, name: "COAs 5" },
        { id: 6, name: "COAs 6" },
      ],
    },
  ]

  return (
    <div className="min-h-screen">
      <div className="w-full rounded-lg">
        {/* Upload Modal */}
        <UploadCOAModal 
          open={uploadModalOpen} 
          onOpenChange={setUploadModalOpen} 
        />

        {/* Header */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-[10%]">
              <h1 className="text-xl font-bold text-[#1F2937]">COAs List</h1>
              <p className="text-sm text-[#4B5563] font-normal">Set your COAs list</p>
            </div>
            {/* Search Bar */}
            <div className="w-[85%] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-[#6B46C1] rounded-[8px] h-[48px]"
              />
            </div>
          </div>
        </div>

        {/* COAs Title & Subtitle */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#1F2937]">COAs Title & Subtitle</h2>
            <Button size="sm" className="bg-[#6B46C1] hover:bg-[#6B46C1]/85 text-white px-3 py-1 text-xs">
              <SquarePen />
            </Button>
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

          <Button className="bg-[#6B46C1] hover:bg-[#6B46C1]/85 text-white px-[32px] h-[51px] text-base rounded-[8px] mt-[48px]">
            Save Changes
          </Button>
        </div>

        {/* COAs All Categories */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-[#1F2937] mb-4">COAs All Categories</h2>

          <Accordion type="single" collapsible defaultValue="flower" className="space-y-2">
            {categories.map((category) => (
              <AccordionItem key={category.id} value={category.id} className="border border-gray-200 rounded-[8px]">
                <AccordionTrigger className="px-4 py-3 bg-[#6B46C1] text-white rounded-[8px] [&[data-state=closed]]:rounded-lg [&>svg]:text-white">
                  <span className="font-medium">{category.name}</span>
                </AccordionTrigger>
                <AccordionContent className="px-0 py-0">
                  <div className="bg-white">
                    {category.items.map((item, index) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between px-4 py-3 bg-white ${
                          index !== category.items.length - 1 ? "border-b border-gray-200" : ""
                        } ${index === category.items.length - 1 ? "rounded-b-lg" : ""}`}
                      >
                        <span className="text-sm text-gray-700 font-medium">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="bg-[#6B46C1] text-white px-3 h-[24px] rounded-[8px] text-xs font-medium"
                            onClick={() => handleReUploadClick(category.id, item.id)}
                          >
                            Re Upload
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-1 h-7 w-7 bg-[#6B46C1] rounded-[4px]"
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
        </div>
      </div>
    </div>
  )
}