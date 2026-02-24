import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { format } from "date-fns";
import { CheckoutActions } from "@/components/checkout/CheckoutActions";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

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
        `Hello YallaViral! 👋\n\nI'd like to complete payment for:\n📋 Booking: #${booking.id.slice(0, 8)}\n💰 Amount: ${booking.total_price?.toFixed(2)} MAD\n📅 Shoot Date: ${booking.start_time ? format(new Date(booking.start_time), "PPP") : "TBD"}\n\nPlease share the payment details.`
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
                    <h1 className="text-3xl font-black tracking-tight text-white">Complete Payment</h1>
                    <p className="text-muted-foreground">Your booking has been approved! Complete payment to start production.</p>
                </div>

                {/* Order Summary */}
                <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden">
                    <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-white/10">
                            <div>
                                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Booking Reference</p>
                                <p className="text-white font-bold text-lg">#{booking.id.slice(0, 8)}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Status</p>
                                <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    Approved
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {booking.resources?.name && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Resource</span>
                                    <span className="text-white font-medium">{booking.resources.name}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shoot Date</span>
                                <span className="text-white font-medium">
                                    {booking.start_time ? format(new Date(booking.start_time), "PPP") : "To be confirmed"}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Booking Date</span>
                                <span className="text-white font-medium">{format(new Date(booking.created_at), "PPP")}</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <div className="flex justify-between items-baseline">
                                <span className="text-muted-foreground font-medium">Total Amount</span>
                                <span className="text-3xl font-black text-white">{booking.total_price?.toFixed(2)} <span className="text-lg text-muted-foreground">MAD</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Actions */}
                    <div className="p-6 bg-white/[0.02] border-t border-white/10">
                        <CheckoutActions
                            bookingId={booking.id}
                            whatsappUrl={whatsappUrl}
                            paymentStatus={booking.payment_status || "unpaid"}
                        />
                    </div>
                </div>

                {/* Help */}
                <p className="text-center text-xs text-muted-foreground">
                    Having trouble? Contact us at <a href="mailto:support@yallaviral.com" className="text-primary hover:underline">support@yallaviral.com</a>
                </p>
            </div>
        </div>
    );
}
