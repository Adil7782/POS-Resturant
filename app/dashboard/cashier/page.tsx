import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getUserFromToken } from "@/lib/getuser"
import { redirect } from "next/navigation"
import { useContext } from "react"
import { createContext } from "vm"

export default async function CashierPage() {
  const user = await getUserFromToken()
  if (!user) {
    redirect("/login")
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
            Active Orders
          </div>
          <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
            Today&apos;s Sales
          </div>
          <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
            Tables
          </div>
        </div>
        <div className="min-h-[60vh] flex-1 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
          <p className="font-bold text-2xl">
            Welcome {user.name}
          </p>
        </div>
      </div>
    </>
  )
}
