"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Clock, Coins, User, MapPin } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CampaignDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    booking: any;
}

export function CampaignDetailsModal({ isOpen, onClose, booking }: CampaignDetailsModalProps) {
    if (!booking) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] bg-black/90 backdrop-blur-xl border-white/10 text-white">
                <DialogHeader>
                    <div className="flex items-center justify-between mr-8">
                        <div>
                            <DialogTitle className="text-2xl font-black tracking-tight">Campaign #{booking.id.slice(0, 8)}</DialogTitle>
                            <DialogDescription className="text-muted-foreground mt-1">
                                Created on {format(new Date(booking.created_at), "PPP")}
                            </DialogDescription>
                        </div>
                        <Badge
                            className={`px-3 py-1 text-sm font-bold capitalize ${booking.status === "confirmed" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" :
                                booking.status === "pending" ? "bg-amber-500/20 text-amber-400 border-amber-500/50" :
                                    "bg-secondary text-secondary-foreground"
                                }`}
                        >
                            {booking.status}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1 p-3 rounded-lg bg-white/5 border border-white/10">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar className="h-3 w-3" /> Shoot Date
                            </span>
                            <span className="font-mono font-bold">{format(new Date(booking.start_time), "PPP")}</span>
                        </div>
                        <div className="flex flex-col gap-1 p-3 rounded-lg bg-white/5 border border-white/10">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <Clock className="h-3 w-3" /> Start Time
                            </span>
                            <span className="font-mono font-bold">{format(new Date(booking.start_time), "p")}</span>
                        </div>
                    </div>

                    {/* Service Details */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Service Breakdown</h4>
                        <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
                            {/* Creator / Model */}
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Content Creator</p>
                                        {/* Fallback if resources join isn't perfect, ideally we have resource name */}
                                        <p className="text-xs text-muted-foreground">{booking.resources?.name || "Selected Talent"}</p>
                                    </div>
                                </div>
                                <span className="font-mono text-sm">{booking.resources?.hourly_rate ? `${booking.resources.hourly_rate} MAD/hr` : "-"}</span>
                            </div>

                            {/* Location / Studio */}
                            <div className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Location</p>
                                        {/* We might need to fetch studio separately if not joined, assume generic studio for now if unknown */}
                                        <p className="text-xs text-muted-foreground">Main Podcast Studio</p>
                                    </div>
                                </div>
                                <span className="font-mono text-sm">-</span>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-white/10" />

                    {/* Total */}
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-lg font-bold text-white">Total Amount</span>
                        <div className="flex items-center gap-2 text-2xl font-black text-primary">
                            <Coins className="h-6 w-6" />
                            Price: {booking.total_price?.toFixed(2)} MAD
                        </div>
                    </div>

                    {/* Notes if any */}
                    {booking.notes && (
                        <div className="mt-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">
                            <span className="font-bold block mb-1">Notes:</span>
                            {booking.notes}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
