import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, UserPlus, Settings } from "lucide-react"
import Link from "next/link"

interface ActionItem {
  title: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  route: string
}

export function QuickActions() {
  const actions: ActionItem[] = [
    {
      title: "Add Products",
      icon: Plus,
      color: "bg-[#CAE1FF] text-[#2965B2] hover:bg-[#B5D4FF]",
      route: "/products"
    },
    {
      title: "Manage Users",
      icon: Users,
      color: "bg-[#C4EED1] text-[#19843A] hover:bg-[#B0E5C0]",
      route: "/users"
    },
    {
      title: "Users List",
      icon: UserPlus,
      color: "bg-[#ECE0F8] text-[#6929A8] hover:bg-[#E0D0F5]",
      route: "/users"
    },
    {
      title: "Settings",
      icon: Settings,
      color: "bg-[#F4E4D0] text-[#AF6609] hover:bg-[#EED9BC]",
      route: "/settings"
    },
  ]

  return (
    <Card className="border-none shadow-none p-0">
      <CardHeader>
        <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.route}
              className={`py-[16px] pl-4 items-center rounded-[8px] flex gap-2 transition-colors ${action.color}`}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-[18px] font-medium">{action.title}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}