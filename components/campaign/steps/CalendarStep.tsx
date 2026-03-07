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

const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
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
                <Card className="p-8 flex flex-col items-center justify-center bg-white border-0 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] rounded-[2rem]">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-2xl border-0 shadow-inner bg-muted/50 p-6"
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
                                    className={cn("w-full font-black rounded-xl h-12 transition-all relative overflow-hidden border-0",
                                        time === slot && "bg-primary text-white shadow-[0_8px_30px_-6px_hsl(var(--primary))] scale-[1.02]",
                                        isBooked && "opacity-50 cursor-not-allowed bg-red-500/5 text-red-500",
                                        !isBooked && time !== slot && "bg-white shadow-sm hover:bg-muted/50 hover:shadow-md hover:-translate-y-0.5"
                                    )}
                                    onClick={() => setTime(slot)}
                                >
                                    {slot}
                                    {isBooked && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[1px] text-[10px] font-bold uppercase tracking-widest text-destructive">
                                            {t('booked')}
                                        </div>
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                    {date && (
                        <div className="mt-8 p-6 rounded-2xl bg-muted/50 shadow-inner border-0 text-center animate-in fade-in">
                            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">{t('youSelected')}</p>
                            <p className="font-black text-xl text-primary">
                                {format(date, "MMMM do, yyyy")}
                            </p>
                            {time && (
                                <p className="font-black text-xl text-primary mt-1">
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
