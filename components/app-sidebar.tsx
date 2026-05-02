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
  ForkKnifeCrossedIcon,
} from "lucide-react"

const adminNav = [
  {
    title: "Dashboard",
    url: "/dashboard/ADMIN",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "Inventory",
    url: "/dashboard/ADMIN/inventory",
    icon: <ShoppingCartIcon />,

  },
  {
    title: "Products",
    url: "/dashboard/ADMIN/products",
    icon: <UtensilsIcon />,
  },
  {
    title: "Users",
    url: "/dashboard/ADMIN/users",
    icon: <UsersIcon />,

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
    title: "POS",
    url: "/dashboard/cashier/pos",
    icon: <ReceiptIcon />,
  },
  {
    title: "Profile",
    url: "/dashboard/cashier/profile",
    icon: <UserCircleIcon />,
  },
]

const teams = [
  {
    name: "Ganeesha Family ",
    logo: <ForkKnifeCrossedIcon />,
    plan: "Restaurant",
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
