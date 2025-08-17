"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  Settings,
  Users,
  Square,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarInset,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { toast } from "react-toastify";
import { signOut } from "next-auth/react";
import LogoutModal from "../modal/LogoutModal";

const navigationItems = [
  { title: "Overview", icon: LayoutDashboard, href: "/", isActive: true },
  { title: "Products", icon: Boxes, href: "/products" },
  { title: "Orders", icon: ShoppingCart, href: "/orders" },
  { title: "Users", icon: Users, href: "/users" },
  { title: "Subscribers", icon: Users, href: "/subscribers" },
];

const settingsItems = [
  { title: "FAQ", href: "/documents/faq" },
  {
    title: "Privacy Policy",

    href: "/documents/privacy-policy",
  },
  {
    title: "Terms & Conditions",

    href: "/documents/terms-and-condition",
  },
  { title: "Legality", href: "/documents/legality" },
  { title: "Refund Policy", href: "/documents/refund-policy" },
  { title: "COAs", href: "/coas" },
  { title: "FDA Disclaimer", href: "/documents/fda-disclaimer" },
  { title: "Grand Purp Labs", href: "/documents/grand-purp-labs" },
  { title: "Set Promotion", href: "/documents/set-promotion" },
  { title: "Add Blog", href: "/documents/all-blogs" },
];

const navigationItems1 = [
  { title: "Coupon", icon: Square, href: "/coupon" },
  { title: "Settings", icon: Settings, href: "/settings" },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handLogout = async () => {
    try {
      toast.success("Logout successful!");
      await signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };
  const isDocumentsActive = settingsItems.some(
    (item) => pathname === item.href
  );

  return (
    <SidebarProvider className="px-0">
      <div className="flex min-h-screen w-full relative">
        <Sidebar className="bg-[#6B46C1]">
          <SidebarHeader className="border-b border-cyan-500/30 pb-4 ">
            <div className="flex justify-between items-center gap-3 px-3 py-2">
              <div className="flex h-10 w-[175px] items-center justify-center  bg-white text-cyan-600 font-bold text-sm">
                <Image
                  src="/assets/images/logo.png"
                  alt="logo"
                  width={100}
                  height={100}
                  className="w-full h-full rounded-[8px]"
                />
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="">
            <SidebarGroup className=" py-0">
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className="text-white hover:bg-white data-[active=true]:bg-white data-[active=true]:text-[#6B46C1] h-[48px] !w-full"
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-3"
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="text-base font-medium">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className=" py-0">
              <SidebarGroupContent>
                <SidebarMenu>
                  <Collapsible className="group/collapsible">
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={isDocumentsActive}
                          className="text-white hover:bg-white hover:text-[#6B46C1] data-[active=true]:bg-white data-[active=true]:text-[#6B46C1] h-[48px] !w-full"
                        >
                          <Settings className="h-4 w-4" />
                          <span className="text-[16px] font-medium">
                            Documents
                          </span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="">
                          {settingsItems.map((item) => (
                            <SidebarMenuSubItem key={item.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === item.href}
                                className="text-white hover:bg-white hover:text-[#6B46C1] data-[active=true]:bg-white data-[active=true]:text-[#6B46C1] h-[35px] !w-full"
                              >
                                <Link
                                  href={item.href}
                                  className="flex items-center gap-3"
                                >
                                  <span className="text-base font-medium">
                                    {item.title}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className=" py-0">
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigationItems1.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        className="text-white hover:bg-white data-[active=true]:bg-white data-[active=true]:text-[#6B46C1] h-[48px] !w-full"
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-3"
                        >
                          <item.icon className="h-4 w-4" />
                          <span className="text-base font-medium">
                            {item.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-cyan-500/30 pt-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setLogoutModalOpen(true)}
                  className="text-white hover:bg-cyan-500/30"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <SidebarInset className="flex-1  ">
          <div className="bg-[#6B46C1] text-white py-4 flex justify-end items-center px-6 sticky top-0 z-50 ">
            <div className="flex items-center gap-2">
              <span className="text-sm">User 12</span>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-white text-cyan-500">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <main className="flex-1 p-6">{children}</main>
        </SidebarInset>

        {logoutModalOpen && (
          <LogoutModal
            isOpen={logoutModalOpen}
            onClose={() => setLogoutModalOpen(false)}
            onConfirm={handLogout}
          />
        )}
      </div>
    </SidebarProvider>
  );
}
