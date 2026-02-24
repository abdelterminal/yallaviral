import { createClient } from "@/utils/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, Clock, CreditCard, CheckCircle, XCircle, Loader2, Banknote } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { AdminActionButtons } from "@/components/admin/AdminActionButtons";
import { getTranslations } from "next-intl/server";

export const revalidate = 0;

export default async function AdminDashboard() {
    const supabase = await createClient();
    const t = await getTranslations('Admin');

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

    const statusColors: Record<string, string> = {
        pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        confirmed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
        rejected: "text-red-400 bg-red-400/10 border-red-400/20",
    };

    const paymentColors: Record<string, string> = {
        unpaid: "text-orange-400 bg-orange-400/10 border-orange-400/20",
        pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
        paid: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">{t('title')}</h1>
                <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div
                        key={stat.label}
                        className={`rounded-xl border p-5 ${stat.highlight
                            ? "border-primary/30 bg-primary/5"
                            : "border-white/10 bg-white/5"
                            }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                {stat.label}
                            </span>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className={`text-2xl font-bold ${stat.highlight ? "text-primary" : "text-white"}`}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Actionable Bookings */}
            <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                    <h2 className="text-sm font-semibold text-white">{t('needsAttention')}</h2>
                    <Link href="/admin/bookings" className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                        {t('allBookings')}
                    </Link>
                </div>

                {(!actionableBookings || actionableBookings.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-3">
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                        </div>
                        <p className="text-sm text-emerald-400 font-medium">{t('allClear')}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t('noAttentionNeeded')}</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('table.client')}</th>
                                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('table.resource')}</th>
                                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('table.amount')}</th>
                                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('table.status')}</th>
                                    <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('table.payment')}</th>
                                    <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">{t('table.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {actionableBookings.map((booking: any) => {
                                    const profile = booking.profiles as any;
                                    const name = profile?.brand_name || profile?.full_name || t('table.unknown');

                                    return (
                                        <tr key={booking.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                                            <td className="px-5 py-3">
                                                <div>
                                                    <p className="font-medium text-white text-sm">{name}</p>
                                                    <p className="text-xs text-muted-foreground">{profile?.email}</p>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-muted-foreground text-sm">
                                                {booking.resources?.name || "—"}
                                            </td>
                                            <td className="px-5 py-3 text-white font-mono text-sm">
                                                {booking.total_price?.toLocaleString()} MAD
                                            </td>
                                            <td className="px-5 py-3">
                                                <Badge variant="outline" className={`capitalize text-xs ${statusColors[booking.status] || ""}`}>
                                                    {booking.status}
                                                </Badge>
                                            </td>
                                            <td className="px-5 py-3">
                                                {booking.payment_status && booking.status === "confirmed" ? (
                                                    <Badge variant="outline" className={`capitalize text-xs ${paymentColors[booking.payment_status] || ""}`}>
                                                        {booking.payment_status}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground">—</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3">
                                                <AdminActionButtons
                                                    bookingId={booking.id}
                                                    status={booking.status}
                                                    paymentStatus={booking.payment_status}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
