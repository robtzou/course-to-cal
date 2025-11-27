"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { LogOut, User } from "lucide-react";
import Image from "next/image";

export function UserNav() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div className="h-10 w-10 animate-pulse rounded-full bg-white/10" />;
    }

    if (session?.user) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    {session.user.image ? (
                        <Image
                            src={session.user.image}
                            alt={session.user.name || "User"}
                            width={32}
                            height={32}
                            className="rounded-full ring-2 ring-white/10"
                        />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                            <User className="h-4 w-4" />
                        </div>
                    )}
                    <span className="text-sm font-medium hidden md:block">
                        {session.user.name}
                    </span>
                </div>
                <button
                    onClick={() => signOut()}
                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-white"
                    title="Sign out"
                >
                    <LogOut className="h-5 w-5" />
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => signIn("google")}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium text-white flex items-center gap-2"
        >
            <User className="h-4 w-4" />
            Sign In
        </button>
    );
}
