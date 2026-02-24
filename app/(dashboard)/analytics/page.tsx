import { HolographicCard } from "@/components/dashboard/HolographicCard";
import { Coins, CheckCircle2, Clock, XCircle, CalendarDays, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
    const t = await getTranslations('Nav');
    return {
        title: `${t('analytics')} - YallaViral`,
        description: "Your booking and spending summary.",
    };
}

export default async function AnalyticsPage() {
    const supabase = await createClient();
    const t = await getTranslations('Analytics');
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch all user bookings in one query
    const { data: bookings } = await supabase
        .from("bookings")
        .select("total_price, status")
        .eq("user_id", user.id);

    const allBookings = bookings || [];

    // Compute metrics
    const totalBookings = allBookings.length;
    const totalSpent = allBookings.reduce((acc, b) => acc + (b.total_price || 0), 0);
    const completed = allBookings.filter(b => b.status === "confirmed" || b.status === "completed").length;
    const inProgress = allBookings.filter(b => b.status === "pending").length;
    const rejected = allBookings.filter(b => b.status === "rejected").length;
    const avgOrderValue = totalBookings > 0 ? Math.round(totalSpent / totalBookings) : 0;

    const stats = [
        {
            title: t('totalSpent'),
            value: `${totalSpent.toLocaleString()} MAD`,
            icon: Coins,
            glow: "124, 58, 237", // purple
            description: t('allTimeSpending'),
        },
        {
            title: t('completedOrders'),
            value: completed,
            icon: CheckCircle2,
            glow: "34, 197, 94", // green
            description: t('successfullyDelivered'),
        },
        {
            title: t('inProgress'),
            value: inProgress,
            icon: Clock,
            glow: "234, 179, 8", // amber
            description: t('awaitingConfirmation'),
        },
        {
            title: t('rejected'),
            value: rejected,
            icon: XCircle,
            glow: "239, 68, 68", // red
            description: t('declinedBookings'),
        },
        {
            title: t('totalBookings'),
            value: totalBookings,
            icon: CalendarDays,
            glow: "59, 130, 246", // blue
            description: t('allTimeOrders'),
        },
        {
            title: t('avgOrderValue'),
            value: `${avgOrderValue.toLocaleString()} MAD`,
            icon: TrendingUp,
            glow: "168, 85, 247", // violet
            description: t('perBookingAverage'),
        },
    ];

    return (
        <div className="space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight text-white">
                    {t('title')}
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    {t('subtitle')}
                </p>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <HolographicCard key={stat.title} glowColor={stat.glow} className="p-6">
                            <div className="flex flex-row items-center justify-between pb-2">
                                <h3 className="tracking-tight text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </h3>
                                <Icon className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <div className="mt-2">
                                <div className="text-3xl font-mono font-bold text-white">
                                    {stat.value}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </div>
                        </HolographicCard>
                    );
                })}
            </div>
        </div>
    );
}
