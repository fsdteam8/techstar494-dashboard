"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, PlusIcon, SaveIcon, UploadCloudIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface AddProductFormProps {
  onSave: () => void
  onCancel: () => void
}

export default function AddProductForm({ onSave }: AddProductFormProps) {
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined)

  return (
    <div className="flex flex-col gap-6  min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Add Product</h1>
          <p className="text-sm text-muted-foreground">Add New Product</p>
        </div>
        <Button className="bg-[#6B46C1] hover:bg-[#5A3A9F] text-white" onClick={onSave}>
          <SaveIcon className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 flex flex-col gap-6  shadow-[0_0_10px_2px_#1018281A] rounded-[8px]">
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-xl text-[#1A1C21] font-semibold">General Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <label htmlFor="product-name" className="block text-base font-medium text-[#272727] mb-1">
                  Product Name
                </label>
                <Input id="product-name" placeholder="Type product name here" className="h-[40px] border border-[#707070] rounded-[8px]" />
              </div>
              <div>
                <label htmlFor="batch" className="block text-base font-medium text-[#272727] mb-1">
                  Batch
                </label>
                <Input id="batch" placeholder="Type batch number here"  className="h-[40px] border border-[#707070] rounded-[8px]"/>
              </div>
              <div>
                <label htmlFor="description" className="block text-base font-medium text-[#272727] mb-1">
                  Description
                </label>
                <Textarea id="description" placeholder="Type product description here." rows={6}  className=" border border-[#707070] rounded-[8px]"/>
              </div>
              <div>
                <label htmlFor="disclaimers" className="block text-base font-medium text-[#272727] mb-1">
                  Disclaimers and Disclosures
                </label>
                <Textarea id="disclaimers" placeholder="Type disclaimers and disclosures here." rows={6}  className=" border border-[#707070] rounded-[8px]"/>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input placeholder="Benefits 1" className="h-[40px] border border-[#707070] rounded-[8px]" />
                <Button variant="outline" size="icon">
                  <PlusIcon className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Set Prices</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between gap-2">
                <Select  defaultValue="ct"  >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-40">
                    <SelectItem value="ct">ct</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="mg">mg</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-x-2" >
                  <label htmlFor="Unit" className="block text-base font-medium text-[#272727] mb-1">
                    Unit
                  </label>
                  <Input id="price" placeholder="0" className="" />
                </div>
              <div className="flex items-center gap-x-2">
                <label htmlFor="price" className="block text-base font-medium text-[#272727] mb-1">
                  Price
                </label>
              
                <Input placeholder="$0" className="w-[100px]" />
              </div>
                <Button className="bg-[#6B46C1]  text-white h-[51px] rounded-[8px] px-[32px] hover:bg-[#6B46C1]/85">Set</Button>
              </div>
              <Button variant="outline" className="w-fit bg-transparent">
                Add More
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>COAs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center gap-2">
                <UploadCloudIcon className="w-10 h-10 text-gray-400" />
                <p className="text-sm text-gray-500">Drag and drop your file here, or click to upload</p>
                <Button className="bg-[#6B46C1] hover:bg-[#5A3A9F] text-white">Add File</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Restricted States</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Input placeholder="State 1" />
                <Button variant="outline" size="icon">
                  <PlusIcon className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Expiration Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expirationDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expirationDate ? format(expirationDate, "PPP") : <span>Expiration Date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={expirationDate} onSelect={setExpirationDate} initialFocus />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center gap-2">
                <UploadCloudIcon className="w-10 h-10 text-gray-400" />
                <p className="text-sm text-gray-500">Drag and drop image here, or click add image</p>
                <Button className="bg-[#6B46C1] hover:bg-[#5A3A9F] text-white">Add Image</Button>
              </div>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="category">
              <AccordionTrigger className="bg-[#6B46C1] text-white px-4 py-3 rounded-t-lg hover:no-underline data-[state=open]:rounded-b-none">
                Select Category
              </AccordionTrigger>
              <AccordionContent className="bg-white border border-t-0 rounded-b-lg">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Gummies</li>
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Prerolls</li>
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Edibles</li>
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Vapes</li>
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Flower</li>
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Beverage</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="experience">
              <AccordionTrigger className="bg-[#6B46C1] text-white px-4 py-3 rounded-t-lg hover:no-underline data-[state=open]:rounded-b-none">
                Experience
              </AccordionTrigger>
              <AccordionContent className="bg-white border border-t-0 rounded-b-lg">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Relaxing</li>
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Energizing</li>
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Creative</li>
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Social</li>
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Sleep</li>
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Focus</li>
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Happy</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="dosage">
              <AccordionTrigger className="bg-[#6B46C1] text-white px-4 py-3 rounded-t-lg hover:no-underline data-[state=open]:rounded-b-none">
                Dosage
              </AccordionTrigger>
              <AccordionContent className="bg-white border border-t-0 rounded-b-lg">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Low Potency</li>
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">Medium Potency</li>
                  <li className="px-4 py-2 hover:bg-gray-50 cursor-pointer">High Potency</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
