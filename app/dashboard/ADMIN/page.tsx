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
import { redirect } from "next/navigation"
import { getUserFromToken } from "@/lib/getuser"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import prisma from '@/lib/prisma';
import DashboardOverview from "@/components/dashboard-overview"

export default async function DashboardPage() {
  const user = await getUserFromToken();

  if (!user) redirect('/login');
  if (user.role !== 'ADMIN') redirect('/dashboard/cashier/pos');

  try {
    // 1. Parallel execution with optimized specific queries
    const [
      productCount,
      inventoryData,
      recentTransactions,
      activeAlerts
    ] = await Promise.all([
      // Only get the count, not the full objects
      prisma.product.count(),

      // Get inventory with specific fields
      prisma.inventory.findMany({
        select: {
          id: true,
          quantityOnHand: true,
          reorderLevel: true,
          productId: true,
          product: {
            select: { name: true }
          }
        }
      }),

      // Limit transactions to the most recent 10 and sort by date
      prisma.transaction.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          transactionId: true,
          total: true,
          paymentMethod: true,
          createdAt: true,
          status: true
        }
      }),

      // Only fetch 'active' alerts
      prisma.stockAlert.findMany({
        where: { status: 'active' },
        include: {
          product: { select: { name: true } }
        }
      })
    ]);

    // 2. Clean mapping (only if DashboardOverview strictly needs these specific shapes)
    const inventory = inventoryData.map(item => ({
      ...item,
      name: item.product.name,
    }));

    const alerts = activeAlerts.map(alert => ({
      ...alert,
      name: alert.product.name,
    }));

    return (
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user.name}!</p>
        </div>

        <DashboardOverview
          productCount={productCount} // Pass the count instead of full array
          inventory={inventory}
          transactions={recentTransactions}
          alerts={alerts}
        />
      </div>
    );
  } catch (error) {
    // ... error UI
  }
}
