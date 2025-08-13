"use client"

import { useState } from "react"
import { Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function COAsPage() {
  const [searchQuery, setSearchQuery] = useState("")

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
    <div className="min-h-screen ">
      <div className="w-full   rounded-lg bo">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="w-[10%]">
              <h1 className="text-lg font-semibold text-gray-900">COAs List</h1>
              <p className="text-sm text-gray-600">Set your COAs list</p>
            </div>
             {/* Search Bar */}
          <div className="w-[85%] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-300"
            />
          </div>
          </div>

         
        </div>

        {/* COAs Title & Subtitle */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium text-gray-900">COAs Title & Subtitle</h2>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-xs">
              ✏️
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">
              Certificates of Analysis (COAs), the gold standard in the cannabis world and a testament to a product&apos;s
              potency and purity.
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Providing customers with detailed information about the cannabinoid levels and test for pesticides, mold,
              microbials and other contaminants. It&apos;s a crucial step to ensure every product aligns with federal law and
              more importantly, safe for consumption. Mood treats COAs on gospel it&apos;s not just about ticking boxes; it&apos;s
              about a commitment to transparency and safety.
            </p>
          </div>

          <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 text-sm">Save Changes</Button>
        </div>

        {/* COAs All Categories */}
        <div className="p-6">
          <h2 className="text-base font-medium text-gray-900 mb-4">COAs All Categories</h2>

          <Accordion type="single" collapsible defaultValue="flower" className="space-y-2">
            {categories.map((category) => (
              <AccordionItem key={category.id} value={category.id} className="border border-gray-200 rounded-lg">
                <AccordionTrigger className="px-4 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-t-lg [&[data-state=closed]]:rounded-lg [&>svg]:text-white">
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
                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-xs font-medium"
                          >
                            Re Upload
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="p-1 h-7 w-7 border-purple-600 text-purple-600 hover:bg-purple-50 bg-white"
                          >
                            <Download className="h-3 w-3" />
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
