"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { UserNav } from "@/components/UserNav";
import { Home, Shield, FileText } from "lucide-react";

export function Header() {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Home", icon: Home },
        { href: "/privacy", label: "Privacy", icon: Shield },
        { href: "/terms", label: "Terms", icon: FileText },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 pointer-events-none">
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

            <div className="absolute right-4 pointer-events-auto">
                <UserNav />
            </div>
        </header>
    );
}
