import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { getUserFromToken } from "@/lib/getuser";
import { Toaster } from "sonner";

export default async function Layout({ children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const user = await getUserFromToken();
    // console.log("uuuuuuuuuser", user)
    // if (!user) redirect("/login");

    return (
        <div>
            {children}
            <Toaster />
        </div>
    );
}