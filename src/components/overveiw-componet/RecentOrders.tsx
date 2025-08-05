"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const orders = [
  {
    id: "#1220",
    sales: "1220 Sales",
    amount: "$11,220",
    time: "2 min ago",
    status: "Completed",
    statusColor: "bg-[#C7FFD5] text-green-700",
    image: "/assets/images/pasta.jpg",
  },
  {
    id: "#4011",
    sales: "820 Sales",
    amount: "$11,220",
    time: "2 min ago",
    status: "Processing",
    statusColor: "bg-[#C7F5FF] text-blue-700",
    image: "/assets/images/pasta.jpg",
  },
  {
    id: "#5011",
    sales: "600 Sales",
    amount: "$11,220",
    time: "2 min ago",
    status: "Shipped",
    statusColor: "bg-[#C8D3FF] text-purple-700",
    image: "/assets/images/pasta.jpg",
  },
  {
    id: "#3011",
    sales: "400 Sales",
    amount: "$11,220",
    time: "2 min ago",
    status: "Pending",
    statusColor: "bg-[#FFC7C7] text-orange-700",
    image: "/assets/images/pasta.jpg",
  },
  {
    id: "#2011",
    sales: "200 Sales",
    amount: "$11,220",
    time: "2 min ago",
    status: "Completed",
    statusColor: "bg-[#C7FFD5] text-green-700",
    image: "/assets/images/pasta.jpg",
  },
];

export function RecentOrders() {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-[#D1C6EC] px-4 py-6 rounded-[8px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-[#6B46C1] pb-2">
            <span className="text-xl text-[#6B46C1] font=semibold">
              Order Details
            </span>
            <Button variant="link" className="text-purple-600 p-0">
              View All
            </Button>
          </div>
          {orders.map((order, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[#E9E3F6] rounded-[8px]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Image
                    src={order.image || "/placeholder.svg"}
                    alt={`Order ${order.id}`}
                    width={100}
                    height={100}
                    className="w-[40px] h-[40px] rounded-[8px]"
                  />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{order.id}</p>
                  <p className="text-sm text-gray-500">{order.sales}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.amount}</p>
                  <p className="text-sm text-gray-500">{order.time}</p>
                </div>
                <Badge
                  className={`${order.statusColor} border-0 w-[80px] !h-[24px] text-center items-center`}
                >
                  {order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
