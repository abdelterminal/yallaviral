"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Inbox, ExternalLink, Banknote } from "lucide-react";
import { format } from "date-fns";
import { confirmBooking } from "@/actions/confirm-booking";
import { adminUpdatePaymentStatus } from "@/actions/mark-payment";
import { RejectBookingDialog } from "@/components/admin/RejectBookingDialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { useLocale } from "next-intl";
import { getDateLocale } from "@/utils/date-locale";
import { getStatusBadgeVariant } from "@/lib/utils";

interface BookingsTableProps {
    bookings: any[];
}

const STATUS_FILTERS = ["all", "pending", "confirmed", "rejected", "completed"] as const;
type StatusFilter = typeof STATUS_FILTERS[number];

export function BookingsTable({ bookings }: BookingsTableProps) {
    const router = useRouter();
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const locale = useLocale();
    const dateFnsLocale = getDateLocale(locale);

    const filtered = statusFilter === "all" ? bookings : bookings.filter(b => b.status === statusFilter);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        setProcessingId(id);
        try {
            if (action === 'approve') {
                await confirmBooking(id);
                toast.success("Booking Approved", { description: "Client has been notified." });
            }
            router.refresh();
        } catch (error) {
            toast.error("Error", { description: "Something went wrong." });
        } finally {
            setProcessingId(null);
        }
    };

    const handleMarkPaid = async (id: string) => {
        setProcessingId(id);
        try {
            await adminUpdatePaymentStatus(id, "paid");
            toast.success("Payment Confirmed", { description: "Booking marked as paid." });
            router.refresh();
        } catch {
            toast.error("Error", { description: "Something went wrong." });
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((filter) => {
                    const count = filter === "all" ? bookings.length : bookings.filter(b => b.status === filter).length;
                    const isActive = statusFilter === filter;
                    return (
                        <button
                            key={filter}
                            onClick={() => setStatusFilter(filter)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] text-xs font-semibold transition-all duration-150 capitalize hover:scale-[1.02] ${
                                isActive
                                    ? "bg-primary/15 text-primary border border-primary/25 shadow-[0_0_12px_-2px_hsl(var(--primary)/0.2)]"
                                    : "bg-muted/40 text-muted-foreground border border-border/20 hover:bg-muted/70 hover:text-foreground"
                            }`}
                        >
                            {filter}
                            <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Table container — no grid borders */}
            <div className="rounded-[16px] bg-card overflow-hidden shadow-[0_8px_32px_-4px_rgba(0,0,0,0.45)]">
                {/* Table header row — subtle bg tint */}
                <div className="px-6 py-4 bg-muted/20">
                    <div className="grid grid-cols-[0.5fr_1.5fr_1fr_0.8fr_0.8fr_0.8fr_1fr] gap-4 items-center">
                        {["ID", "Client", "Date", "Amount", "Status", "Payment", ""].map((h, i) => (
                            <span key={i} className={`text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60 ${i === 6 ? "text-right" : ""}`}>{h}</span>
                        ))}
                    </div>
                </div>

            <Table>
                <TableHeader className="sr-only">
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filtered.length === 0 ? (
                        <TableRow className="hover:bg-transparent border-none">
                            <TableCell colSpan={7} className="h-[260px] text-center">
                                <div className="flex flex-col items-center justify-center gap-3 animate-in fade-in duration-500">
                                    <div className="h-14 w-14 rounded-[14px] bg-muted/50 flex items-center justify-center">
                                        <Inbox className="h-6 w-6 text-muted-foreground/40" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">No bookings found</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">No entries match this filter yet.</p>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        filtered.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell>
                                    <span className="font-mono text-[11px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                                        #{booking.id.slice(0, 8)}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-medium text-foreground text-sm">{booking.profiles?.full_name || 'Unknown'}</span>
                                        <span className="text-[11px] text-muted-foreground">{booking.profiles?.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {format(new Date(booking.created_at), "MMM d, yyyy", { locale: dateFnsLocale })}
                                </TableCell>
                                <TableCell>
                                    <span className="font-mono text-sm font-semibold text-accent">
                                        {booking.total_price?.toFixed(2)} MAD
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(booking.status)} className="capitalize text-[11px]">
                                        {booking.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {booking.payment_status === 'paid' ? (
                                        <Badge variant="paid" className="text-[11px]">Paid</Badge>
                                    ) : booking.payment_status === 'pending' ? (
                                        <button
                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 px-2.5 py-1 rounded-[8px] transition-all hover:scale-[1.02] disabled:opacity-50"
                                            onClick={() => handleMarkPaid(booking.id)}
                                            disabled={!!processingId}
                                        >
                                            {processingId === booking.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Banknote className="h-3 w-3" />}
                                            Confirm
                                        </button>
                                    ) : booking.status === 'confirmed' ? (
                                        <Badge variant="unpaid" className="text-[11px]">Unpaid</Badge>
                                    ) : (
                                        <span className="text-xs text-muted-foreground/40">—</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end items-center gap-1.5">
                                        {booking.status === 'pending' && (
                                            <>
                                                <button
                                                    className="h-7 w-7 rounded-[8px] flex items-center justify-center text-accent bg-accent/10 hover:bg-accent/20 border border-accent/20 transition-all hover:scale-[1.05] disabled:opacity-50"
                                                    onClick={() => handleAction(booking.id, 'approve')}
                                                    disabled={!!processingId}
                                                    title="Approve"
                                                >
                                                    {processingId === booking.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                                                </button>
                                                <RejectBookingDialog bookingId={booking.id} clientName={booking.profiles?.full_name} />
                                            </>
                                        )}
                                        <Link href={`/admin/bookings/${booking.id}`}>
                                            <button className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 hover:bg-primary/20 border border-primary/20 px-2.5 py-1 rounded-[8px] transition-all hover:scale-[1.02]">
                                                <ExternalLink className="h-3 w-3" /> Manage
                                            </button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            </div>
        </div>
    );
}
