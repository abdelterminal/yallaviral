"use client";

import { LogOut, Settings, CreditCard, User, ShieldCheck, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTranslations } from "next-intl";
import { YallaLogo } from "@/components/Logo";
import { sidebarLinks } from "./Sidebar";

const PAGE_TITLE_MAP: Record<string, string> = {
    dashboard: "dashboard",
    requests: "campaigns",
    campaign: "discover",
    studio: "studios",
    analytics: "mySummary",
    settings: "settings",
};

export function Header({ profile }: { profile: any }) {
    const pathname = usePathname();
    const { signOut, user } = useAuth();
    const t = useTranslations("Common");
    const tNav = useTranslations("Nav");

    const displayName =
        profile?.full_name ||
        user?.user_metadata?.full_name ||
        user?.email?.split("@")[0] ||
        "User";
    const initials = profile?.full_name
        ? profile.full_name
              .split(" ")
              .map((n: string) => n[0])
              .join("")
              .substring(0, 2)
              .toUpperCase()
        : user?.email?.substring(0, 2).toUpperCase() || "US";

    const isAdmin = user?.user_metadata?.role === "admin";

    // Derive current page title from pathname
    const currentSection = pathname.split("/").filter(Boolean)[0] || "dashboard";
    const titleKey = PAGE_TITLE_MAP[currentSection];
    const pageTitle = titleKey ? tNav(titleKey as any) : currentSection.charAt(0).toUpperCase() + currentSection.slice(1);

    return (
        <header className="sticky top-0 z-[65] bg-background pt-3 pb-2 px-4 md:px-6">
            <div className="flex items-center justify-between rounded-full bg-card px-5 py-3 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]">

                {/* Left: mobile trigger + page title */}
                <div className="flex items-center gap-3">
                    {/* Mobile hamburger */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[80vw] sm:w-[320px] bg-card border-r border-border p-0 text-foreground">
                                <SheetHeader className="p-6 text-left border-b border-border">
                                    <SheetTitle className="flex items-center gap-3 text-foreground">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                            <YallaLogo className="h-6 w-6" />
                                        </div>
                                        <span className="text-lg font-black tracking-tight">YallaViral</span>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col h-full overflow-y-auto pb-20">
                                    <nav className="flex-1 space-y-1 p-4">
                                        {sidebarLinks.map((link) => {
                                            const Icon = link.icon;
                                            const isActive = pathname === link.href;
                                            return (
                                                <SheetClose asChild key={link.href}>
                                                    <Link
                                                        href={link.href}
                                                        className={cn(
                                                            "flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors font-semibold",
                                                            isActive
                                                                ? "bg-primary text-white"
                                                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                                        )}
                                                    >
                                                        <Icon className="h-5 w-5 shrink-0" />
                                                        {tNav(link.titleKey)}
                                                    </Link>
                                                </SheetClose>
                                            );
                                        })}

                                        {isAdmin && (
                                            <>
                                                <div className="h-px bg-border my-3 mx-2" />
                                                <SheetClose asChild>
                                                    <Link
                                                        href="/admin"
                                                        className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors font-semibold text-primary hover:bg-primary/10"
                                                    >
                                                        <ShieldCheck className="h-5 w-5" />
                                                        {t("adminDashboard")}
                                                    </Link>
                                                </SheetClose>
                                            </>
                                        )}
                                    </nav>
                                    <div className="p-4 border-t border-border mt-auto">
                                        <SheetClose asChild>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-2xl font-semibold"
                                                onClick={() => signOut()}
                                            >
                                                <LogOut className="h-5 w-5 mr-3" />
                                                {t("logOut")}
                                            </Button>
                                        </SheetClose>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Page title */}
                    <h2 className="text-sm font-semibold text-foreground">
                        {pageTitle}
                    </h2>
                </div>

                {/* Right: lang + notifications + avatar */}
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <NotificationsDropdown />

                    {/* Avatar + dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative h-9 w-9 rounded-full p-0 ring-2 ring-transparent hover:ring-primary/30 transition-all"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={displayName} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-card border-border text-foreground rounded-2xl p-1.5">
                            <DropdownMenuLabel className="rounded-xl">
                                <div className="flex flex-col">
                                    <span className="font-bold">{displayName}</span>
                                    <span className="text-xs text-muted-foreground font-normal truncate">{user?.email}</span>
                                    {profile?.brand_name && (
                                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider mt-0.5">
                                            {profile.brand_name}
                                        </span>
                                    )}
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border my-1" />
                            <Link href="/settings?tab=profile">
                                <DropdownMenuItem className="focus:bg-muted cursor-pointer rounded-xl">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>{t("profile")}</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/settings?tab=billing">
                                <DropdownMenuItem className="focus:bg-muted cursor-pointer rounded-xl">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>{t("billing")}</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/settings?tab=security">
                                <DropdownMenuItem className="focus:bg-muted cursor-pointer rounded-xl">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>{t("settings")}</span>
                                </DropdownMenuItem>
                            </Link>
                            {isAdmin && (
                                <>
                                    <DropdownMenuSeparator className="bg-border my-1" />
                                    <Link href="/admin">
                                        <DropdownMenuItem className="focus:bg-primary/10 text-primary focus:text-primary cursor-pointer rounded-xl">
                                            <ShieldCheck className="mr-2 h-4 w-4" />
                                            <span className="font-bold">{t("adminDashboard")}</span>
                                        </DropdownMenuItem>
                                    </Link>
                                </>
                            )}
                            <DropdownMenuSeparator className="bg-border my-1" />
                            <DropdownMenuItem
                                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-xl"
                                onClick={() => signOut()}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span className="font-bold">{t("logOut")}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
