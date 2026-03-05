"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Clock, Coins, User, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTranslations, useLocale } from "next-intl";
import { getDateLocale } from "@/utils/date-locale";

interface CampaignDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: any;
}

export function CampaignDetailsModal({ isOpen, onClose, booking }: CampaignDetailsModalProps) {
    const t = useTranslations('CampaignDetail');
    const tc = useTranslations('Common');
    const locale = useLocale();
    const dateFnsLocale = getDateLocale(locale);

    if (!booking) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-card  border-border text-foreground">
                <DialogHeader>
                    <div className="flex items-center justify-between mr-8">
                        <div>
                            <DialogTitle className="text-2xl font-black tracking-tight">{t('campaignHash', { id: booking.id.slice(0, 8) })}</DialogTitle>
                            <DialogDescription className="text-muted-foreground mt-1">
                                {t('createdOn', { date: format(new Date(booking.created_at), "PPP", { locale: dateFnsLocale }) })}
                            </DialogDescription>
                        </div>
                        <Badge
                            className={`px-3 py-1 text-sm font-bold capitalize ${booking.status === "confirmed" ? "bg-emerald-50 text-emerald-600 border-emerald-500/50" :
                                booking.status === "pending" ? "bg-amber-500/20 text-amber-600 border-amber-500/50" : "bg-secondary text-secondary-foreground"
                                }`}
                        >
                            {tc(booking.status)}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50 border border-border">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar className="h-3 w-3" /> {t('shootDate')}
                            </span>
                            <span className="font-mono font-bold">{format(new Date(booking.start_time), "PPP", { locale: dateFnsLocale })}</span>
                        </div>
                        <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/50 border border-border">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <Clock className="h-3 w-3" /> {t('time')}
                            </span>
                            <span className="font-mono font-bold">{format(new Date(booking.start_time), "p", { locale: dateFnsLocale })}</span>
                        </div>
                    </div>

                    {/* Service Details */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('paymentSummary')}</h4>
                        <div className="rounded-lg border border-border bg-muted/50 overflow-hidden">
                            {/* Creator / Model */}
                            <div className="flex items-center justify-between p-4 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">{t('contentCreator')}</p>
                                        <p className="text-xs text-muted-foreground">{booking.resources?.name || t('selectedTalent')}</p>
                                    </div>
                                </div>
                                <span className="font-mono text-sm">{booking.resources?.hourly_rate ? `${booking.resources.hourly_rate} MAD/hr` : "-"}</span>
                            </div>

                            {/* Location / Studio */}
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Studio</p>
                                        <p className="text-xs text-muted-foreground">Main Podcast Studio</p>
                                    </div>
                                </div>
                                <span className="font-mono text-sm">-</span>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-muted" />

                    {/* Total */}
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-foreground">{t('total')}</span>
                        <div className="flex items-center gap-2 text-2xl font-black text-primary">
                            <Coins className="h-6 w-6" />
                            {t('price')}: {booking.total_price?.toFixed(2)} MAD
                        </div>
                    </div>

                    {/* Notes if any */}
                    {booking.notes && (
                        <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
                            <span className="font-bold block mb-1">{t('projectNotes')}:</span>
                            {booking.notes}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
