"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const BookingIdSchema = z.string().uuid("Invalid booking ID");

/**
 * User marks their payment as "pending" (WhatsApp flow).
 * They clicked "I've completed payment" after sending via WhatsApp/bank transfer.
 */
export async function markPaymentPending(bookingId: string) {
    const parsed = BookingIdSchema.safeParse(bookingId);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    // Make sure this booking belongs to the user
    const { data: booking } = await supabaseUser
        .from("bookings")
        .select("id, status, payment_status")
        .eq("id", bookingId)
        .eq("user_id", user.id)
        .single();

    if (!booking) {
        return { success: false, error: "Booking not found" };
    }

    if (booking.status !== "confirmed") {
        return { success: false, error: "Booking must be confirmed before payment" };
    }

    if (booking.payment_status === "paid") {
        return { success: false, error: "Already paid" };
    }

    const supabase = createAdminClient();

    const { error } = await supabase
        .from("bookings")
        .update({ payment_status: "pending" })
        .eq("id", bookingId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/requests");
    revalidatePath(`/requests/${bookingId}`);
    return { success: true };
}

/**
 * Admin confirms or rejects a payment.
 */
export async function adminUpdatePaymentStatus(bookingId: string, status: "paid" | "failed") {
    const parsed = BookingIdSchema.safeParse(bookingId);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

    // Verify admin
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const { data: profile } = await supabaseUser
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") {
        return { success: false, error: "Admin access required" };
    }

    const supabase = createAdminClient();

    const { error } = await supabase
        .from("bookings")
        .update({ payment_status: status })
        .eq("id", bookingId);

    if (error) {
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/bookings");
    revalidatePath("/requests");
    return { success: true };
}
