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

interface BookingsTableProps {
    bookings: any[];
}

export function BookingsTable({ bookings }: BookingsTableProps) {
    const router = useRouter();
    const [processingId, setProcessingId] = useState<string | null>(null);
    const locale = useLocale();
    const dateFnsLocale = getDateLocale(locale);

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
                    {bookings.length === 0 ? (
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
                        bookings.map((booking) => (
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
                                    <Badge
                                        variant="outline"
                                        className={`capitalize ${booking.status === 'confirmed'
                                            ? 'border-emerald-500/50 text-emerald-600 bg-emerald-50'
                                            : booking.status === 'rejected'
                                                ? 'border-red-500/50 text-red-500 bg-red-500/10'
                                                : 'border-yellow-500/50 text-yellow-500 bg-yellow-500/10'
                                            }`}
                                    >
                                        {booking.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {booking.payment_status === 'paid' ? (
                                        <Badge variant="outline" className="border-emerald-500/50 text-emerald-600 bg-emerald-50">Paid</Badge>
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
                                        <Badge variant="outline" className="border-orange-500/50 text-orange-400 bg-orange-500/10">Unpaid</Badge>
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
        </div >
    );
}
