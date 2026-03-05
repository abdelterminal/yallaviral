"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { markPaymentPending } from "@/actions/mark-payment";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface CheckoutActionsProps {
    bookingId: string;
    whatsappUrl: string;
    paymentStatus: string;
}

export function CheckoutActions({ bookingId, whatsappUrl, paymentStatus }: CheckoutActionsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const t = useTranslations('Checkout');
    const tc = useTranslations('Common');

    const handleMarkPending = async () => {
        setIsLoading(true);
        try {
            const result = await markPaymentPending(bookingId);
            if (result.success) {
                toast.success(t('paymentSent'), {
                    description: t('paymentSentDesc'),
                });
                router.push(`/requests/${bookingId}`);
            } else {
                toast.error("Error", { description: result.error });
            }
        } catch {
            toast.error(tc('somethingWentWrong'));
        } finally {
            setIsLoading(false);
        }
    };

    if (paymentStatus === "pending") {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <Loader2 className="h-5 w-5 text-yellow-400 animate-spin" />
                    <div>
                        <p className="text-sm font-bold text-yellow-400">{t('paymentUnderReview')}</p>
                        <p className="text-xs text-muted-foreground">{t('paymentReviewDesc')}</p>
                    </div>
                </div>
                <Link href={`/requests/${bookingId}`}>
                    <Button variant="ghost" className="w-full">
                        <ArrowLeft className="h-4 w-4 mr-2" /> {t('backToBooking')}
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Primary: WhatsApp Payment */}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                <Button
                    size="lg"
                    className="w-full font-bold text-base h-14 bg-[#25D366] hover:bg-[#20bd5a] text-foreground shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-all rounded-xl"
                >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    {t('payViaWhatsApp')}
                </Button>
            </a>

            <p className="text-center text-xs text-muted-foreground">
                {t('connectedWithTeam')}
            </p>

            {/* After payment: Mark as completed */}
            <div className="pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3 text-center">
                    {t('alreadySentPayment')}
                </p>
                <Button
                    variant="outline"
                    size="lg"
                    className="w-full font-bold border-border bg-muted/50 hover:bg-muted hover:text-foreground transition-all rounded-xl h-12"
                    onClick={handleMarkPending}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    {t('completedPayment')}
                </Button>
            </div>
        </div>
    );
}
