import { createClient } from "@/utils/supabase/server";
import { BookingCalendar } from "@/components/dashboard/BookingCalendar";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { getDateLocale } from "@/utils/date-locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CalendarDays,
    CreditCard,
    FileText,
    Plus,
    TrendingUp,
    ArrowUpRight,
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

    // Last 7 days chart data from bookedDates
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d;
    });
    const chartData = last7Days.map((day) => ({
        label: format(day, "EEE", { locale: getDateLocale(locale) }),
        count: bookedDates.filter(
            (bd) =>
                bd.getDate() === day.getDate() &&
                bd.getMonth() === day.getMonth() &&
                bd.getFullYear() === day.getFullYear()
        ).length,
        isToday: day.toDateString() === new Date().toDateString(),
    }));
    const maxCount = Math.max(...chartData.map((d) => d.count), 1);

    return (
        <div className="animate-in fade-in duration-500 space-y-6">

            {/* ── OVERVIEW HEADER ── */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
                        {t("welcomeBack", { name: firstName })}
                    </p>
                    <h1 className="text-2xl font-black tracking-tight text-foreground">
                        {t("totalBookings")} Overview
                    </h1>
                </div>
                <Link href="/campaign">
                    <Button className="rounded-full font-bold shadow-none" size="sm">
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        {tc("newBooking")}
                    </Button>
                </Link>
            </div>

            {/* ── MAIN GRID ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* ── LEFT+CENTER (2/3) ── */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Stat cards row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Total Bookings */}
                        <div className="rounded-xl bg-card shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] p-6 hover:-translate-y-0.5 transition-all duration-200 hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.55)]">
                            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-4">
                                <div className="h-6 w-6 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <CalendarDays className="h-3.5 w-3.5 text-primary" />
                                </div>
                                {t("totalBookings")}
                            </div>
                            <p className="text-5xl font-black text-foreground tracking-tight">
                                {totalBookings ?? 0}
                            </p>
                            <div className="flex items-center gap-1 mt-3 text-emerald-400 text-xs font-semibold">
                                <ArrowUpRight className="h-3.5 w-3.5" />
                                <span>{activeBookings ?? 0} {t("active")}</span>
                            </div>
                        </div>

                        {/* Total Spent */}
                        <div className="rounded-xl bg-card shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] p-6 hover:-translate-y-0.5 transition-all duration-200 hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.55)]">
                            <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-4">
                                <div className="h-6 w-6 rounded-lg bg-secondary/20 flex items-center justify-center">
                                    <CreditCard className="h-3.5 w-3.5 text-secondary" />
                                </div>
                                {t("totalSpent")}
                            </div>
                            <p className="text-5xl font-black text-foreground tracking-tight">
                                {totalSpent > 0
                                    ? totalSpent >= 1000
                                        ? `${(totalSpent / 1000).toFixed(1)}k`
                                        : totalSpent.toLocaleString()
                                    : "0"}
                            </p>
                            <div className="flex items-center gap-1 mt-3 text-muted-foreground text-xs font-semibold">
                                <TrendingUp className="h-3.5 w-3.5 text-secondary/70" />
                                <span>MAD {t("active").toLowerCase()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Active bookings strip + avatar row */}
                    <div className="rounded-xl bg-card shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] p-6">
                        <p className="text-base font-bold text-foreground">
                            {activeBookings ?? 0} active booking{(activeBookings ?? 0) !== 1 ? "s" : ""} in progress
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5 mb-5">
                            {t("createFirst")}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                            {recentBookings && recentBookings.length > 0 ? (
                                <>
                                    {recentBookings.slice(0, 6).map((booking: any) => (
                                        <Link key={booking.id} href={`/requests/${booking.id}`}>
                                            <div className="h-10 w-10 rounded-full bg-muted overflow-hidden ring-2 ring-card hover:ring-primary/30 transition-all shrink-0">
                                                {booking.resources?.image_url ? (
                                                    <img
                                                        src={booking.resources.image_url}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary text-xs font-black">
                                                        {booking.resources?.name?.[0]?.toUpperCase() || "?"}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                    {(recentBookings?.length ?? 0) > 6 && (
                                        <Link href="/requests">
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-[10px] font-black text-muted-foreground ring-2 ring-card hover:ring-primary/30 transition-all">
                                                +{recentBookings!.length - 6}
                                            </div>
                                        </Link>
                                    )}
                                    <Link href="/requests" className="ml-1 flex items-center gap-1 text-sm font-bold text-primary hover:underline underline-offset-2 transition-all">
                                        {tc("viewAll")} <ArrowUpRight className="h-3.5 w-3.5" />
                                    </Link>
                                </>
                            ) : (
                                <Link href="/campaign">
                                    <Button size="sm" className="rounded-full font-bold">
                                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                                        {tc("newBooking")}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Activity chart */}
                    <div className="rounded-xl bg-card shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-bold text-foreground">
                                Booking Activity
                            </h3>
                            <span className="text-xs text-muted-foreground font-medium bg-muted px-2.5 py-1 rounded-lg">
                                Last 7 days
                            </span>
                        </div>
                        <p className="text-3xl font-black text-foreground tracking-tight mb-6">
                            {totalSpent.toLocaleString()}{" "}
                            <span className="text-base font-bold text-muted-foreground">MAD</span>
                        </p>
                        {/* Bar chart */}
                        <div className="flex items-end gap-2 h-28">
                            {chartData.map((day, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                    <div className="w-full flex items-end justify-center" style={{ height: "80px" }}>
                                        <div
                                            className={`w-full rounded-t-md transition-all duration-300 ${
                                                day.isToday
                                                    ? "bg-gradient-to-t from-primary to-secondary"
                                                    : day.count > 0
                                                    ? "bg-primary/40"
                                                    : "bg-muted/60"
                                            }`}
                                            style={{
                                                height: `${Math.max(6, (day.count / maxCount) * 80)}px`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-[10px] text-muted-foreground font-medium capitalize">
                                        {day.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PANEL (1/3) ── */}
                <div className="flex flex-col gap-6">

                    {/* Recent campaigns — like "Popular products" */}
                    <div className="rounded-xl bg-card shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4">
                            <h3 className="text-sm font-bold text-foreground">
                                {t("recentBookings")}
                            </h3>
                            <Link href="/requests">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-xs font-bold text-primary rounded-full px-3 h-7"
                                >
                                    {tc("viewAll")}
                                </Button>
                            </Link>
                        </div>

                        {!recentBookings || recentBookings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center px-5">
                                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                                    <FileText className="h-5 w-5 text-muted-foreground/40" />
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
                            <div className="flex flex-col">
                                {recentBookings.slice(0, 6).map((booking: any) => (
                                    <Link
                                        key={booking.id}
                                        href={`/requests/${booking.id}`}
                                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-muted shrink-0 overflow-hidden">
                                            {booking.resources?.image_url ? (
                                                <img
                                                    src={booking.resources.image_url}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <FileText className="h-4 w-4 text-muted-foreground/40" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-foreground truncate">
                                                {booking.resources?.name ||
                                                    `#${booking.id.slice(0, 8)}`}
                                            </p>
                                            <p className="text-xs text-muted-foreground font-mono">
                                                {booking.total_price?.toLocaleString()} MAD
                                            </p>
                                        </div>
                                        <Badge
                                            variant={getStatusBadgeVariant(booking.status)}
                                            className="text-[10px] shrink-0"
                                        >
                                            {tc(booking.status)}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {recentBookings && recentBookings.length > 0 && (
                            <div className="px-5 py-3">
                                <Link href="/requests" className="block w-full">
                                    <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-foreground rounded-xl h-8">
                                        View all campaigns
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Calendar */}
                    <BookingCalendar bookedDates={bookedDates} />
                </div>
            </div>
        </div>
    );
}
