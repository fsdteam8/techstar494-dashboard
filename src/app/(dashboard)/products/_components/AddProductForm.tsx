


"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, PlusIcon, SaveIcon, UploadCloudIcon, X, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify"
import Image from "next/image"


interface AddProductFormProps {
  onSave: () => void
  onCancel: () => void
}

interface PriceEntry {
  id: string
  unit: string
  unitValue: string
  price: string
}

interface Category {
  id: string
  categoryName: string
  image: string
  createdAt: string
  updatedAt: string
}

const experiences = [
  "Relaxing",
  "Energizing",
  "Creative",
  "Social",
  "Sleep",
  "Focus",
  "Happy"
]

const dosageOptions = [
  "Low Potency",
  "Medium Potency",
  "High Potency"
]

export default function AddProductForm({ onSave }: AddProductFormProps) {

  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    description: "",
    disclaimers: "",
    benefits: [""],
  })
  const [expirationDate, setExpirationDate] = useState<Date | undefined>(undefined)
  const [coaFiles, setCoaFiles] = useState<File[]>([])
  const [productImages, setProductImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [priceEntries, setPriceEntries] = useState<PriceEntry[]>([])
  const [restrictedStates, setRestrictedStates] = useState<string[]>([""])
  const [currentUnit, setCurrentUnit] = useState("ct")
  const [currentUnitValue, setCurrentUnitValue] = useState("")
  const [currentPrice, setCurrentPrice] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("")
  const [selectedExperience, setSelectedExperience] = useState<string>("")
  const [selectedDosage, setSelectedDosage] = useState<string>("")

  const coaFileInputRef = useRef<HTMLInputElement>(null)
  const imageFileInputRef = useRef<HTMLInputElement>(null)
  const session = useSession()
  const token = (session?.data?.user as { accessToken: string })?.accessToken

  // Fetch categories using TanStack Query
  const { data: categories, isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token available")
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        return data.data
      }
      throw new Error(data.message || "Failed to fetch categories")
    },
    enabled: !!token, // Only run query if token is available
  })

  // Mutation for creating product
  const createProductMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
      if (!response.ok) {
        throw new Error("Failed to create product")
      }
      return response.json()
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast(data?.message || "Product created successfully");
        onSave()
        return;
      }

    },
    onError: () => {
      toast.error("Failed to create product");
    },
  })

  // Handle COA file selection
  const handleCoaFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setCoaFiles(Array.from(event.target.files))
    }
  }

  // Handle product image selection
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files)
      setProductImages((prev) => [...prev, ...newFiles])
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
      setImagePreviews((prev) => [...prev, ...newPreviews])
    }
  }

  // Remove a product image
  const removeImage = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => {
      const url = prev[index]
      URL.revokeObjectURL(url)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleBenefitChange = (index: number, value: string) => {
    const newBenefits = [...formData.benefits]
    newBenefits[index] = value
    setFormData(prev => ({ ...prev, benefits: newBenefits }))
  }

  const addBenefit = () => {
    setFormData(prev => ({ ...prev, benefits: [...prev.benefits, ""] }))
  }

  const removeBenefit = (index: number) => {
    if (formData.benefits.length > 1) {
      const newBenefits = formData.benefits.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, benefits: newBenefits }))
    }
  }

  const handleSetPrice = () => {
    if (currentUnitValue && currentPrice) {
      const newEntry: PriceEntry = {
        id: Date.now().toString(),
        unit: currentUnit,
        unitValue: currentUnitValue,
        price: currentPrice,
      }
      setPriceEntries((prev) => [...prev, newEntry])
      setCurrentUnitValue("")
      setCurrentPrice("")
    }
  }

  const removePriceEntry = (id: string) => {
    setPriceEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  const addRestrictedState = () => {
    setRestrictedStates((prev) => [...prev, ""])
  }

  const updateRestrictedState = (index: number, value: string) => {
    setRestrictedStates((prev) => prev.map((state, i) => (i === index ? value : state)))
  }

  const removeRestrictedState = (index: number) => {
    if (restrictedStates.length > 1) {
      setRestrictedStates((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const triggerFileInput = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click()
  }

  const handleSubmit = async () => {
    const formDataToSend = new FormData()

    // Append basic fields
    formDataToSend.append("name", formData.name)
    formDataToSend.append("batch", formData.batch)
    formDataToSend.append("description", formData.description)
    formDataToSend.append("disclaimers", formData.disclaimers)

    // Append arrays
    formData.benefits.forEach(benefit => formDataToSend.append("benefits", benefit))
    restrictedStates.forEach(state => formDataToSend.append("restrictedStates", state))
    priceEntries.forEach(entry => {
      formDataToSend.append("prices", JSON.stringify(entry))
    })

    // Append files
    productImages.forEach(image => formDataToSend.append("photo", image))
    coaFiles.forEach(coa => formDataToSend.append("coas", coa))

    // Append other fields
    if (selectedCategoryId) formDataToSend.append("category", selectedCategoryId)
    if (selectedExperience) formDataToSend.append("experiences", selectedExperience)
    if (selectedDosage) formDataToSend.append("dosage", selectedDosage)
    if (expirationDate) formDataToSend.append("expirationDate", expirationDate.toISOString())

    try {
      await createProductMutation.mutateAsync(formDataToSend)
    } catch (error) {
      console.error("Error creating product:", error)
    }
  }

  return (
    <div className="flex flex-col gap-6 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Add Product</h1>
          <p className="text-sm text-muted-foreground">Add New Product</p>
        </div>
        <Button
          className="bg-[#6B46C1] hover:bg-[#5A3A9F] text-white"
          onClick={handleSubmit}
          disabled={createProductMutation.isPending}
        >
          {createProductMutation.isPending ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : (
            <>
              <SaveIcon className="w-4 h-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6 shadow-[0_0_10px_2px_#1018281A] rounded-[8px]">
          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-xl text-[#1A1C21] font-semibold">General Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div>
                <label htmlFor="name" className="block text-base font-medium text-[#272727] mb-1">
                  Product Name
                </label>
                <Input
                  id="name"
                  placeholder="Type product name here"
                  className="h-[40px] border border-[#707070] rounded-[8px]"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="batch" className="block text-base font-medium text-[#272727] mb-1">
                  Batch
                </label>
                <Input
                  id="batch"
                  placeholder="Type batch number here"
                  className="h-[40px] border border-[#707070] rounded-[8px]"
                  value={formData.batch}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-base font-medium text-[#272727] mb-1">
                  Description
                </label>
                <Textarea
                  id="description"
                  placeholder="Type product description here."
                  rows={6}
                  className="border border-[#707070] rounded-[8px]"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label htmlFor="disclaimers" className="block text-base font-medium text-[#272727] mb-1">
                  Disclaimers and Disclosures
                </label>
                <Textarea
                  id="disclaimers"
                  placeholder="Type disclaimers and disclosures here."
                  rows={6}
                  className="border border-[#707070] rounded-[8px]"
                  value={formData.disclaimers}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder={`Benefits ${index + 1}`}
                    value={benefit}
                    onChange={(e) => handleBenefitChange(index, e.target.value)}
                    className="h-[40px] border border-[#707070] rounded-[8px]"
                  />
                  {index === formData.benefits.length - 1 ? (
                    <Button variant="outline" size="icon" onClick={addBenefit}>
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeBenefit(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Set Prices</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between gap-2">
                <Select value={currentUnit} onValueChange={setCurrentUnit}>
                  <SelectTrigger className="!w-[100px] !h-[51px] !bg-white rounded-[4px] border border-gray-200 focus:ring-2">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent className="!w-[100px] !bg-white rounded-[4px] border border-gray-200 shadow-sm z-50">
                    <SelectItem value="ct">ct</SelectItem>
                    <SelectItem value="g">g</SelectItem>
                    <SelectItem value="mg">mg</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-x-2">
                  <label htmlFor="unit" className="block text-base font-medium text-[#272727] mb-1">
                    Unit
                  </label>
                  <Input
                    id="unit"
                    placeholder="0"
                    value={currentUnitValue}
                    onChange={(e) => setCurrentUnitValue(e.target.value)}
                    className="!w-[100px] !h-[51px] !bg-white rounded-[4px]"
                  />
                </div>
                <div className="flex items-center gap-x-2">
                  <label htmlFor="price" className="block text-base font-medium text-[#272727] mb-1">
                    Price
                  </label>
                  <Input
                    id="price"
                    placeholder="$0"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(e.target.value)}
                    className="!w-[100px] !h-[51px] !bg-white rounded-[4px]"
                  />
                </div>
                <Button
                  onClick={handleSetPrice}
                  className="bg-[#6B46C1] text-white h-[51px] rounded-[8px] px-[32px] hover:bg-[#6B46C1]/85"
                >
                  Set
                </Button>
              </div>

              {priceEntries.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium text-[#272727]">Price Entries:</h4>
                  <div className="flex items-center gap-2">
                    {priceEntries.map((entry) => (
                      <div key={entry.id} className="border border-gray-200 rounded-lg p-2 bg-gray-50">
                        <div
                          onClick={() => removePriceEntry(entry.id)}
                          className="text-red-600 flex justify-end rounded-[8px]"
                        >
                          <X className="w-3 h-3" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#272727]">
                            {entry.unitValue} {entry.unit} - ${entry.price}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-xl text-[#1A1C21] font-semibold">COAs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center gap-2">
                <UploadCloudIcon className="w-10 h-10 text-gray-400" />
                <p className="text-sm text-gray-500">Drag and drop your file here, or click to upload</p>
                <input
                  type="file"
                  ref={coaFileInputRef}
                  onChange={handleCoaFileChange}
                  multiple
                  accept="image/*,application/pdf"
                  className="hidden"
                />
                <Button
                  className="bg-[#6B46C1] hover:bg-[#5A3A9F] text-white"
                  onClick={() => triggerFileInput(coaFileInputRef)}
                >
                  Add File
                </Button>
                {coaFiles.length > 0 && (
                  <div className="mt-4 text-sm text-gray-600">
                    <p>Selected files:</p>
                    <ul className="list-disc list-inside">
                      {coaFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Restricted States</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {restrictedStates.map((state, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder={`State ${index + 1}`}
                      value={state}
                      onChange={(e) => updateRestrictedState(index, e.target.value)}
                      className="h-[40px] border border-[#707070] rounded-[8px]"
                    />
                    {index === restrictedStates.length - 1 ? (
                      <Button variant="outline" size="icon" onClick={addRestrictedState}>
                        <PlusIcon className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => removeRestrictedState(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
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
                <PopoverContent className="w-auto p-0 bg-white z-50">
                  <Calendar mode="single" selected={expirationDate} onSelect={setExpirationDate} initialFocus />
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center gap-2">
                <UploadCloudIcon className="w-10 h-10 text-gray-400" />
                <p className="text-sm text-gray-500">Drag and drop image here, or click add image</p>
                <input
                  type="file"
                  ref={imageFileInputRef}
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  className="bg-[#6B46C1] hover:bg-[#5A3A9F] text-white"
                  onClick={() => triggerFileInput(imageFileInputRef)}
                >
                  Add Image
                </Button>
              </div>
              {imagePreviews.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <Image
                        src={preview || "/placeholder.svg"}
                        width={100}
                        height={100}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Select Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                <SelectTrigger className="w-full bg-[#6B46C1] text-base font-semibold text-[#FFFFFF] h-[40px] border border-[#707070] rounded-[8px]">
                  <SelectValue placeholder={isCategoriesLoading ? "Loading..." : "Select a category"} />
                </SelectTrigger>
                <SelectContent className="bg-white border rounded-[8px] shadow-sm z-50">
                  {isCategoriesLoading ? (
                    <div className="px-4 py-2">Loading categories...</div>
                  ) : categories && categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.id} className="border-b">
                        {category.categoryName}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-4 py-2">No categories available</div>
                  )}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                <SelectTrigger className="w-full bg-[#6B46C1] text-base font-semibold text-[#FFFFFF] h-[40px] border border-[#707070] rounded-[8px]">
                  <SelectValue placeholder="Select an experience" />
                </SelectTrigger>
                <SelectContent className="bg-white border rounded-[8px] shadow-sm z-50">
                  {experiences.map((experience) => (
                    <SelectItem key={experience} value={experience} className="border-b">
                      {experience}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none">
            <CardHeader>
              <CardTitle>Dosage</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedDosage} onValueChange={setSelectedDosage}>
                <SelectTrigger className="w-full bg-[#6B46C1] text-base font-semibold text-[#FFFFFF] h-[40px] border border-[#707070] rounded-[8px]">
                  <SelectValue placeholder="Select a dosage" />
                </SelectTrigger>
                <SelectContent className="bg-white border rounded-[8px] shadow-sm z-50">
                  {dosageOptions.map((dosage) => (
                    <SelectItem key={dosage} value={dosage} className="border-b">
                      {dosage}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}