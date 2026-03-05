"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Banknote, ExternalLink } from "lucide-react";
import { confirmBooking } from "@/actions/confirm-booking";
import { adminUpdatePaymentStatus } from "@/actions/mark-payment";
import { RejectBookingDialog } from "@/components/admin/RejectBookingDialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface AdminActionButtonsProps {
    bookingId: string;
    status: string;
    paymentStatus: string | null;
}

export function AdminActionButtons({ bookingId, status, paymentStatus }: AdminActionButtonsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations('Admin');
    const tc = useTranslations('Common');

    const handleAction = async (action: () => Promise<any>, successMsg: string) => {
        setIsLoading(true);
        try {
            await action();
            toast.success(successMsg);
            router.refresh();
        } catch {
            toast.error(tc('somethingWentWrong'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-end gap-1.5">
            {status === "pending" && (
                <>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-emerald-600 hover:text-emerald-300 hover:bg-emerald-50 h-7 px-2 text-xs font-medium"
                        onClick={() => handleAction(() => confirmBooking(bookingId), t('bookingApproved'))}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                        {t('approve')}
                    </Button>
                    <RejectBookingDialog bookingId={bookingId} />
                </>
            )}
            {status === "confirmed" && paymentStatus === "pending" && (
                <Button
                    size="sm"
                    variant="ghost"
                    className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 h-7 px-2 text-xs font-medium"
                    onClick={() => handleAction(() => adminUpdatePaymentStatus(bookingId, "paid"), t('paymentConfirmed'))}
                    disabled={isLoading}
                >
                    {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Banknote className="h-3 w-3 mr-1" />}
                    {t('confirmPay')}
                </Button>
            )}
            <Link href={`/admin/bookings/${bookingId}`}>
                <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 h-7 px-2 text-xs font-medium">
                    <ExternalLink className="h-3 w-3 mr-1" /> {t('manage')}
                </Button>
            </Link>
        </div>
    );
}
