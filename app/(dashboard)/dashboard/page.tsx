import { createClient } from "@/utils/supabase/server";
import { BookingCalendar } from "@/components/dashboard/BookingCalendar";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { getDateLocale } from "@/utils/date-locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BarChart2,
    Clock,
    CreditCard,
    FileText,
    Plus,
    Settings,
    Sparkles,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { getStatusBadgeVariant } from "@/lib/utils";

export async function generateMetadata() {
    const t = await getTranslations("Nav");
    return {
        title: `${t("dashboard")} - YallaViral`,
        description: "Manage your bookings and campaigns.",
    };
}

export default async function DashboardPage() {
    const supabase = await createClient();
    const t = await getTranslations("Dashboard");
    const tc = await getTranslations("Common");
    const locale = await getLocale();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const [
        { count: totalBookings },
        { count: activeBookings },
        { count: awaitingPayment },
        { data: allPrices },
        { data: recentBookings },
        { data: bookedDatesRaw },
    ] = await Promise.all([
        supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id),
        supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .in("status", ["pending", "confirmed"]),
        supabase
            .from("bookings")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "confirmed")
            .eq("payment_status", "unpaid"),
        supabase
            .from("bookings")
            .select("total_price")
            .eq("user_id", user.id),
        supabase
            .from("bookings")
            .select(`*, resources (name, image_url)`)
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(8),
        supabase
            .from("bookings")
            .select("start_time")
            .eq("user_id", user.id)
            .not("start_time", "is", null),
    ]);

    const totalSpent =
        allPrices?.reduce((acc, curr) => acc + (curr.total_price || 0), 0) || 0;
    const bookedDates = (bookedDatesRaw || []).map(
        (b) => new Date(b.start_time)
    );
    const firstName =
        user.user_metadata?.full_name?.split(" ")[0] || "there";
    const hasAwaitingPayment = (awaitingPayment || 0) > 0;

    const quickLinks = [
        { label: t("recentBookings"), href: "/requests", icon: FileText },
        { label: "Analytics", href: "/analytics", icon: BarChart2 },
        { label: tc("settings") || "Settings", href: "/settings", icon: Settings },
        { label: "Campaign", href: "/campaign", icon: Sparkles },
    ];

    return (
        <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* ── LEFT COLUMN ── */}
                <div className="flex flex-col gap-4">

                    {/* Hero card */}
                    <div className="relative rounded-[2rem] bg-[hsl(var(--primary))] p-7 overflow-hidden shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.4)]">
                        {/* Decorative blobs */}
                        <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-12 -left-12 w-52 h-52 bg-white/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            <p className="text-primary-foreground/60 text-xs font-semibold uppercase tracking-widest">
                                {t("welcomeBack", { name: "" })}
                            </p>
                            <h1 className="text-white text-2xl font-bold tracking-tight mt-0.5 mb-6">
                                {firstName}
                            </h1>

                            <p className="text-primary-foreground/60 text-xs font-semibold uppercase tracking-widest">
                                {t("totalBookings")}
                            </p>
                            <p className="text-white text-6xl font-black tracking-tighter mt-1 mb-7">
                                {totalBookings ?? 0}
                            </p>

                            <Link href="/campaign">
                                <Button
                                    className="bg-white text-primary hover:bg-white/90 rounded-full font-bold shadow-none w-full border-0"
                                    variant="secondary"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    {tc("newBooking")}
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stat tiles row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-[1.5rem] bg-card p-5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)]">
                            <div className="p-2.5 rounded-2xl bg-primary/8 text-primary w-fit mb-3">
                                <Clock className="h-4 w-4" />
                            </div>
                            <p className="text-2xl font-black text-foreground">
                                {activeBookings ?? 0}
                            </p>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-1">
                                {t("active")}
                            </p>
                        </div>

                        <div
                            className={`rounded-[1.5rem] p-5 ${hasAwaitingPayment ? "bg-amber-50 shadow-[0_8px_30px_-8px_rgba(245,158,11,0.2)]" : "bg-card shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)]"}`}
                        >
                            <div
                                className={`p-2.5 rounded-2xl w-fit mb-3 ${hasAwaitingPayment ? "bg-amber-100 text-amber-600" : "bg-primary/8 text-primary"}`}
                            >
                                <CreditCard className="h-4 w-4" />
                            </div>
                            <p
                                className={`text-2xl font-black ${hasAwaitingPayment ? "text-amber-700" : "text-foreground"}`}
                            >
                                {awaitingPayment ?? 0}
                            </p>
                            <p
                                className={`text-xs font-semibold uppercase tracking-wide mt-1 ${hasAwaitingPayment ? "text-amber-600" : "text-muted-foreground"}`}
                            >
                                {t("awaitingPayment")}
                            </p>
                        </div>
                    </div>

                    {/* Total spent */}
                    <div className="rounded-[1.5rem] bg-card p-5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                                {t("totalSpent")}
                            </p>
                            <p className="text-xl font-black text-foreground">
                                {totalSpent.toLocaleString()}{" "}
                                <span className="text-sm font-bold text-muted-foreground">
                                    MAD
                                </span>
                            </p>
                        </div>
                        <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* ── CENTER COLUMN ── */}
                <div className="rounded-[2rem] bg-card shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-border/40">
                        <div>
                            <h2 className="text-sm font-bold text-foreground">
                                {t("recentBookings")}
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {recentBookings?.length ?? 0} recent entries
                            </p>
                        </div>
                        <Link href="/requests">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary font-bold text-xs rounded-full px-4"
                            >
                                {tc("viewAll")}
                            </Button>
                        </Link>
                    </div>

                    {!recentBookings || recentBookings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                            <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
                                <FileText className="h-6 w-6 text-muted-foreground/40" />
                            </div>
                            <p className="text-sm font-bold text-foreground">
                                {t("noBookingsYet")}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 mb-4">
                                {t("createFirst")}
                            </p>
                            <Link href="/campaign">
                                <Button size="sm" className="rounded-full font-bold">
                                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                                    {tc("newBooking")}
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y divide-border/40">
                            {recentBookings.map((booking: any) => (
                                <Link
                                    key={booking.id}
                                    href={`/requests/${booking.id}`}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors"
                                >
                                    {/* Resource avatar */}
                                    <div className="h-11 w-11 rounded-2xl bg-muted shrink-0 overflow-hidden">
                                        {booking.resources?.image_url ? (
                                            <img
                                                src={booking.resources.image_url}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center">
                                                <FileText className="h-4 w-4 text-muted-foreground/50" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-foreground truncate">
                                            {booking.resources?.name ||
                                                `#${booking.id.slice(0, 8)}`}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {format(
                                                new Date(booking.created_at),
                                                "MMM d, yyyy",
                                                { locale: getDateLocale(locale) }
                                            )}
                                        </p>
                                    </div>

                                    {/* Right: badge + price */}
                                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                                        <Badge
                                            variant={getStatusBadgeVariant(booking.status)}
                                            className="capitalize"
                                        >
                                            {tc(booking.status)}
                                        </Badge>
                                        <span className="text-xs font-mono font-bold text-muted-foreground">
                                            {booking.total_price?.toLocaleString()} MAD
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── RIGHT COLUMN ── */}
                <div className="flex flex-col gap-4">
                    {/* Calendar */}
                    <BookingCalendar bookedDates={bookedDates} />

                    {/* Quick access tiles */}
                    <div className="rounded-[2rem] bg-card shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] p-5">
                        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                            Quick Access
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {quickLinks.map((link) => (
                                <Link key={link.href} href={link.href}>
                                    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted hover:bg-primary/8 hover:text-primary transition-all duration-200 group cursor-pointer">
                                        <link.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors text-center leading-tight">
                                            {link.label}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
