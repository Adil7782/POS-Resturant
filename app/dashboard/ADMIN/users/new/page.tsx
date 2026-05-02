import { redirect } from "next/navigation";

// "Add User" sidebar link redirects to the users list where the dialog lives
export default function NewUserPage() {
  redirect("/dashboard/ADMIN/users");
}
