export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/getuser";
import { UsersTable } from "./_components/users-table";
import { AddUserDialog } from "./_components/add-user-dialog";

export const metadata = {
  title: "Users - Admin",
};

export default async function UsersPage() {
  const currentUser = await getUserFromToken();

  if (!currentUser || currentUser.role !== "ADMIN") {
    redirect("/login");
  }

  const raw = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const users = raw.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }));

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center bg-background top-0 sticky py-2 z-10">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-2">Manage system users and their roles</p>
        </div>
        <AddUserDialog />
      </div>
      <UsersTable users={users} currentUserId={currentUser.id} />
    </div>
  );
}
