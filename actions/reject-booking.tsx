"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { resend } from "@/lib/resend";
import { BookingRejectedTemplate } from "@/components/emails/BookingRejectedTemplate";
import { z } from "zod";

const RejectSchema = z.object({
    bookingId: z.string().uuid("Invalid booking ID"),
    reason: z.string().min(5, "Rejection reason must be at least 5 characters").max(500),
});

export async function rejectBooking(bookingId: string, reason?: string) {
    const parsed = RejectSchema.safeParse({ bookingId, reason: reason || "" });
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

    // 0. Verify Admin Role
    const supabaseUser = await createClient();
    const { data: { user } } = await supabaseUser.auth.getUser();

    if (!user) {
        return { success: false, error: "Unauthorized: Not authenticated" };
    }

    const { data: profile } = await supabaseUser
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return { success: false, error: "Unauthorized: Admin access required" };
    }

    const supabase = createAdminClient();

    // 1. Update status to 'rejected' with reason and timestamp
    const { error } = await supabase
        .from("bookings")
        .update({
            status: "rejected",
            rejection_reason: parsed.data.reason,
            rejected_at: new Date().toISOString(),
        })
        .eq("id", bookingId);

    if (error) {
        console.error("Error rejecting booking:", error);
        return { success: false, error: error.message };
    }

    // Fetch booking details to get user email
    const { data: booking } = await supabase
        .from("bookings")
        .select(`
            *,
            profiles (
                email,
                full_name
            )
        `)
        .eq("id", bookingId)
        .single();

    if (booking?.profiles?.email) {
        try {
            const { error: emailError } = await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL!,
                to: booking.profiles.email,
                subject: 'Update on your Campaign Request',
                react: <BookingRejectedTemplate
                    customerName={booking.profiles.full_name || "Customer"}
                    bookingId={bookingId}
                />,
            });

            if (emailError) {
                console.error("Resend Error:", emailError);
            }
        } catch (emailError) {
            console.error("Failed to send rejection email:", emailError);
        }
    }

    revalidatePath("/admin/bookings");
    revalidatePath("/admin");
    revalidatePath("/requests");
    return { success: true };
}
