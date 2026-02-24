"use client";

import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User as UserIcon } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface AdminHeaderProps {
    user: User;
}

export function AdminHeader({ user }: AdminHeaderProps) {
    const router = useRouter();
    const supabase = createClient();
    const t = useTranslations('Admin.header');
    const tc = useTranslations('Common');

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    return (
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-black">
            <h1 className="text-lg font-semibold">{t('adminDashboard')}</h1>

            <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-white">{user.user_metadata?.full_name || user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.user_metadata?.role}</p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all">
                            <AvatarImage src={user.user_metadata?.avatar_url} />
                            <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-black border-white/10 text-white">
                        <DropdownMenuLabel>{t('myAccount')}</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem className="cursor-pointer focus:bg-white/10 focus:text-white">
                            <UserIcon className="mr-2 h-4 w-4" /> {t('profile')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleSignOut} className="text-red-500 cursor-pointer focus:bg-red-500/10 focus:text-red-500">
                            <LogOut className="mr-2 h-4 w-4" /> {tc('logOut')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
