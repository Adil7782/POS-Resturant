import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface RootHeaderProps {
    isLoggedIn: boolean;
}

const RootHeader = ({
    isLoggedIn
}: RootHeaderProps) => {
    return (
        <nav className="pt-8">
            <div className="max-h-20 flex justify-between items-center pl-6 pr-5 py-1 bg-white/80 rounded-full border">
                <Image
                    src="/eliot-logo.png"
                    alt="logo"
                    width={180}
                    height={180}
                    className="w-[120px] ml-2 cursor-pointer"
                />
                {isLoggedIn ? (
                    <Link href="/dashboard">
                        <Button variant="secondary" className="rounded-full border hover:border-slate-400 px-6">
                            Dashboard
                        </Button>
                    </Link>
                ) : (
                    <Link href="/login">
                        <Button className="px-6 rounded-full bg-slate-500">
                            Sign in
                        </Button>
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default RootHeader