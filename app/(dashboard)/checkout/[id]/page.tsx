import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { CheckoutActions } from "@/components/checkout/CheckoutActions";
import { getTranslations, getLocale } from "next-intl/server";
import { getDateLocale } from "@/utils/date-locale";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const t = await getTranslations('Checkout');
    const tc = await getTranslations('Common');
    const locale = await getLocale();
    const dateFnsLocale = getDateLocale(locale);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    // Fetch booking — scoped to this user
    const { data: booking } = await supabase
        .from("bookings")
        .select(`
            *,
            resources (name, type, image_url, hourly_rate),
            profiles (full_name, email)
        `)
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (!booking) notFound();

    // Only allow checkout for confirmed + unpaid bookings
    if (booking.status !== "confirmed" || booking.payment_status === "paid") {
        redirect(`/requests/${id}`);
    }

    const whatsappMessage = encodeURIComponent(
        t('whatsappMessage', {
            id: booking.id.slice(0, 8),
            amount: booking.total_price?.toFixed(2),
            date: booking.start_time ? format(new Date(booking.start_time), "PPP", { locale: dateFnsLocale }) : "TBD"
        })
    );
    const whatsappUrl = `https://wa.me/212600000000?text=${whatsappMessage}`;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
            <div className="w-full max-w-lg space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/20 border border-primary/30 mb-4">
                        <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-foreground">{t('completePayment')}</h1>
                    <p className="text-muted-foreground">{t('bookingApprovedDesc')}</p>
                </div>

                {/* Order Summary */}
                <div className="rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-border">
                            <div>
                                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{t('bookingReference')}</p>
                                <p className="text-foreground font-bold text-lg">#{booking.id.slice(0, 8)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{t('status')}</p>
                                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                                    {t('approved')}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {booking.resources?.name && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">{t('resource')}</span>
                                    <span className="text-foreground font-medium">{booking.resources.name}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('shootDate')}</span>
                                <span className="text-foreground font-medium">
                                    {booking.start_time ? format(new Date(booking.start_time), "PPP", { locale: dateFnsLocale }) : t('toBeConfirmed')}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{t('bookingDate')}</span>
                                <span className="text-foreground font-medium">{format(new Date(booking.created_at), "PPP", { locale: dateFnsLocale })}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <div className="flex justify-between items-baseline">
                                <span className="text-muted-foreground font-medium">{t('totalAmount')}</span>
                                <span className="text-3xl font-black text-foreground">{booking.total_price?.toFixed(2)} <span className="text-lg text-muted-foreground">MAD</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Actions */}
                    <div className="p-6 bg-muted/30 border-t border-border">
                        <CheckoutActions
                            bookingId={booking.id}
                            whatsappUrl={whatsappUrl}
                            paymentStatus={booking.payment_status || "unpaid"}
                        />
                    </div>
                </div>

                {/* Help */}
                <p className="text-center text-xs text-muted-foreground">
                    {t('havingTrouble')} <a href="mailto:support@yallaviral.com" className="text-primary hover:underline">support@yallaviral.com</a>
                </p>
            </div>
        </div>
    );
}
