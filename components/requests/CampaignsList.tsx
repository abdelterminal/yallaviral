"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Activity, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { confirmBooking } from "@/actions/confirm-booking";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface CampaignsListProps {
    bookings: any[];
}

export function CampaignsList({ bookings }: CampaignsListProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleApprove = async (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Prevent link navigation
        startTransition(async () => {
            await confirmBooking(id);
            router.refresh();
        });
    };

    return (
        <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {bookings.map((booking) => (
                <Link key={booking.id} href={`/requests/${booking.id}`}>
                    <Card className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-primary/50 hover:bg-white/5 transition-all group cursor-pointer border-white/10 bg-black/40 backdrop-blur-md">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors">Campaign #{booking.id.slice(0, 8)}</h3>
                                <Badge
                                    variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
                                    className={`capitalize border-white/10 ${booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : ''}`}
                                >
                                    {booking.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(booking.created_at), "MMM do, yyyy")}
                                </div>
                                <div className="flex items-center gap-1 font-mono text-emerald-400">
                                    <div className="h-3 w-3" />
                                    Price: {booking.total_price?.toFixed(2)} MAD
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {booking.status === 'pending' && (
                                <Button
                                    size="sm"
                                    onClick={(e) => handleApprove(e, booking.id)}
                                    disabled={isPending}
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    {isPending ? "Approving..." : "Approve"}
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full md:w-auto border-white/10 hover:bg-primary hover:text-white transition-all font-bold"
                            >
                                View Details
                            </Button>
                        </div>
                    </Card>
                </Link>
            ))}
        </div>
    );
}
