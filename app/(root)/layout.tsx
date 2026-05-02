import AuthFooter from "@/app/(root)/_components/auth-footer";
import RootHeader from "@/app/(root)/_components/root-header";
import { getUserFromToken } from "@/lib/getuser";

const RootLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    const user = await getUserFromToken();

    let email: string = '';
    let isLoggedIn: boolean = false;

    if (user) {
        isLoggedIn = true;
        email = user.email;
    }

    return (
        <section className="min-h-screen w-full bg-slate-100">
            <div className="mx-auto max-w-7xl px-4">
                <RootHeader isLoggedIn={isLoggedIn} />
                {children}
                <AuthFooter page="root" />
            </div>
        </section>
    )
}

export default RootLayout;