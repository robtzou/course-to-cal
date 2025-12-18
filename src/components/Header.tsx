"use client";
import { useEffect, useState } from "react";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/UserNav";
import { Home, Shield, FileText } from "lucide-react";

export function Header() {
    const pathname = usePathname();
    const [time, setTime] = useState("");

    useEffect(() => {
        // Initial set
        const updateTime = () => {
            setTime(new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            }));
        };
        updateTime();

        // Update every minute (no need for second precision for basic check)
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const links = [
        { href: "/", label: "Home", icon: Home },
        { href: "/privacy", label: "Privacy", icon: Shield },
        { href: "/terms", label: "Terms", icon: FileText },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 pointer-events-none h-20">
            <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/50 to-transparent -z-10" />
            <div className="absolute left-4 pointer-events-auto flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="relative h-8 w-8">
                        <Image
                            src="/favicon.svg"
                            alt="Course2Cal Logo"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-bold text-lg tracking-tight hidden md:block">Course2Cal</span>
                </Link>
            </div>

            <nav className="flex items-center gap-1 p-1 rounded-full bg-white/30 backdrop-blur-xl border border-white/10 shadow-lg pointer-events-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                                isActive
                                    ? "bg-white-500/10 text-white-400 shadow-sm shadow-white-500/20"
                                    : "text-muted-foreground hover:text-white hover:bg-white/10"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute right-4 pointer-events-auto flex items-center gap-4">
                {time && (
                    <div className="hidden md:block px-3 py-1.5 rounded-full bg-black/20 text-xs font-mono text-white/50 border border-white/5 backdrop-blur-md">
                        {time}
                    </div>
                )}
                <UserNav />
            </div>
        </header>
    );
}
