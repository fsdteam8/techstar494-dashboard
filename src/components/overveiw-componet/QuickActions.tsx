import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, UserPlus, Settings } from "lucide-react"

const actions = [
  {
    title: "Add Products",
    icon: Plus,
    color: "bg-[#CAE1FF] text-[#2965B2] ",
  },
  {
    title: "Manage Users",
    icon: Users,

       color: "bg-[#C4EED1] text-[#19843A]",
  },
  {
    title: "Users List",
    icon: UserPlus,
       color: "bg-[#ECE0F8] text-[#6929A8]",
  },
  {
    title: "Settings",
    icon: Settings,
    color: "bg-[#F4E4D0] text-[#AF6609]",
  },
]

export function QuickActions() {
  return (
    <Card className="border-none shadow-none p-0">
      <CardHeader>
        <CardTitle className="text-[#6B46C1] text-[32px] font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <div
              key={index}

              className={`py-[16px] pl-4 items-center rounded-[8px] flex gap-2 cursor-pointer ${action.color}`}
            >
              <action.icon className="h-5 w-5" />
              <span className="text-[18px] font-medium">{action.title}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
