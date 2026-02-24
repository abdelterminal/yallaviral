"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const VALID_STATUSES = ['order_placed', 'scripting', 'filming', 'editing', 'ready'] as const;

const AdvanceStatusSchema = z.object({
    bookingId: z.string().uuid("Invalid booking ID"),
    status: z.enum(VALID_STATUSES),
    note: z.string().optional(),
});

export async function advanceCampaignStatus(
    bookingId: string,
    status: typeof VALID_STATUSES[number],
    note?: string
) {
    const parsed = AdvanceStatusSchema.safeParse({ bookingId, status, note });
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message };
    }

    // Verify admin role
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

    // Insert new status log
    const { error } = await supabase
        .from("campaign_status_logs")
        .insert({
            booking_id: parsed.data.bookingId,
            status: parsed.data.status,
            note: parsed.data.note || null,
        });

    if (error) {
        console.error("Error advancing campaign status:", error);
        return { success: false, error: error.message };
    }

    revalidatePath("/admin/bookings");
    revalidatePath("/requests");
    return { success: true };
}

export async function getCampaignStatusLogs(bookingId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("campaign_status_logs")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching campaign status logs:", error);
        return [];
    }

    return data;
}
