"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// --- NOTIFICATION PREFERENCES ---

const NotificationPrefsSchema = z.object({
    notify_campaign_updates: z.boolean(),
    notify_deliverables: z.boolean(),
    notify_marketing: z.boolean(),
});

export async function updateNotificationPreferences(prefs: z.infer<typeof NotificationPrefsSchema>) {
    const parsed = NotificationPrefsSchema.safeParse(prefs);
    if (!parsed.success) return { error: "Invalid preferences" };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { error } = await supabase
        .from("profiles")
        .update(parsed.data)
        .eq("id", user.id);

    if (error) return { error: error.message };

    revalidatePath("/settings");
    return { success: true };
}

// --- CHANGE PASSWORD ---

const ChangePasswordSchema = z.object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export async function changePassword(newPassword: string, confirmPassword: string) {
    const parsed = ChangePasswordSchema.safeParse({ newPassword, confirmPassword });
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { error } = await supabase.auth.updateUser({
        password: parsed.data.newPassword,
    });

    if (error) return { error: error.message };

    return { success: true };
}
