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
    <div className="group/sidebar hidden md:flex h-screen w-20 hover:w-64 flex-col border-r border-white/5 bg-black/40 py-6 backdrop-blur-xl transition-[width] duration-300 ease-in-out">
      <div className="mb-8 flex items-center px-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
          <YallaLogo className="h-7 w-7" />
        </div>
        <span className="ml-4 text-xl font-bold text-white opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap overflow-hidden">
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
              className="group relative flex items-center gap-4 transition-all duration-300"
            >
              <div
                className={cn(
                  "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-105",
                  isActive
                    ? "bg-gradient-to-br from-primary via-primary to-purple-600 text-white shadow-[0_0_25px_rgba(124,58,237,0.6)] ring-1 ring-white/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-green-400 hover:shadow-[0_0_15px_rgba(74,222,128,0.4)]"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "fill-current animate-pulse")} />
              </div>
              <span
                className={cn(
                  "text-sm font-medium transition-all duration-300 whitespace-nowrap overflow-hidden group-hover:translate-x-1",
                  "opacity-0 group-hover/sidebar:opacity-100",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-green-400"
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
            className="flex h-12 w-full items-center justify-start gap-4 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 group transition-all duration-300 rounded-lg px-0"
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
