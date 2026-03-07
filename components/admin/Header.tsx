"use client";

import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon, LayoutDashboard, ShieldCheck } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

const ADMIN_PAGE_TITLE_MAP: Record<string, string> = {
    "": "Overview",
    "bookings": "Bookings",
    "models": "Models",
    "studios": "Studios",
    "others": "Materials",
    "users": "Users",
};

interface AdminHeaderProps {
    user: User;
}

export function AdminHeader({ user }: AdminHeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const supabase = createClient();
    const tc = useTranslations('Common');

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Admin";
    const initials = displayName.substring(0, 2).toUpperCase();

    // Derive page title from pathname: /admin/bookings → "Bookings"
    const segments = pathname.split("/").filter(Boolean);
    const adminSegment = segments[1] || "";
    const pageTitle = ADMIN_PAGE_TITLE_MAP[adminSegment] ?? (adminSegment.charAt(0).toUpperCase() + adminSegment.slice(1));

    return (
        <header className="sticky top-0 z-[65] bg-background pt-3 pb-2 px-4 md:px-6">
            <div className="flex items-center justify-between rounded-full bg-card px-5 py-3 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)]">

                {/* Left: page title + admin badge */}
                <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                    <h2 className="text-sm font-semibold text-foreground">{pageTitle}</h2>
                    <span className="text-[8px] font-black uppercase tracking-widest text-primary bg-primary/10 rounded-full px-2 py-0.5">
                        Admin
                    </span>
                </div>

                {/* Right: user view shortcut + avatar */}
                <div className="flex items-center gap-2">
                    <Link href="/dashboard">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs font-bold text-muted-foreground rounded-full px-3 hidden sm:flex"
                        >
                            <LayoutDashboard className="h-3.5 w-3.5 mr-1.5" />
                            User View
                        </Button>
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="relative h-9 w-9 rounded-full p-0 ring-2 ring-transparent hover:ring-primary/30 transition-all"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.user_metadata?.avatar_url} alt={displayName} />
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
                                    <span className="text-xs text-muted-foreground font-normal truncate">{user.email}</span>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border my-1" />
                            <DropdownMenuItem className="focus:bg-muted cursor-pointer rounded-xl">
                                <UserIcon className="mr-2 h-4 w-4" />
                                <span>{tc('profile')}</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border my-1" />
                            <DropdownMenuItem
                                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-xl"
                                onClick={handleSignOut}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span className="font-bold">{tc('logOut')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
