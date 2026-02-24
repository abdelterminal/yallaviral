"use client";

import { useState } from "react";
import { Bell, Check, Clock, Info, AlertCircle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Notification {
    id: string;
    title: string;
    description: string;
    time: string;
    type: "info" | "success" | "warning";
    read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: "1",
        title: "Campaign Approved",
        description: "Your UGC campaign for 'Winter Vibes' has been approved.",
        time: "2m ago",
        type: "success",
        read: false,
    },
    {
        id: "2",
        title: "New Message",
        description: "Model Sara sent you a message regarding the script.",
        time: "1h ago",
        type: "info",
        read: false,
    },
    {
        id: "3",
        title: "Studio Booking Confirmed",
        description: "Podcast Room is booked for tomorrow at 10:00 AM.",
        time: "3h ago",
        type: "success",
        read: true,
    },
    {
        id: "4",
        title: "System Update",
        description: "New features added to the Campaign Builder.",
        time: "1d ago",
        type: "info",
        read: true,
    },
];

export function NotificationsDropdown() {
    const t = useTranslations('Shared');
    const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:bg-white/5 hover:text-white relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-1 ring-black animate-pulse" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 bg-zinc-950/90 border-white/10 backdrop-blur-2xl text-white p-0 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/[0.02]">
                    <DropdownMenuLabel className="p-0 font-black text-xl tracking-tight">{t('notificationsTitle')}</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-3 text-xs font-bold text-primary hover:text-white hover:bg-primary/20 transition-all rounded-full"
                            onClick={markAllAsRead}
                        >
                            {t('markAllRead')}
                        </Button>
                    )}
                </div>
                <div className="max-h-[450px] overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {notifications.length === 0 ? (
                        <div className="p-12 text-center text-muted-foreground">
                            <Info className="h-10 w-10 mx-auto mb-3 opacity-20" />
                            <p className="text-sm font-mono tracking-widest">{t('noNewData')}</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <DropdownMenuItem
                                key={n.id}
                                className={cn(
                                    "flex flex-col items-start gap-1.5 py-4 px-5 focus:bg-white/5 cursor-pointer border-b border-white/5 last:border-0 transition-all duration-200 outline-none",
                                    !n.read && "bg-primary/5"
                                )}
                                onClick={() => markAsRead(n.id)}
                            >
                                <div className="flex w-full items-start justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        <div className={cn(
                                            "h-2 w-2 rounded-full shrink-0",
                                            n.type === "success" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" :
                                                n.type === "warning" ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]" :
                                                    "bg-primary shadow-[0_0_8px_rgba(124,58,237,0.5)]"
                                        )} />
                                        <span className={cn("font-bold text-[15px] tracking-tight", !n.read ? "text-white" : "text-muted-foreground/80")}>
                                            {n.title}
                                        </span>
                                    </div>
                                    <span className="text-[10px] font-mono font-medium text-muted-foreground/60 whitespace-nowrap pt-1">
                                        {n.time.toUpperCase()}
                                    </span>
                                </div>
                                <p className={cn(
                                    "text-sm leading-relaxed line-clamp-2 pl-4.5 transition-colors",
                                    !n.read ? "text-muted-foreground" : "text-muted-foreground/60"
                                )}>
                                    {n.description}
                                </p>
                                {!n.read && (
                                    <div className="mt-2.5 pl-4.5">
                                        <Badge className="bg-primary/20 text-primary border border-primary/30 text-[10px] font-black uppercase tracking-widest h-5 px-2">{t('newBadge')}</Badge>
                                    </div>
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
                <DropdownMenuSeparator className="bg-white/10 m-0" />
                <div className="p-2 border-t border-white/5 bg-white/[0.01]">
                    <a href="/requests" className="w-full">
                        <Button variant="ghost" className="w-full h-10 text-xs font-bold text-muted-foreground hover:text-white hover:bg-white/5 transition-all rounded-lg">
                            {t('viewAllActivity')}
                        </Button>
                    </a>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
