import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Image from "next/image"

const products = [
  {
    name: "Gummies",
    sales: "1220 Sales",
    revenue: "$11,220",
    image: "/assets/images/pasta.jpg",
    color: "bg-red-100",
  },
  {
    name: "Prerolls",
    sales: "820 Sales",
    revenue: "$2002",
      image: "/assets/images/pasta.jpg",
    color: "bg-orange-100",
  },
  {
    name: "Edibles",
    sales: "800 Sales",
    revenue: "$800",
       image: "/assets/images/pasta.jpg",
    color: "bg-green-100",
  },
  {
    name: "Flower",
    sales: "400 Sales",
    revenue: "$500",
        image: "/assets/images/pasta.jpg",
    color: "bg-yellow-100",
  },
  {
    name: "Beverage",
    sales: "200 Sales",
    revenue: "$400",
    image: "/assets/images/pasta.jpg",
    color: "bg-blue-100",
  },
]

export function TopProducts() {
  return (
    <Card className=" border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Top Products</CardTitle>
      
      </CardHeader>
      <CardContent className="bg-[#D1C6EC] px-4 py-6 rounded-[8px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between  pb-2">
            <span className="text-xl text-[#6B46C1] font=semibold">Product Name</span>
              <Button variant="link" className="text-purple-600 p-0">
          View All
        </Button>
          </div>
          {products.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-[#E9E3F6] rounded-[8px]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${product.color} flex items-center justify-center`}>
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} width={100} height={100} className="w-[40px] h-[40px] rounded-[8px]" />
                </div>
                <div>
                  <p className="font-medium text-[#595959] text-base">{product.name}</p>
                  <p className="text-sm text-[#595959] ">{product.sales}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{product.revenue}</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
