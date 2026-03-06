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
                    return (
                        <button
                            key={filter}
                            onClick={() => setStatusFilter(filter)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all capitalize hover:-translate-y-0.5 ${statusFilter === filter
                                    ? "bg-primary text-white shadow-[0_8px_20px_-6px_hsl(var(--primary))]"
                                    : "bg-card text-muted-foreground hover:text-foreground shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]"
                                }`}
                        >
                            {filter} ({count})
                        </button>
                    );
                })}
            </div>

            <div className="grid gap-4">
                {filtered.map((booking) => (
                    <Link key={booking.id} href={`/requests/${booking.id}`}>
                        <Card className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:-translate-y-1 transition-all duration-300 group cursor-pointer border-0 bg-card shadow-[0_8px_30px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)]">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors tracking-tight">{t('campaignHash', { id: booking.id.slice(0, 8) })}</h3>
                                    <Badge variant={getStatusBadgeVariant(booking.status)} className="capitalize">
                                        {tc(booking.status)}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-6 text-base font-medium text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        {format(new Date(booking.created_at), "MMM do, yyyy", { locale: dateFnsLocale })}
                                    </div>
                                    <div className="flex items-center gap-2 font-bold text-primary">
                                        {t('price')}: {booking.total_price?.toFixed(2)} MAD
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                {booking.status === 'pending' && (
                                    <Button
                                        size="lg"
                                        onClick={(e) => handleApprove(e, booking.id)}
                                        disabled={isPending}
                                        className="h-12 px-6 font-bold"
                                    >
                                        <CheckCircle className="mr-2 h-5 w-5" />
                                        {isPending ? t('approving') : t('approve')}
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="w-full md:w-auto h-12 px-6 font-bold"
                                >
                                    {t('viewDetails')}
                                </Button>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
