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

export default async function CashierPage() {
  const user = await getUserFromToken()
  if (!user) {
    redirect("/login")
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/cashier">
                    Cashier
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>POS</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
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
            POS Interface — Coming Soon
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
