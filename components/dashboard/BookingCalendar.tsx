"use client";

import { DayPicker } from "react-day-picker";
import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";

interface BookingCalendarProps {
    bookedDates: Date[];
}

export function BookingCalendar({ bookedDates }: BookingCalendarProps) {
    const t = useTranslations('Shared');

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    {t('calendar')}
                </h3>
                {bookedDates.length > 0 && (
                    <span className="text-xs text-muted-foreground">{bookedDates.length} {t('bookedText')}</span>
                )}
            </div>
            <div className="flex justify-center [&_.rdp]:text-white [&_.rdp-day]:text-sm [&_.rdp-day]:rounded-lg [&_.rdp-day_button]:w-9 [&_.rdp-day_button]:h-9 [&_.rdp-head_cell]:text-muted-foreground [&_.rdp-head_cell]:text-xs [&_.rdp-head_cell]:font-normal [&_.rdp-caption_label]:text-white [&_.rdp-caption_label]:font-bold [&_.rdp-nav_button]:text-muted-foreground [&_.rdp-nav_button:hover]:text-white [&_.rdp-button:hover]:bg-white/10">
                <DayPicker
                    mode="multiple"
                    selected={bookedDates}
                    modifiers={{ booked: bookedDates }}
                    modifiersStyles={{
                        booked: {
                            backgroundColor: "rgba(124, 58, 237, 0.3)",
                            color: "white",
                            borderRadius: "8px",
                            fontWeight: "bold",
                        },
                    }}
                    disabled
                    showOutsideDays={false}
                    classNames={{
                        months: "flex flex-col",
                        month: "space-y-4",
                        caption: "flex justify-center pt-1 relative items-center",
                        caption_label: "text-sm font-bold",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 inline-flex items-center justify-center",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "h-9 w-9 text-center text-sm p-0 relative",
                        day: "h-9 w-9 p-0 font-normal",
                        day_selected: "bg-primary text-white hover:bg-primary/90 rounded-lg",
                        day_today: "ring-1 ring-primary/50 rounded-lg",
                        day_outside: "opacity-30",
                        day_disabled: "opacity-100",
                    }}
                />
            </div>
        </div>
    );
}
