import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, Clock, CreditCard, CheckCircle, XCircle, Loader2, Banknote } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { AdminActionButtons } from "@/components/admin/AdminActionButtons";
import { getTranslations } from "next-intl/server";
import { getStatusBadgeVariant } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminDashboard() {
    const supabase = await createClient();
    const t = await getTranslations('Admin');
    const tc = await getTranslations('Common');

    // Fetch all stats in parallel
    const [
        { data: bookings },
        { count: pendingCount },
        { count: awaitingPaymentCount },
        { count: userCount },
        { data: actionableBookings },
    ] = await Promise.all([
        supabase.from("bookings").select("total_price"),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed").eq("payment_status", "unpaid"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "client"),
        supabase
            .from("bookings")
            .select(`
                id, total_price, status, payment_status, created_at,
                profiles (full_name, email, brand_name),
                resources (name)
            `)
            .or("status.eq.pending,and(status.eq.confirmed,payment_status.in.(unpaid,pending))")
            .order("created_at", { ascending: false })
            .limit(10),
    ]);

    const totalRevenue = bookings?.reduce((acc, curr) => acc + (curr.total_price || 0), 0) || 0;

    const stats = [
        { label: t('stats.totalRevenue'), value: `${totalRevenue.toLocaleString()} MAD`, icon: DollarSign },
        { label: t('stats.pendingRequests'), value: pendingCount || 0, icon: Clock, highlight: (pendingCount || 0) > 0 },
        { label: t('stats.awaitingPayment'), value: awaitingPaymentCount || 0, icon: CreditCard, highlight: (awaitingPaymentCount || 0) > 0 },
        { label: t('stats.totalUsers'), value: userCount || 0, icon: Users },
    ];


    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-black tracking-tight text-foreground">{t('title')}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className={`rounded-3xl p-6 ${stat.highlight
                            ? "bg-primary text-white shadow-[0_10px_30px_-10px_hsl(var(--primary))]"
                            : "bg-card shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)]"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className={`text-xs font-bold uppercase tracking-wider ${stat.highlight ? "text-primary-foreground" : "text-muted-foreground"}`}>
                                {stat.label}
                            </span>
                            <div className={`p-2.5 rounded-full ${stat.highlight ? "bg-white/20 text-white" : "bg-primary/10 text-primary"}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </div>
                        <p className={`text-3xl font-black tracking-tight ${stat.highlight ? "text-white" : "text-foreground"}`}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Actionable Bookings */}
            <div className="rounded-[2rem] bg-card overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]">
                <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
                    <h2 className="text-[15px] font-bold text-foreground">{t('needsAttention')}</h2>
                    <Link href="/admin/bookings" className="text-sm text-primary hover:text-primary/80 font-bold transition-colors">
                        {t('allBookings')}
                    </Link>
                </div>

                {(!actionableBookings || actionableBookings.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                        <p className="text-sm text-emerald-600 font-bold">{t('allClear')}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t('noAttentionNeeded')}</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3 p-6 bg-muted/30">
                        {/* Custom Header Row */}
                        <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_0.5fr] gap-4 px-6 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                            <div>{t('table.client')}</div>
                            <div>{t('table.resource')}</div>
                            <div>{t('table.amount')}</div>
                            <div>{t('table.status')}</div>
                            <div>{t('table.payment')}</div>
                            <div className="text-right">{t('table.actions')}</div>
                        </div>

                        {/* List Items */}
                        <div className="flex flex-col gap-3">
                            {actionableBookings.map((booking: any) => {
                                const profile = booking.profiles as any;
                                const name = profile?.brand_name || profile?.full_name || t('table.unknown');

                                return (
                                    <div key={booking.id} className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_0.5fr] items-center gap-4 bg-card rounded-full px-6 py-4 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300">
                                        <div className="flex items-center min-w-0">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                                                {name.substring(0, 2)}
                                            </div>
                                            <div className="ml-4 min-w-0">
                                                <p className="font-bold text-foreground text-sm truncate">{name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
                                            </div>
                                        </div>

                                        <div className="text-muted-foreground text-sm font-medium truncate">
                                            {booking.resources?.name || "—"}
                                        </div>

                                        <div className="text-foreground font-black text-sm">
                                            {booking.total_price?.toLocaleString()} MAD
                                        </div>

                                        <div>
                                            <Badge variant={getStatusBadgeVariant(booking.status)} className="capitalize w-fit">
                                                {tc(booking.status)}
                                            </Badge>
                                        </div>

                                        <div>
                                            {booking.payment_status && booking.status === "confirmed" ? (
                                                <Badge variant={getStatusBadgeVariant(booking.payment_status)} className="capitalize w-fit">
                                                    {tc(booking.payment_status)}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-muted-foreground font-bold">—</span>
                                            )}
                                        </div>

                                        <div className="flex justify-end">
                                            <AdminActionButtons
                                                bookingId={booking.id}
                                                status={booking.status}
                                                paymentStatus={booking.payment_status}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
