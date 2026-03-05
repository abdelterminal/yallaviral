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
                <span className="text-xl font-black tracking-tight text-foreground">Yalla Viral <span className="text-primary text-xs ml-1 bg-primary/20 px-1 py-0.5 rounded">{t('adminTag')}</span></span>
            </div>

            <nav className="flex-1 space-y-1">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn("flex items-center gap-3 px-3 py-3 rounded-2xl text-base font-bold transition-all duration-300 mx-2",
                            pathname === link.href
                                ? "bg-primary text-primary-foreground shadow-[0_8px_30px_rgb(0_0_0_/_0.08)]"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        <link.icon className={cn("h-5 w-5", pathname === link.href && "fill-current")} />
                        {link.label}
                    </Link>
                ))}
            </nav>

            <div className="pt-4 border-t border-border">
                <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors group"
                >
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    {t('switchToUser')}
                </Link>
            </div>
        </div>
    );
}
