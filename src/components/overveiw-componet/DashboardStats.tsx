'use client'
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useQuery } from '@tanstack/react-query'

interface DashboardSummary {
  success: boolean;
  data: {
    totalRevenue: number;
    totalOrders: number;
    activeUsers: number;
    totalUsers: number;
    conversionRate: number;
    buyers: number;
  };
}

interface StatCard {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  iconColor: string;
  border: string;
}

export function DashboardStats() {
  const { data, isLoading, error } = useQuery<DashboardSummary>({
    queryKey: ['dashboard-summary'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/summary`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  const stats: StatCard[] = [
    {
      title: "Total Revenue",
      value: `$${data?.data.totalRevenue.toFixed(2) || '0'}`,
      icon: DollarSign,
      bgColor: "bg-[#E9E0FF]",
      iconColor: "bg-[#6B46C1] text-white",
      border: "border-[#6B46C1]"
    },
    {
      title: "Total Orders",
      value: `${data?.data.totalOrders || '0'}`,
      icon: ShoppingCart,
      bgColor: "bg-[#DAF3FA]",
      iconColor: "bg-[#31AFD2] text-white",
      border: "border-[#31AFD2]"
    },
    {
      title: "Active Users",
      value: `${data?.data.activeUsers || '0'}`,
      icon: Users,
      bgColor: "bg-[#FEE6FF]",
      iconColor: "bg-[#C369C8] text-white",
      border: "border-[#C369C8]"
    },
    {
      title: "Conversion Rate",
      value: `${data?.data.conversionRate.toFixed(2) || '0'}%`,
      icon: TrendingUp,
      bgColor: "bg-[#D5F4D8]",
      iconColor: "bg-[#20B12A] text-white",
      border: "border-[#20B12A]"
    },
  ];

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {isLoading
        ? stats.map((stat, index) => (
            <Card key={index} className={`${stat.bgColor} border-0 border-b-[4px] ${stat.border}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-8 w-24 bg-gray-300 animate-pulse rounded" />
                    <div className="h-4 w-32 bg-gray-200 animate-pulse rounded" />
                  </div>
                  <div className={`p-3 rounded-full ${stat.iconColor}`}>
                    <div className="h-6 w-6 bg-gray-300 animate-pulse rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        : stats.map((stat, index) => (
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
  );
}