"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Rocket, Search, MapPin, BarChart3, Settings, LogOut, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { YallaLogo } from "@/components/Logo";
import { useTranslations } from "next-intl";

export const sidebarLinks = [
  {
    titleKey: "dashboard" as const,
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    titleKey: "campaigns" as const,
    href: "/requests",
    icon: Rocket,
  },
  {
    titleKey: "discover" as const,
    href: "/campaign",
    icon: Search,
  },
  {
    titleKey: "studios" as const,
    href: "/studio",
    icon: MapPin,
  },
  {
    titleKey: "mySummary" as const,
    href: "/analytics",
    icon: BarChart3,
  },
  {
    titleKey: "settings" as const,
    href: "/settings",
    icon: Settings,
  },
];

import { useAuth } from "@/components/providers/AuthProvider";

export function Sidebar() {
  const pathname = usePathname();
  const { signOut, user } = useAuth();
  const isAdmin = user?.user_metadata?.role === 'admin';
  const t = useTranslations('Nav');
  const tc = useTranslations('Common');

  const allLinks = sidebarLinks;

  return (
    <div className="group/sidebar hidden md:flex h-screen w-20 hover:w-64 flex-col border-r border-border bg-card py-6 transition-[width] duration-300 ease-in-out fixed top-0 left-0 z-[60] shadow-sm hover:shadow-2xl hover:border-r-primary/20">
      <div className="mb-8 flex items-center px-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
          <YallaLogo className="h-7 w-7" />
        </div>
        <span className="ml-4 text-xl font-bold text-foreground opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
          YallaViral
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-4 px-3">
        {allLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn("group relative flex items-center gap-4 transition-all duration-300 rounded-2xl p-3 w-[calc(100%-1rem)] mx-2",
                isActive ? "bg-primary text-primary-foreground shadow-[0_8px_30px_rgb(0_0_0_/_0.08)]" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <div className="flex-shrink-0 flex items-center justify-center w-8">
                <Icon className={cn("h-6 w-6 transition-transform group-hover:scale-110", isActive && "fill-current")} />
              </div>
              <span
                className={cn("text-base font-bold transition-all duration-300 whitespace-nowrap overflow-hidden", "opacity-0 group-hover/sidebar:opacity-100",
                  isActive ? "text-primary-foreground" : ""
                )}
              >
                {t(link.titleKey)}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-4 space-y-2">
        {isAdmin && (
          <Link
            href="/admin"
            className="flex h-12 w-full items-center justify-start gap-4 text-primary hover:bg-primary/5 hover:text-primary group transition-all duration-300 rounded-lg px-0"
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span className="text-sm font-bold opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
              {tc('adminDashboard')}
            </span>
          </Link>
        )}

        <Button
          variant="ghost"
          size="default"
          onClick={() => signOut()}
          className="flex h-12 w-full items-center justify-start gap-4 text-muted-foreground hover:bg-destructive/10 hover:text-destructive group transition-all duration-300"
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
            <LogOut className="h-5 w-5" />
          </div>
          <span className="text-sm font-medium opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">
            {tc('logOut')}
          </span>
        </Button>
      </div>
    </div>
  );
}
