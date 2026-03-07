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
        <div className="hidden md:flex h-screen w-56 flex-col fixed top-0 left-0 z-[70] bg-card shadow-[2px_0_20px_-4px_rgba(0,0,0,0.35)]">

            {/* Logo */}
            <div className="flex items-center gap-3 px-5 h-[72px] shrink-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20">
                    <YallaLogo className="h-5 w-5 text-primary" />
                </div>
                <span className="text-base font-black tracking-tight text-foreground">YallaViral</span>
            </div>

            {/* Nav */}
            <nav className="flex flex-1 flex-col gap-0.5 p-3 pt-4 overflow-y-auto">
                {sidebarLinks.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                        pathname === link.href ||
                        (link.href !== "/dashboard" && pathname.startsWith(link.href));

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            aria-label={t(link.titleKey)}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-semibold group",
                                isActive
                                    ? "bg-gradient-to-r from-primary/20 to-secondary/10 text-primary shadow-[0_2px_12px_-2px_hsl(var(--primary)/0.25)]"
                                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("h-4 w-4 shrink-0 transition-transform duration-200", !isActive && "group-hover:scale-110")} />
                            <span>{t(link.titleKey)}</span>
                            {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom actions */}
            <div className="p-3 flex flex-col gap-0.5 pt-4">
                {isAdmin && (
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-primary hover:bg-primary/10 transition-all duration-200"
                    >
                        <ShieldCheck className="h-4 w-4 shrink-0" />
                        <span>{tc("adminDashboard")}</span>
                    </Link>
                )}
                <button
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 w-full text-left"
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    <span>{tc("logOut")}</span>
                </button>
            </div>
        </div>
    );
}
