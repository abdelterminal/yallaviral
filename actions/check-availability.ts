"use server";

import { createClient } from "@/utils/supabase/server";
import { format } from "date-fns";
import { z } from "zod";

const CheckAvailabilitySchema = z.object({
    resourceId: z.string().uuid("Invalid resource ID"),
    date: z.coerce.date()
});

export async function getBookedSlots(resourceId: string, date: Date) {
    const parsed = CheckAvailabilitySchema.safeParse({ resourceId, date });
    if (!parsed.success) {
        console.error("Invalid availability check:", parsed.error);
        return [];
    }

    const supabase = await createClient();

    // Use the validated date and construct UTC day boundaries
    // This ensures consistent behavior regardless of server timezone
    const d = parsed.data.date;
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();

    const startOfDay = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month, day, 23, 59, 59, 999));

    // Fetch bookings for this resource on this day
    const { data: bookings, error } = await supabase
        .from("bookings")
        .select("start_time")
        .eq("resource_id", resourceId)
        .gte("start_time", startOfDay.toISOString())
        .lte("start_time", endOfDay.toISOString())
        .neq("status", "rejected");

    if (error) {
        console.error("Error fetching availability:", error);
        return [];
    }

    // Convert timestamps to formatted time strings to match UI
    const bookedSlots = bookings.map(booking => {
        const bookingDate = new Date(booking.start_time);
        return format(bookingDate, "hh:mm a"); // e.g., "09:00 AM"
    });

    return bookedSlots;
}

