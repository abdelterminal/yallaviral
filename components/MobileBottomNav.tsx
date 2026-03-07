"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Rocket, Search, MapPin, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const navLinks = [
    { titleKey: "dashboard" as const, href: "/dashboard", icon: LayoutDashboard },
    { titleKey: "campaigns" as const, href: "/requests", icon: Rocket },
    { titleKey: "discover" as const, href: "/campaign", icon: Search },
    { titleKey: "studios" as const, href: "/studio", icon: MapPin },
    { titleKey: "mySummary" as const, href: "/analytics", icon: BarChart3 },
];

export function MobileBottomNav() {
    const pathname = usePathname();
    const t = useTranslations("Nav");

    return (
        <nav
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)] safe-bottom"
            aria-label="Mobile navigation"
        >
            <div className="flex items-center justify-around px-2 h-16">
                {navLinks.map((link) => {
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
                                "flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-2xl transition-all duration-200",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground/40 hover:text-foreground/70"
                            )}
                        >
                            <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
                            <span className="text-[9px] font-bold tracking-wide leading-none">
                                {t(link.titleKey)}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
