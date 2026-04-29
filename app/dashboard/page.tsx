import { getUserFromToken } from "@/lib/getuser"
import { redirect } from "next/navigation"

export default async function DashboardRootPage() {
  const user = await getUserFromToken()
  // console.log("uuuuuuuuuser", user)
  if (!user) {
    redirect("/login")
  }

  // Redirect to role-specific dashboard
  if (user.role === "ADMIN") {
    redirect("/dashboard/ADMIN")
  } else {
    redirect("/dashboard/cashier")
  }
}
