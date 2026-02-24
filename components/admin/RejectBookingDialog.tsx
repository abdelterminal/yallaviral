"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { XCircle, Loader2, AlertTriangle } from "lucide-react";
import { rejectBooking } from "@/actions/reject-booking";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface RejectBookingDialogProps {
    bookingId: string;
    clientName?: string;
    children?: React.ReactNode;
}

export function RejectBookingDialog({ bookingId, clientName, children }: RejectBookingDialogProps) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleReject = async () => {
        if (reason.trim().length < 5) {
            toast.error("Please provide a reason (at least 5 characters)");
            return;
        }

        setIsLoading(true);
        try {
            const result = await rejectBooking(bookingId, reason.trim());
            if (result.success) {
                toast.success("Booking rejected", { description: "Client has been notified." });
                setOpen(false);
                setReason("");
                router.refresh();
            } else {
                toast.error("Error", { description: result.error });
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button size="sm" variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 px-2 text-xs font-medium">
                        <XCircle className="h-3 w-3 mr-1" /> Reject
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-white/10 text-white max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        Reject Booking
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        {clientName ? `Let ${clientName} know why their booking was rejected.` : "Provide a reason for this rejection."}
                        {" "}This will be visible to the client.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-2">
                    <Textarea
                        placeholder="e.g. The requested time slot is no longer available. Please rebook for another date."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 min-h-[100px] resize-none focus:border-red-500/50"
                        maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground mt-2 text-right">{reason.length}/500</p>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button variant="ghost" onClick={() => setOpen(false)} disabled={isLoading}
                        className="text-muted-foreground hover:text-white">
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={isLoading || reason.trim().length < 5}
                        className="bg-red-500/90 hover:bg-red-500 font-medium"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                        Reject Booking
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
