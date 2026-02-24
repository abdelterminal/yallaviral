"use server";

import { createClient } from "@/utils/supabase/server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { resend } from "@/lib/resend";
import { BookingApprovedTemplate } from "@/components/emails/BookingApprovedTemplate";
import { z } from "zod";

const BookingIdSchema = z.string().uuid("Invalid booking ID");

export async function confirmBooking(bookingId: string) {
    const parsed = BookingIdSchema.safeParse(bookingId);
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

    // 1. Update status to 'confirmed' and set payment_status
    const { error } = await supabase
        .from("bookings")
        .update({ status: "confirmed", payment_status: "unpaid" })
        .eq("id", bookingId);

    if (error) {
        console.error("Error confirming booking:", error);
        return { success: false, error: error.message };
    }

    // 2. Fetch booking details to get user email (Simulated Notification)
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

    // 3. Send Real Email
    if (booking?.profiles?.email) {
        try {
            const { error: emailError } = await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL!,
                to: booking.profiles.email,
                subject: 'Your Campaign Request is Confirmed!',
                react: <BookingApprovedTemplate
                    customerName={booking.profiles.full_name || "Customer"}
                    bookingId={bookingId}
                />,
            });

            if (emailError) {
                console.error("Resend Error:", emailError);
            }
        } catch (error) {
            console.error("Failed to send confirmation email:", error);
        }
    }

    revalidatePath("/requests");
    return { success: true };
}
