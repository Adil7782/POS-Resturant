"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import axios from "axios"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  GalleryVerticalEndIcon,
  LayoutDashboardIcon,
  ShoppingCartIcon,
  UtensilsIcon,
  UsersIcon,
  BarChart3Icon,
  ClipboardListIcon,
  UserCircleIcon,
  ReceiptIcon,
} from "lucide-react"

const adminNav = [
  {
    title: "Dashboard",
    url: "/dashboard/ADMIN",
    icon: <LayoutDashboardIcon />,
    isActive: true,
    items: [
      { title: "Overview", url: "/dashboard/ADMIN" },
    ],
  },
  {
    title: "Inventory",
    url: "#",
    icon: <ShoppingCartIcon />,
    items: [
      { title: "All Items", url: "/dashboard/ADMIN/inventory" },
      { title: "New Item", url: "/dashboard/ADMIN/inventory/new" },
    ],
  },
  {
    title: "Menu",
    url: "#",
    icon: <UtensilsIcon />,
    items: [
      { title: "Items", url: "/dashboard/ADMIN/menu" },
      { title: "Categories", url: "/dashboard/ADMIN/menu/categories" },
    ],
  },
  {
    title: "Users",
    url: "#",
    icon: <UsersIcon />,
    items: [
      { title: "All Users", url: "/dashboard/ADMIN/users" },
      { title: "Add User", url: "/dashboard/ADMIN/users/new" },
    ],
  },
  {
    title: "Reports",
    url: "#",
    icon: <BarChart3Icon />,
    items: [
      { title: "Sales", url: "/dashboard/ADMIN/reports/sales" },
      { title: "Daily Summary", url: "/dashboard/ADMIN/reports/daily" },
    ],
  },
]

const cashierNav = [
  {
    title: "Dashboard",
    url: "/dashboard/cashier/pos",
    icon: <ReceiptIcon />,
    isActive: true,
    items: [
      { title: "POS", url: "/dashboard/cashier/pos" },
    ],
  },
  {
    title: "Orders",
    url: "#",
    icon: <ClipboardListIcon />,
    items: [
      { title: "My Orders", url: "/dashboard/cashier/orders" },
      { title: "Order History", url: "/dashboard/cashier/orders/history" },
    ],
  },
  {
    title: "Profile",
    url: "#",
    icon: <UserCircleIcon />,
    items: [
      { title: "My Account", url: "/dashboard/cashier/profile" },
    ],
  },
]

const teams = [
  {
    name: "Restaurant POS",
    logo: <GalleryVerticalEndIcon />,
    plan: "Enterprise",
  },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: { name: string; email: string; role: string }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const navUser = {
    name: user.name || "",
    email: user.email || "",
    avatar: "/avatars/shadcn.jpg",
  }

  const navItems = user.role === "ADMIN" ? adminNav : cashierNav

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
