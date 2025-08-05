import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    title: "Total Revenue",
    value: "$11,020",
    icon: DollarSign,
    bgColor: "bg-[#E9E0FF]",
    iconColor: "bg-[#6B46C1] text-white",
      border:"border-[#6B46C1]"
  },
  {
    title: "Total Orders",
    value: "1,020",
    icon: ShoppingCart,
    bgColor: "bg-[#DAF3FA]",
    iconColor: "bg-[#31AFD2] text-white",
      border:"border-[#31AFD2]"
  },
  {
    title: "Active Users",
    value: "220",
    icon: Users,
    bgColor: "bg-[#FEE6FF]",
    iconColor: "bg-[#C369C8] text-white",
      border:"border-[#C369C8]"
  },
  {
    title: "Conversion Rate",
    value: "30%",
    icon: TrendingUp,
    bgColor: "bg-[#D5F4D8]",
    iconColor: "bg-[#20B12A] text-white",
    border:"border-[#20B12A]"
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className={`${stat.bgColor} border-0 border-b-[4px] ${stat.border}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[24px] font-bold text-[#1F2937]">{stat.value}</p>
                <p className="text-base text-[#6B7280] mt-1">{stat.title}</p>
              </div>
              <div className={`p-3 rounded-full ${stat.iconColor}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}