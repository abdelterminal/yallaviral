"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Activity, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { confirmBooking } from "@/actions/confirm-booking";
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { getDateLocale } from "@/utils/date-locale";
import { getStatusBadgeVariant } from "@/lib/utils";

const STATUS_FILTERS = ["all", "pending", "confirmed", "rejected", "completed"] as const;
type StatusFilter = typeof STATUS_FILTERS[number];

interface CampaignsListProps {
    bookings: any[];
}

export function CampaignsList({ bookings }: CampaignsListProps) {
    const [isPending, startTransition] = useTransition();
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const router = useRouter();
    const t = useTranslations('CampaignDetail');
    const tc = useTranslations('Common');
    const locale = useLocale();
    const dateFnsLocale = getDateLocale(locale);

    const filtered = statusFilter === "all" ? bookings : bookings.filter(b => b.status === statusFilter);

    const handleApprove = async (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Prevent link navigation
        startTransition(async () => {
            await confirmBooking(id);
            router.refresh();
        });
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((filter) => {
                    const count = filter === "all" ? bookings.length : bookings.filter(b => b.status === filter).length;
                    const isActive = statusFilter === filter;
                    return (
                        <button
                            key={filter}
                            onClick={() => setStatusFilter(filter)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all duration-150 capitalize hover:scale-[1.02] ${
                                isActive
                                    ? "bg-primary/15 text-primary border border-primary/25 shadow-[0_0_12px_-2px_hsl(var(--primary)/0.2)]"
                                    : "bg-card text-muted-foreground shadow-[0_2px_8px_-2px_rgba(0,0,0,0.25)] hover:bg-muted/50 hover:text-foreground"
                            }`}
                        >
                            {filter}
                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div className="space-y-3">
                {filtered.map((booking) => (
                    <Link key={booking.id} href={`/requests/${booking.id}`}>
                        <div className="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 py-5 rounded-[14px] bg-card shadow-[0_2px_16px_-4px_rgba(0,0,0,0.35)] hover:bg-white/[0.02] hover:-translate-y-px hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] transition-all duration-200 cursor-pointer">
                            <div className="space-y-2 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                                        {t('campaignHash', { id: booking.id.slice(0, 8) })}
                                    </h3>
                                    <Badge variant={getStatusBadgeVariant(booking.status)} className="capitalize text-[11px]">
                                        {tc(booking.status)}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-5 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {format(new Date(booking.created_at), "MMM d, yyyy", { locale: dateFnsLocale })}
                                    </div>
                                    <div className="flex items-center gap-1.5 font-semibold text-accent">
                                        <Activity className="h-3.5 w-3.5" />
                                        {booking.total_price?.toFixed(2)} MAD
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                                {booking.status === 'pending' && (
                                    <Button
                                        size="sm"
                                        onClick={(e) => handleApprove(e, booking.id)}
                                        disabled={isPending}
                                        className="font-semibold"
                                    >
                                        <CheckCircle className="h-4 w-4" />
                                        {isPending ? t('approving') : t('approve')}
                                    </Button>
                                )}
                                <Button variant="outline" size="sm" className="font-semibold">
                                    {t('viewDetails')}
                                </Button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
