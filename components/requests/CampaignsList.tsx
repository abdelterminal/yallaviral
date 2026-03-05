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
                    <Card className="p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:-translate-y-1 transition-all duration-300 group cursor-pointer border-border bg-card shadow-sm hover:shadow-md">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors tracking-tight">{t('campaignHash', { id: booking.id.slice(0, 8) })}</h3>
                                <Badge
                                    variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                                    className="capitalize"
                                >
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
                                className="w-full md:w-auto h-12 px-6 font-bold bg-white"
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
