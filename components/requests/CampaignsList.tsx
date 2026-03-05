"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Activity, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { confirmBooking } from "@/actions/confirm-booking";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { getDateLocale } from "@/utils/date-locale";

interface CampaignsListProps {
    bookings: any[];
}

export function CampaignsList({ bookings }: CampaignsListProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const t = useTranslations('CampaignDetail');
    const tc = useTranslations('Common');
    const locale = useLocale();
    const dateFnsLocale = getDateLocale(locale);

    const handleApprove = async (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Prevent link navigation
        startTransition(async () => {
            await confirmBooking(id);
            router.refresh();
        });
    };

    return (
        <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {bookings.map((booking) => (
                <Link key={booking.id} href={`/requests/${booking.id}`}>
                    <Card className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-transparent hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:bg-card transition-all group cursor-pointer border-transparent bg-card backdrop-blur-md">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{t('campaignHash', { id: booking.id.slice(0, 8) })}</h3>
                                <Badge
                                    variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                                    className={`capitalize border-border ${booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : ''}`}
                                >
                                    {tc(booking.status)}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(booking.created_at), "MMM do, yyyy", { locale: dateFnsLocale })}
                                </div>
                                <div className="flex items-center gap-1 font-mono text-emerald-600">
                                    <div className="h-3 w-3" />
                                    {t('price')}: {booking.total_price?.toFixed(2)} MAD
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {booking.status === 'pending' && (
                                <Button
                                    size="sm"
                                    onClick={(e) => handleApprove(e, booking.id)}
                                    disabled={isPending}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-foreground font-bold"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    {isPending ? t('approving') : t('approve')}
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full md:w-auto border-border hover:bg-primary hover:text-foreground transition-all font-bold"
                            >
                                {t('viewDetails')}
                            </Button>
                        </div>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
