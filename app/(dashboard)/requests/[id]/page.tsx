import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock, Download, FileText, CheckCircle2, Circle, PlayCircle, MessageSquare, Zap } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { InvoiceTemplate } from "@/components/invoice/InvoiceTemplate";

// Force dynamic rendering for this page since it depends on params
export const dynamic = "force-dynamic";

export default async function CampaignDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    // 1. Authenticate user FIRST
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        notFound();
    }

    // 2. Single scoped query — only fetch bookings belonging to this user
    const { data: booking } = await supabase
        .from("bookings")
        .select(`
            *,
            resources (
                name,
                type,
                hourly_rate,
                image_url
            ),
            profiles (
                full_name,
                email
            )
        `)
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

    if (!booking) {
        notFound();
    }

    // 3. Fetch campaign status logs from DB
    const { data: statusLogs } = await supabase
        .from("campaign_status_logs")
        .select("*")
        .eq("booking_id", id)
        .order("created_at", { ascending: true });

    // 4. Fetch deliverables
    const { data: deliverables } = await supabase
        .from("deliverables")
        .select("*")
        .eq("booking_id", id)
        .order("created_at", { ascending: false });

    // Map DB status logs to timeline steps
    const allStages = [
        { key: "order_placed", title: "Order Placed" },
        { key: "scripting", title: "Scripting" },
        { key: "filming", title: "Filming" },
        { key: "editing", title: "Editing" },
        { key: "ready", title: "Ready for Download" },
    ];

    const completedStatuses = new Set((statusLogs || []).map(log => log.status));

    const steps = allStages.map((stage, index) => {
        const log = (statusLogs || []).find(l => l.status === stage.key);
        const isCompleted = completedStatuses.has(stage.key);

        // Find the latest completed stage to determine "current"
        let lastCompletedIndex = -1;
        allStages.forEach((s, i) => {
            if (completedStatuses.has(s.key)) lastCompletedIndex = i;
        });

        const isCurrent = !isCompleted && index === lastCompletedIndex + 1;

        return {
            id: index + 1,
            title: stage.title,
            date: log?.created_at || null,
            status: isCompleted ? "completed" : isCurrent ? "current" : "upcoming",
        };
    });

    return (
        <div className="text-white space-y-8 pb-12 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Link href="/requests" className="hover:text-primary transition-colors flex items-center gap-1 text-sm font-medium">
                            <ArrowLeft className="h-4 w-4" /> Back to Campaigns
                        </Link>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            Campaign #{booking.id.slice(0, 8)}
                        </h1>
                        <Badge variant={booking.status === 'completed' ? 'default' : 'secondary'} className="text-sm px-3 py-1 font-bold uppercase tracking-wider">
                            {booking.status}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Created on {format(new Date(booking.created_at), "PPP")} • <span className="text-emerald-400 font-mono font-bold">{booking.total_price?.toFixed(2)} MAD</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <InvoiceTemplate data={{
                        bookingId: booking.id,
                        clientName: user.user_metadata?.full_name || user.email?.split('@')[0] || "Client",
                        clientEmail: user.email || "",
                        resourceName: booking.resources?.name || "Content Production",
                        resourceRate: booking.resources?.hourly_rate || 0,
                        shootDate: booking.start_time || booking.created_at,
                        totalPrice: booking.total_price || 0,
                        status: booking.status,
                        createdAt: booking.created_at,
                    }} />
                    <Button variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 hover:text-white font-medium">
                        <MessageSquare className="mr-2 h-4 w-4" /> Support
                    </Button>
                    {booking.status === 'completed' && (
                        <Button className="font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)] bg-primary text-white hover:bg-primary/90">
                            <Download className="mr-2 h-4 w-4" /> Download Assets
                        </Button>
                    )}
                </div>
            </div>

            {/* Payment Banner */}
            {booking.status === "confirmed" && booking.payment_status === "unpaid" && (
                <div className="rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-lg">Your booking is approved! 🎉</h3>
                            <p className="text-sm text-muted-foreground">Complete payment to start production.</p>
                        </div>
                    </div>
                    <Link href={`/checkout/${booking.id}`}>
                        <Button size="lg" className="font-bold text-base px-8 shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transition-all rounded-xl whitespace-nowrap">
                            Pay Now → {booking.total_price?.toFixed(2)} MAD
                        </Button>
                    </Link>
                </div>
            )}
            {booking.payment_status === "pending" && (
                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/5 backdrop-blur-xl p-4 flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
                    <p className="text-sm text-yellow-400 font-medium">Payment under review — we'll confirm shortly.</p>
                </div>
            )}
            {booking.payment_status === "paid" && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-xl p-4 flex items-center gap-3">
                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-emerald-400 font-medium">Payment confirmed ✓</p>
                </div>
            )}
            {booking.status === "rejected" && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/5 backdrop-blur-xl p-6 space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                            <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-red-400 text-base">Booking Rejected</h3>
                            {booking.rejection_reason && (
                                <p className="text-sm text-white/80 mt-1 leading-relaxed">
                                    &ldquo;{booking.rejection_reason}&rdquo;
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                                This booking will be automatically removed in 48 hours. You can submit a new booking anytime.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Visual Timeline */}
            <Card className="bg-black/40 border-white/10 backdrop-blur-xl overflow-hidden">
                <CardContent className="p-8">
                    <div className="relative">
                        {/* Progress Bar Background (Desktop) */}
                        <div className="absolute top-5 left-0 w-full h-1 bg-white/10 hidden md:block rounded-full" />

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
                            {steps.map((step, index) => {
                                const isCompleted = step.status === "completed";
                                const isCurrent = step.status === "current";

                                return (
                                    <div key={step.id} className="flex flex-row md:flex-col items-center gap-4 md:gap-4 w-full text-left md:text-center group">
                                        <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 ${isCompleted ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.5)]" :
                                            isCurrent ? "bg-black border-primary text-primary ring-4 ring-primary/20 scale-110 shadow-[0_0_20px_rgba(124,58,237,0.3)]" :
                                                "bg-black border-white/10 text-muted-foreground"
                                            }`}>
                                            {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className={`font-bold text-sm mb-1 ${isCurrent ? "text-primary scale-105" : "text-white"}`}>{step.title}</p>
                                            <p className="text-xs text-muted-foreground font-mono">{step.date ? format(new Date(step.date), "MMM d") : "Pending"}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tabs Content */}
            <Tabs defaultValue="overview" className="space-y-6">
                <div className="border-b border-white/10 pb-1">
                    <TabsList className="bg-transparent p-0 h-auto space-x-6">
                        <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-2 py-3 font-bold transition-all text-muted-foreground hover:text-white">Overview</TabsTrigger>
                        <TabsTrigger value="deliverables" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-2 py-3 font-bold transition-all text-muted-foreground hover:text-white">Deliverables</TabsTrigger>
                        <TabsTrigger value="activity" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-2 py-3 font-bold transition-all text-muted-foreground hover:text-white">Activity Log</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Left Column: Details */}
                        <div className="md:col-span-2 space-y-6">
                            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-xl font-bold">
                                        <FileText className="h-5 w-5 text-primary" /> Creative Brief
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-bold">Shoot Date</p>
                                            <p className="font-bold flex items-center gap-2 text-lg">
                                                <Calendar className="h-4 w-4 text-primary" />
                                                {format(new Date(booking.start_time), "PPP")}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-bold">Time</p>
                                            <p className="font-bold flex items-center gap-2 text-lg">
                                                <Clock className="h-4 w-4 text-primary" />
                                                {format(new Date(booking.start_time), "p")}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Project Notes</p>
                                        <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-sm leading-relaxed shadow-inner">
                                            {booking.notes || "No additional notes provided."}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Resources */}
                        <div className="space-y-6">
                            <Card className="bg-black/40 border-white/10 backdrop-blur-sm h-full">
                                <CardHeader>
                                    <CardTitle className="text-lg font-bold">Selected Talent</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                                        <div className="h-16 w-16 rounded-full bg-muted overflow-hidden ring-2 ring-white/10">
                                            {booking.resources?.image_url ? (
                                                <img src={booking.resources.image_url} alt={booking.resources.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-white/10 text-xs text-muted-foreground">No Img</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-white">{booking.resources?.name || "Unknown"}</p>
                                            <Badge variant="outline" className="mt-1 border-primary/20 text-primary bg-primary/10">Content Creator</Badge>
                                        </div>
                                    </div>

                                    <Separator className="my-6 bg-white/10" />

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Payment Summary</h4>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Creator Rate</span>
                                            <span className="font-mono">{booking.resources?.hourly_rate} MAD/hr</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground">Service Fee</span>
                                            <span className="font-mono">Included</span>
                                        </div>
                                        <Separator className="bg-white/10" />
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="font-bold text-white">Total</span>
                                            <span className="font-black text-xl text-emerald-400">{booking.total_price?.toFixed(2)} MAD</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="deliverables" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {deliverables && deliverables.length > 0 ? (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {deliverables.map((d: any) => (
                                <Card key={d.id} className="bg-black/40 border-white/10 hover:border-primary/30 transition-colors group">
                                    <CardContent className="p-5 space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                                                {d.file_type?.startsWith("video/") ? (
                                                    <PlayCircle className="h-5 w-5 text-primary" />
                                                ) : (
                                                    <Download className="h-5 w-5 text-primary" />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-bold text-white truncate">{d.file_name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {d.file_size ? `${(d.file_size / (1024 * 1024)).toFixed(1)} MB` : "—"} • {d.created_at ? format(new Date(d.created_at), "MMM d") : ""}
                                                </p>
                                            </div>
                                        </div>
                                        <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="block">
                                            <Button size="sm" className="w-full font-bold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                                                <Download className="h-4 w-4 mr-2" /> Download
                                            </Button>
                                        </a>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card className="bg-black/40 border-white/10 py-16 border-dashed">
                            <CardContent className="flex flex-col items-center justify-center text-center space-y-6">
                                <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                    <PlayCircle className="h-10 w-10 text-muted-foreground/50" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white">No deliverables yet</h3>
                                    <p className="text-muted-foreground max-w-sm mx-auto">
                                        Your content is currently in production. You will be notified via email when your first draft is ready for review.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="activity" className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Card className="bg-black/40 border-white/10 backdrop-blur-xl">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl font-black text-white">Activity Log</CardTitle>
                            <CardDescription className="text-muted-foreground">Tracking every milestone of your production</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-8 relative before:absolute before:inset-0 before:left-[19px] before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-white/5 before:to-transparent">
                                {/* Entry: Order Placed (always present) */}
                                <div className="relative pl-12 group">
                                    <div className="absolute left-0 top-1.5 h-10 w-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center z-10 shadow-[0_0_20px_rgba(124,58,237,0.3)] transition-transform group-hover:scale-110">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-colors">
                                        <div className="space-y-1">
                                            <h4 className="font-bold text-white text-lg">Order Placed</h4>
                                            <p className="text-muted-foreground text-sm leading-relaxed">Your booking #{booking.id.slice(0, 8)} has been submitted for review.</p>
                                        </div>
                                        <div className="shrink-0">
                                            <span className="text-xs font-mono font-bold text-primary px-2 py-1 rounded bg-primary/10 border border-primary/20">
                                                {format(new Date(booking.created_at), "MMM d, HH:mm")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dynamic entries from statusLogs */}
                                {statusLogs && statusLogs.length > 0 ? (
                                    statusLogs.map((log: any, index: number) => {
                                        const statusLabels: Record<string, string> = {
                                            order_placed: "Order Confirmed",
                                            scripting: "Scripting Phase",
                                            filming: "Filming in Progress",
                                            editing: "Editing & Post-Production",
                                            ready: "Ready for Download",
                                        };
                                        const title = statusLabels[log.status] || log.status.replace(/_/g, " ");
                                        return (
                                            <div key={log.id || index} className="relative pl-12 group">
                                                <div className="absolute left-0 top-1.5 h-10 w-10 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-transform group-hover:scale-110">
                                                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                                </div>
                                                <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/5 transition-colors">
                                                    <div className="space-y-1">
                                                        <h4 className="font-bold text-white text-lg capitalize">{title}</h4>
                                                        {log.notes && <p className="text-muted-foreground text-sm leading-relaxed">{log.notes}</p>}
                                                    </div>
                                                    <div className="shrink-0">
                                                        <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                                                            {format(new Date(log.created_at), "MMM d, HH:mm")}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="relative pl-12 group">
                                        <div className="absolute left-0 top-1.5 h-10 w-10 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center z-10">
                                            <Clock className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                            <p className="text-muted-foreground text-sm">Waiting for the next update from our team...</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
