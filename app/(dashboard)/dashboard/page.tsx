import { createClient } from "@/utils/supabase/server";
import { BookingCalendar } from "@/components/dashboard/BookingCalendar";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { getDateLocale } from "@/utils/date-locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CreditCard, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { getStatusBadgeVariant } from "@/lib/utils";

export async function generateMetadata() {
    const t = await getTranslations('Nav');
    return {
        title: `${t('dashboard')} - YallaViral`,
        description: "Manage your bookings and campaigns.",
    };
}

export default async function DashboardPage() {
    const supabase = await createClient();
    const t = await getTranslations('Dashboard');
    const tc = await getTranslations('Common');
    const locale = await getLocale();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch all data in parallel
    const [
        { count: totalBookings },
        { count: activeBookings },
        { count: awaitingPayment },
        { data: allPrices },
        { data: recentBookings },
        { data: bookedDatesRaw },
    ] = await Promise.all([
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("user_id", user.id).in("status", ["pending", "confirmed"]),
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("user_id", user.id).eq("status", "confirmed").eq("payment_status", "unpaid"),
        supabase.from("bookings").select("total_price").eq("user_id", user.id),
        supabase.from("bookings").select(`*, resources (name, image_url)`).eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("bookings").select("start_time").eq("user_id", user.id).not("start_time", "is", null),
    ]);

    const totalSpent = allPrices?.reduce((acc, curr) => acc + (curr.total_price || 0), 0) || 0;
    const bookedDates = (bookedDatesRaw || []).map(b => new Date(b.start_time));
    const firstName = user.user_metadata?.full_name?.split(" ")[0] || "there";

    const stats = [
        { label: t('totalBookings'), value: totalBookings || 0, icon: FileText },
        { label: t('active'), value: activeBookings || 0, icon: Clock },
        { label: t('awaitingPayment'), value: awaitingPayment || 0, icon: CreditCard, highlight: (awaitingPayment || 0) > 0 },
        { label: t('totalSpent'), value: `${totalSpent.toLocaleString()} MAD`, icon: Calendar },
    ];


    return (
        <div className="flex-1 space-y-6 p-6 md:p-8 pt-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        {t('welcomeBack', { name: firstName })}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {t('overview')}
                    </p>
                </div>
                <Link href="/campaign">
                    <Button className="font-semibold">
                        <Plus className="h-4 w-4 mr-2" /> {tc('newBooking')}
                    </Button>
                </Link>
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
                            <span className={`text-xs font-bold uppercase tracking-wider ${stat.highlight ? "text-white/80" : "text-muted-foreground"}`}>
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

            {/* Main Content */}
            <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                {/* Recent Bookings Table */}
                <div className="rounded-[2rem] bg-card overflow-hidden shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
                        <h2 className="text-[15px] font-bold text-foreground">{t('recentBookings')}</h2>
                        <Link href="/requests" className="text-sm text-primary hover:text-primary/80 font-bold transition-colors">
                            {tc('viewAll')}
                        </Link>
                    </div>

                    {(!recentBookings || recentBookings.length === 0) ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="h-12 w-12 rounded-full bg-muted border border-border flex items-center justify-center mb-3">
                                <FileText className="h-5 w-5 text-muted-foreground/50" />
                            </div>
                            <p className="text-sm text-muted-foreground">{t('noBookingsYet')}</p>
                            <Link href="/campaign" className="text-xs text-primary hover:underline mt-2">
                                {t('createFirst')}
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {recentBookings.map((booking: any) => (
                                <Link
                                    key={booking.id}
                                    href={`/requests/${booking.id}`}
                                    className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-9 w-9 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0 overflow-hidden">
                                            {booking.resources?.image_url ? (
                                                <img src={booking.resources.image_url} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <FileText className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">
                                                {booking.resources?.name || `#${booking.id.slice(0, 8)}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(booking.created_at), "MMM d, yyyy", { locale: getDateLocale(locale) })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 ml-4">
                                        <span className="text-sm font-mono text-muted-foreground hidden sm:block">
                                            {booking.total_price?.toLocaleString()} MAD
                                        </span>
                                        <Badge variant={getStatusBadgeVariant(booking.status)} className="capitalize">
                                            {tc(booking.status)}
                                        </Badge>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Calendar */}
                <BookingCalendar bookedDates={bookedDates} />
            </div>
        </div>
    );
}
