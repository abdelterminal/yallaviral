import { createClient } from "@/utils/supabase/server";
import { AdminDeliverablesPanel } from "@/components/admin/AdminDeliverablesPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, DollarSign } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminBookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) notFound();

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") notFound();

    // Fetch booking with relations
    const { data: booking } = await supabase
        .from("bookings")
        .select(`
            *,
            resources (name, type, image_url),
            profiles (full_name, email)
        `)
        .eq("id", id)
        .single();

    if (!booking) notFound();

    // Fetch deliverables
    const { data: deliverables } = await supabase
        .from("deliverables")
        .select("*")
        .eq("booking_id", id)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <Link href="/admin/bookings" className="text-muted-foreground hover:text-primary text-sm font-medium flex items-center gap-1 mb-4 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Bookings
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                            Booking #{booking.id.slice(0, 8)}
                            <Badge variant="secondary" className="uppercase tracking-wider text-xs">{booking.status}</Badge>
                        </h2>
                        <p className="text-muted-foreground mt-1">
                            {booking.profiles?.full_name} • {booking.profiles?.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-black/40 border-white/10">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold">Client</p>
                            <p className="text-white font-bold">{booking.profiles?.full_name || "—"}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-black/40 border-white/10">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold">Total</p>
                            <p className="text-emerald-400 font-bold font-mono">{booking.total_price?.toFixed(2)} MAD</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-black/40 border-white/10">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase font-bold">Shoot Date</p>
                            <p className="text-white font-bold">{format(new Date(booking.start_time), "PPP")}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Deliverables Panel */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-bold text-white">Deliverables</CardTitle>
                </CardHeader>
                <CardContent>
                    <AdminDeliverablesPanel
                        bookingId={booking.id}
                        deliverables={deliverables || []}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
