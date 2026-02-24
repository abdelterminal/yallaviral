"use client";

import { useCampaignStore } from "@/store/useCampaignStore";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

interface CalendarStepProps {
    onNext: () => void;
    onBack: () => void;
}

const TIME_SLOTS = [
    "09:00 AM", "10:00 AM", "11:00 AM",
    "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
];

import { getBookedSlots } from "@/actions/check-availability";
import { useState, useEffect } from "react";

export function CalendarStep({ onNext, onBack }: CalendarStepProps) {
    const { date, setDate, time, setTime, selectedStudio } = useCampaignStore();
    const [bookedSlots, setBookedSlots] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const t = useTranslations('Campaign');
    const tc = useTranslations('Common');

    useEffect(() => {
        async function fetchAvailability() {
            if (date && selectedStudio) {
                setIsLoading(true);
                const slots = await getBookedSlots(selectedStudio.id, date);
                setBookedSlots(slots || []); // Ensure array
                setIsLoading(false);
            } else {
                setBookedSlots([]);
            }
        }
        fetchAvailability();
    }, [date, selectedStudio]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="flex items-center gap-2 text-3xl font-black tracking-tight">
                    {t('scheduleTitle')} <CalendarIcon className="h-8 w-8 text-primary" />
                </h2>
                <p className="text-muted-foreground text-lg">
                    {t('scheduleSubtitle')}
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-[1fr_300px]">
                {/* Date Picker */}
                <Card className="p-6 flex flex-col items-center justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border shadow p-4"
                        disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                    />
                </Card>

                {/* Time Selection */}
                <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        {t('availableSlots')}
                        {isLoading && <span className="text-xs text-muted-foreground animate-pulse ml-2">{t('checking')}</span>}
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {TIME_SLOTS.map((slot) => {
                            const isBooked = bookedSlots.includes(slot);
                            return (
                                <Button
                                    key={slot}
                                    variant={time === slot ? "default" : "outline"}
                                    disabled={!date || isBooked}
                                    className={cn(
                                        "w-full font-medium transition-all relative overflow-hidden",
                                        time === slot && "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105 ring-2 ring-primary ring-offset-2 ring-offset-background",
                                        isBooked && "opacity-50 cursor-not-allowed bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-500"
                                    )}
                                    onClick={() => setTime(slot)}
                                >
                                    {slot}
                                    {isBooked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-[1px] text-[10px] font-bold uppercase tracking-widest text-destructive">
                                            {t('booked')}
                                        </div>
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                    {date && (
                        <div className="mt-8 p-4 rounded-lg bg-muted text-center animate-in fade-in">
                            <p className="text-sm text-muted-foreground mb-1">{t('youSelected')}</p>
                            <p className="font-bold text-lg text-primary">
                                {format(date, "MMMM do, yyyy")}
                            </p>
                            {time && (
                                <p className="font-bold text-lg text-primary">
                                    {t('at')} {time}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-between pt-8 border-t">
                <Button variant="ghost" onClick={onBack}>
                    {tc('back')}
                </Button>
                <div className="flex items-center gap-6">
                    <Button
                        size="lg"
                        onClick={onNext}
                        disabled={!date || !time}
                        className="min-w-[150px] font-bold"
                    >
                        {tc('continue')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
