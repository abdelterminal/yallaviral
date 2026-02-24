"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Resource } from "@/types/database";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";
import { createBooking } from "@/actions/create-booking";

interface BookingSheetProps {
    resource: Resource;
    children: React.ReactNode;
}

export function BookingSheet({ resource, children }: BookingSheetProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [timeSlot, setTimeSlot] = useState<"morning" | "afternoon" | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const calculateTotal = () => {
        // Simplified logic: Morning/Afternoon = 4 hours
        return resource.hourly_rate * 4;
    };

    const handleBooking = async () => {
        if (!date || !timeSlot) return;
        setIsLoading(true);

        const res = await createBooking(resource.id, null, date, timeSlot, calculateTotal());

        if (res.success && 'bookingId' in res) {
            router.push(`/success?id=${res.bookingId}`);
        } else if (!res.success && 'error' in res) {
            alert("Booking failed: " + res.error);
            setIsLoading(false);
        } else {
            alert("Booking failed.");
            setIsLoading(false);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Book {resource.name}</SheetTitle>
                    <SheetDescription>
                        Select a date and time slot for your session.
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-6 py-6">
                    {/* Calendar Section */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4" /> Select Date
                        </h3>
                        <div className="rounded-md border mx-auto">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border"
                                disabled={(date) => date < new Date()}
                            />
                        </div>
                    </div>

                    {/* Time Slot Section */}
                    <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-medium flex items-center gap-2">
                            <Clock className="h-4 w-4" /> Select Time Slot
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Button
                                variant={timeSlot === "morning" ? "default" : "outline"}
                                className={cn("h-20 flex flex-col gap-1", timeSlot === "morning" && "border-primary")}
                                onClick={() => setTimeSlot("morning")}
                            >
                                <span className="font-bold text-lg">Morning</span>
                                <span className="text-xs opacity-70">09:00 - 13:00</span>
                            </Button>
                            <Button
                                variant={timeSlot === "afternoon" ? "default" : "outline"}
                                className={cn("h-20 flex flex-col gap-1", timeSlot === "afternoon" && "border-primary")}
                                onClick={() => setTimeSlot("afternoon")}
                            >
                                <span className="font-bold text-lg">Afternoon</span>
                                <span className="text-xs opacity-70">14:00 - 18:00</span>
                            </Button>
                        </div>
                    </div>

                    {/* Summary Section */}
                    {date && timeSlot && (
                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <h3 className="font-semibold">Booking Summary</h3>
                            <div className="flex justify-between text-sm">
                                <span>Resource:</span>
                                <span>{resource.name}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Date:</span>
                                <span>{format(date, "PPP")}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Time:</span>
                                <span className="capitalize">{timeSlot}</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between font-bold text-lg text-primary">
                                <span>Total:</span>
                                <span>{calculateTotal()} MAD</span>
                            </div>
                        </div>
                    )}
                </div>

                <SheetFooter>
                    <Button
                        className="w-full"
                        size="lg"
                        disabled={!date || !timeSlot || isLoading}
                        onClick={handleBooking}
                    >
                        {isLoading ? "Booking..." : `Request Booking ${date && timeSlot ? `• ${calculateTotal()} MAD` : ''}`}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
