"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CalendarDays, Users, Building2, Camera, User, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { YallaLogo } from "@/components/Logo";

export function Sidebar() {
    const pathname = usePathname();
    const t = useTranslations('Admin.sidebar');

    const links = [
        { href: "/admin", label: t('overview'), icon: LayoutDashboard, exact: true },
        { href: "/admin/bookings", label: t('bookings'), icon: CalendarDays },
        { href: "/admin/models", label: t('models'), icon: User },
        { href: "/admin/studios", label: t('studios'), icon: Building2 },
        { href: "/admin/others", label: t('materials'), icon: Camera },
        { href: "/admin/users", label: t('users'), icon: Users },
    ];

    return (
        <div className="hidden md:flex h-[calc(100vh-1.5rem)] w-16 flex-col py-5 fixed top-3 left-3 z-[60] overflow-visible items-center">

            {/* Logo + Admin badge */}
            <div className="mb-6 flex flex-col items-center gap-1.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/60">
                    <YallaLogo className="h-6 w-6" />
                </div>
                <span className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 rounded-full px-2 py-0.5">
                    Admin
                </span>
            </div>

            {/* Nav */}
            <nav className="flex flex-1 flex-col gap-1 items-center w-full px-3">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = link.exact
                        ? pathname === link.href
                        : pathname === link.href || pathname.startsWith(link.href + "/");

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
                                {link.label}
                                <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom: back to user dashboard */}
            <div className="flex flex-col items-center gap-1 px-3 pt-3 w-full border-t border-white/20">
                <Link
                    href="/dashboard"
                    className="group/item relative flex items-center justify-center w-10 h-10 rounded-full text-foreground/35 hover:bg-white/30 hover:text-foreground/70 transition-all duration-200"
                >
                    <ArrowLeft className="h-5 w-5 shrink-0" />
                    <span className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-foreground px-3 py-1.5 text-xs font-semibold text-background opacity-0 shadow-lg transition-opacity duration-150 group-hover/item:opacity-100 z-[70]">
                        {t('switchToUser')}
                        <span className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-foreground" />
                    </span>
                </Link>
            </div>
        </div>
    );
}
