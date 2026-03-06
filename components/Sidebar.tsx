"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Rocket, Search, MapPin, BarChart3, Settings, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { YallaLogo } from "@/components/Logo";
import { useTranslations } from "next-intl";
import { useAuth } from "@/components/providers/AuthProvider";

export const sidebarLinks = [
    { titleKey: "dashboard" as const, href: "/dashboard", icon: LayoutDashboard },
    { titleKey: "campaigns" as const, href: "/requests", icon: Rocket },
    { titleKey: "discover" as const, href: "/campaign", icon: Search },
    { titleKey: "studios" as const, href: "/studio", icon: MapPin },
    { titleKey: "mySummary" as const, href: "/analytics", icon: BarChart3 },
    { titleKey: "settings" as const, href: "/settings", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { signOut, user } = useAuth();
    const isAdmin = user?.user_metadata?.role === "admin";
    const t = useTranslations("Nav");
    const tc = useTranslations("Common");

    return (
        <div className="hidden md:flex h-[calc(100vh-1.5rem)] w-16 flex-col py-5 fixed top-3 left-3 z-[60] overflow-visible items-center">

            {/* Logo */}
            <div className="mb-6 flex items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60">
                    <YallaLogo className="h-6 w-6" />
                </div>
            </div>

            {/* Nav */}
            <nav className="flex flex-1 flex-col gap-1 items-center w-full px-3">
                {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                        pathname === link.href ||
                        (link.href !== "/dashboard" && pathname.startsWith(link.href));

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "group/item relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200",
                                isActive
                                    ? "bg-[hsl(var(--primary))] shadow-[0_6px_20px_-4px_hsl(var(--primary)/0.6)]"
                                    : "text-foreground/35 hover:bg-white/30 hover:text-foreground/70"
                            )}
                        >
                            <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-current")} />

                            {/* Tooltip */}
                            <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-foreground px-3 py-1.5 text-xs font-semibold text-background opacity-0 shadow-lg transition-opacity duration-150 group-hover/item:opacity-100 z-[70]">
                                {t(link.titleKey)}
                                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom actions */}
            <div className="flex flex-col items-center gap-1 px-3 pt-3 w-full border-t border-white/20">
                {isAdmin && (
                    <Link
                        href="/admin"
                        className="group/item relative flex items-center justify-center w-10 h-10 rounded-full text-primary hover:bg-primary/10 transition-all duration-200"
                    >
                        <ShieldCheck className="h-5 w-5 shrink-0" />
                        <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-foreground px-3 py-1.5 text-xs font-semibold text-background opacity-0 shadow-lg transition-opacity duration-150 group-hover/item:opacity-100 z-[70]">
                            {tc("adminDashboard")}
                            <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
                        </span>
                    </Link>
                )}

                <button
                    onClick={() => signOut()}
                    className="group/item relative flex items-center justify-center w-10 h-10 rounded-full text-foreground/35 hover:bg-white/30 hover:text-destructive transition-all duration-200"
                >
                    <LogOut className="h-5 w-5 shrink-0" />
                    <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-foreground px-3 py-1.5 text-xs font-semibold text-background opacity-0 shadow-lg transition-opacity duration-150 group-hover/item:opacity-100 z-[70]">
                        {tc("logOut")}
                        <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
                    </span>
                </button>
            </div>
        </div>
    );
}
