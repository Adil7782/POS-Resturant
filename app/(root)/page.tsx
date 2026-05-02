import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/lib/getuser";

const RootPage = async () => {
    const user = await getUserFromToken();

    let email: string = '';
    if (user) {
        email = user.email;
    }

    return (
        <div className="h-[calc(100vh-200px)] flex justify-center items-center">
            <div>
                {email ?
                    <p>You logged email address: <span className="text-slate-600 italic underline hover:text-blue-600 cursor-pointer">{email}</span></p>
                    :
                    <p>You are not logged in yet, please login the account and continue to dashboard!</p>
                }
            </div>
        </div>
    )
}

export default RootPage