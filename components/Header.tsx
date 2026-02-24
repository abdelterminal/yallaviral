"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Home, Search, LogOut, Settings, CreditCard, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu, ShieldCheck } from "lucide-react";
import { sidebarLinks } from "./Sidebar";
import { YallaLogo } from "@/components/Logo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationsDropdown } from "./NotificationsDropdown";
import { HelpSupport } from "./HelpSupport";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "@/components/providers/AuthProvider";
import { useTranslations } from "next-intl";

export function Header({ profile }: { profile: any }) {
    const pathname = usePathname();
    const paths = pathname.split("/").filter(Boolean);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const { signOut, user } = useAuth();
    const t = useTranslations('Common');
    const tNav = useTranslations('Nav');

    // Use profile name if available, fallback to user metadata or email
    const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User";
    const initials = profile?.full_name
        ? profile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()
        : user?.email?.substring(0, 2).toUpperCase() || "US";

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <header className="sticky top-4 z-50 mx-auto w-[95%] max-w-7xl">
            <div className="flex items-center justify-between rounded-full border border-white/5 bg-black/60 px-6 py-3 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300">

                {/* Left: Mobile Menu Trigger & Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-[150px] sm:min-w-[200px]">
                    <div className="md:hidden flex items-center pr-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 shrink-0">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle navigation menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[80vw] sm:w-[350px] bg-black/95 border-r border-white/10 p-0 text-white backdrop-blur-xl">
                                <SheetHeader className="p-6 text-left border-b border-white/10">
                                    <SheetTitle className="flex items-center gap-3 text-white">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                                            <YallaLogo className="h-6 w-6" />
                                        </div>
                                        <span className="text-lg font-black tracking-tight">YallaViral</span>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col h-full overflow-y-auto pb-20">
                                    <nav className="flex-1 space-y-2 p-4">
                                        {sidebarLinks.map((link) => {
                                            const Icon = link.icon;
                                            const isActive = pathname === link.href;
                                            return (
                                                <SheetClose asChild key={link.href}>
                                                    <Link
                                                        href={link.href}
                                                        className={cn(
                                                            "flex items-center gap-3 rounded-lg px-3 py-3 transition-colors",
                                                            isActive
                                                                ? "bg-primary/20 text-white font-medium shadow-[0_0_15px_rgba(124,58,237,0.3)] ring-1 ring-primary/50"
                                                                : "text-muted-foreground hover:text-white hover:bg-white/5"
                                                        )}
                                                    >
                                                        <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
                                                        {tNav(link.titleKey)}
                                                    </Link>
                                                </SheetClose>
                                            );
                                        })}

                                        {/* Admin Link manually added for mobile if user is admin */}
                                        {user?.user_metadata?.role === 'admin' && (
                                            <>
                                                <div className="h-px bg-white/10 my-4 mx-2" />
                                                <SheetClose asChild>
                                                    <Link
                                                        href="/admin"
                                                        className="flex items-center gap-3 rounded-lg px-3 py-3 transition-colors text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                                                    >
                                                        <ShieldCheck className="h-5 w-5" />
                                                        {t('adminDashboard')}
                                                    </Link>
                                                </SheetClose>
                                            </>
                                        )}
                                    </nav>
                                    <div className="p-4 border-t border-white/10 mt-auto">
                                        <SheetClose asChild>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                onClick={() => signOut()}
                                            >
                                                <LogOut className="h-5 w-5 mr-3" />
                                                {t('logOut')}
                                            </Button>
                                        </SheetClose>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    <Link href="/dashboard" className="transition-colors hover:text-white hidden sm:block">
                        <Home className="h-4 w-4" />
                    </Link>
                    {paths.map((path, index) => {
                        const href = `/${paths.slice(0, index + 1).join("/")}`;
                        return (
                            <div key={path} className="flex items-center gap-2 overflow-hidden">
                                <ChevronRight className="h-4 w-4 text-white/20 shrink-0" />
                                <Link
                                    href={href}
                                    className="capitalize text-white/90 truncate max-w-[80px] sm:max-w-none hover:text-primary transition-colors hidden sm:block"
                                >
                                    {path.replace(/-/g, " ")}
                                </Link>
                                {/* Show a shorter version for mobile, or hide all but the last path */}
                                <span className="capitalize text-white/90 truncate max-w-[100px] sm:hidden font-medium">
                                    {path.replace(/-/g, " ")}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Center: Search Command (Desktop) */}
                <div className="hidden md:flex flex-1 max-w-md mx-4">
                    <div className="relative w-full group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-green-400 transition-colors" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 rounded-full border border-white/5 bg-secondary/50 pl-10 pr-4 text-sm text-white placeholder:text-muted-foreground/50 focus:outline-none focus:bg-black/80 focus:ring-1 focus:ring-green-400/50 focus:border-green-400/30 transition-all shadow-inner"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
                            <span className="text-[10px] font-mono text-muted-foreground border border-white/10 rounded px-1.5 py-0.5 group-focus-within:text-green-400 group-focus-within:border-green-400/30 transition-all">⌘K</span>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 sm:gap-4 justify-end min-w-[200px]">

                    {/* New Campaign Shortcut */}
                    <Link href="/campaign" className="hidden lg:block">
                        <Button size="sm" className="font-bold bg-white text-black hover:bg-green-400 hover:text-black hover:shadow-[0_0_20px_rgba(74,222,128,0.5)] transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.2)] rounded-full px-5 h-9">
                            {t('new')}
                        </Button>
                    </Link>

                    <div className="h-6 w-[1px] bg-white/10 hidden sm:block mx-1" />

                    {/* Language Switcher */}
                    <LanguageSwitcher />

                    {/* Help/Support */}
                    <HelpSupport />

                    {/* Notifications */}
                    <NotificationsDropdown />

                    {/* User Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="group relative h-9 w-9 rounded-full border border-white/10 p-0 transition-transform hover:scale-105 active:scale-95 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                <Avatar className="h-8 w-8 transition-opacity group-hover:opacity-90 ring-2 ring-transparent group-hover:ring-primary/50">
                                    <AvatarImage src={user?.user_metadata?.avatar_url} alt={displayName} />
                                    <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 bg-black/90 border-white/10 backdrop-blur-xl text-white">
                            <DropdownMenuLabel>
                                <div className="flex flex-col">
                                    <span>{t('myAccount')}</span>
                                    <span className="text-xs text-muted-foreground font-normal truncate">{user?.email}</span>
                                    {profile?.brand_name && <span className="text-[10px] text-primary font-bold uppercase tracking-wider mt-0.5">{profile.brand_name}</span>}
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <Link href="/settings?tab=profile">
                                <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>{t('profile')}</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/settings?tab=billing">
                                <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>{t('billing')}</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/settings?tab=security">
                                <DropdownMenuItem className="focus:bg-white/10 cursor-pointer">
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>{t('settings')}</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator className="bg-white/10" />
                            <DropdownMenuItem
                                className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer"
                                onClick={() => signOut()}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span className="font-bold">{t('logOut')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </header>
    );
}
