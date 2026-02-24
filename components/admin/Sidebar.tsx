"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, CalendarDays, Users, Building2, Camera, User, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export function Sidebar() {
    const pathname = usePathname();
    const t = useTranslations('Admin.sidebar');

    const links = [
        { href: "/admin", label: t('overview'), icon: LayoutDashboard },
        { href: "/admin/bookings", label: t('bookings'), icon: CalendarDays },
        { href: "/admin/models", label: t('models'), icon: User },
        { href: "/admin/studios", label: t('studios'), icon: Building2 },
        { href: "/admin/others", label: t('materials'), icon: Camera },
        { href: "/admin/users", label: t('users'), icon: Users },
    ];

    return (
        <div className="flex flex-col h-full p-4 space-y-4">
            <div className="flex items-center gap-2 px-2 py-4">
                <span className="text-xl font-black tracking-tight text-white">Yalla Viral <span className="text-primary text-xs ml-1 bg-primary/20 px-1 py-0.5 rounded">{t('adminTag')}</span></span>
            </div>

            <nav className="flex-1 space-y-1">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            pathname === link.href
                                ? "bg-primary text-white"
                                : "text-muted-foreground hover:text-white hover:bg-white/5"
                        )}
                    >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div className="pt-4 border-t border-white/10">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-white hover:bg-white/5 transition-colors group"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    {t('switchToUser')}
                </Link>
            </div>
        </div>
    );
}
