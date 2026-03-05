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
        <div className="space-y-4">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((filter) => {
                    const count = filter === "all" ? bookings.length : bookings.filter(b => b.status === filter).length;
                    return (
                        <button
                            key={filter}
                            onClick={() => setStatusFilter(filter)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all capitalize ${
                                statusFilter === filter
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                            }`}
                        >
                            {filter} ({count})
                        </button>
                    );
                })}
            </div>

        <div className="rounded-md border border-border bg-card backdrop-blur-sm">
            <Table>
                <TableHeader>
                    <TableRow className="border-border hover:bg-muted/50">
                        <TableHead className="text-foreground">ID</TableHead>
                        <TableHead className="text-foreground">Client</TableHead>
                        <TableHead className="text-foreground">Date</TableHead>
                        <TableHead className="text-foreground">Amount</TableHead>
                        <TableHead className="text-foreground">Status</TableHead>
                        <TableHead className="text-foreground">Payment</TableHead>
                        <TableHead className="text-right text-foreground">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filtered.length === 0 ? (
                        <TableRow className="hover:bg-transparent border-none">
                            <TableCell colSpan={7} className="h-[300px] text-center">
                                <div className="flex flex-col items-center justify-center text-muted-foreground animate-in fade-in duration-700">
                                    <div className="h-16 w-16 mb-4 rounded-full bg-muted/50 border border-border flex items-center justify-center">
                                        <Inbox className="h-8 w-8 opacity-50 text-foreground" />
                                    </div>
                                    <p className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground">
                                        No bookings found
                                    </p>
                                    <p className="text-xs text-muted-foreground/60 mt-2 max-w-[200px]">
                                        There are no operations in this table yet.
                                    </p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        filtered.map((booking) => (
                            <TableRow key={booking.id} className="border-border hover:bg-muted/50">
                                <TableCell className="font-mono text-xs">{booking.id.slice(0, 8)}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">{booking.profiles?.full_name || 'Unknown'}</span>
                                        <span className="text-xs text-muted-foreground">{booking.profiles?.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {format(new Date(booking.created_at), "MMM do, yyyy", { locale: dateFnsLocale })}
                                </TableCell>
                                <TableCell className="font-mono text-emerald-600">
                                    {booking.total_price?.toFixed(2)} MAD
                                </TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(booking.status)} className="capitalize">
                                        {booking.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {booking.payment_status === 'paid' ? (
                                        <Badge variant="paid">Paid</Badge>
                                    ) : booking.payment_status === 'pending' ? (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-500/10 text-xs font-bold h-7 px-2"
                                            onClick={() => handleMarkPaid(booking.id)}
                                            disabled={!!processingId}
                                        >
                                            {processingId === booking.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Banknote className="h-3 w-3 mr-1" />}
                                            Confirm Pay
                                        </Button>
                                    ) : booking.status === 'confirmed' ? (
                                        <Badge variant="unpaid">Unpaid</Badge>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">—</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {booking.status === 'pending' && (
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 h-8 w-8 p-0"
                                                onClick={() => handleAction(booking.id, 'approve')}
                                                disabled={!!processingId}
                                            >
                                                {processingId === booking.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                                            </Button>
                                            <RejectBookingDialog bookingId={booking.id} clientName={booking.profiles?.full_name} />
                                        </div>
                                    )}
                                    <Link href={`/admin/bookings/${booking.id}`}>
                                        <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10 h-8 px-2 text-xs font-bold">
                                            <ExternalLink className="h-3 w-3 mr-1" /> Manage
                                        </Button>
                                    </Link>
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
