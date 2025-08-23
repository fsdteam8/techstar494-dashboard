
// import { Button } from "@/components/ui/button"
// import { Filter } from "lucide-react"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { DashboardStats } from "@/components/overveiw-componet/DashboardStats"
import { SalesChart } from "@/components/overveiw-componet/SalesChart"
import { SalesCategory } from "@/components/overveiw-componet/SalesCategory"
import { TopProducts } from "@/components/overveiw-componet/TopProducts"
import { RecentOrders } from "@/components/overveiw-componet/RecentOrders"
import { QuickActions } from "@/components/overveiw-componet/QuickActions"

export default function Dashboard() {
  return (
    <SidebarProvider>
    
      <SidebarInset>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-white  px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-[32px] font-semibold text-[#6B46C1]">Dashboard</h1>
                <p className="text-base text-[#6B46C1] font-normal mt-1">Welcome back to your admin panel!</p>
              </div>
              {/* <Button variant={"outline"} className="flex text-sm text-[#000000] font-medium items-center border border-[#6B46C1] h-[48px] rounded-[8px] w-[136px] gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filters
              </Button> */}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 space-y-6">
            {/* Stats Cards */}
            <DashboardStats/>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <SalesChart/>
              </div>
            </div>

            <div className="">
              <SalesCategory />
            </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <TopProducts/>
                  <RecentOrders/>
                </div>
              </div>

            {/* Quick Actions */}
            <QuickActions />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
