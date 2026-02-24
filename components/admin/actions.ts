"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function inviteUser(email: string, fullName: string, role: 'admin' | 'client') {
    const supabaseAdmin = createAdminClient();
    const supabase = await createClient();

    try {
        // 1. Invite user via Supabase Auth (admin)
        const { data: authData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

        if (inviteError) {
            console.error("Invite Error:", inviteError);
            return { error: inviteError.message };
        }

        const userId = authData.user.id;

        // 2. We need to ensure a profile exists. 
        // Typically Supabase triggers might handle this on insert to auth.users, 
        // but if not, or to be safe/explicit with metadata:

        // Check if profile exists
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profile) {
            // Update existing profile
            const { error: updateError } = await supabaseAdmin
                .from('profiles')
                .update({
                    full_name: fullName,
                    role: role,
                    // If we had a specific status column, update it here. 
                    // For now, existence implies potential access, but 'invited' state is in Auth.
                })
                .eq('id', userId);

            if (updateError) return { error: "User invited, but profile update failed: " + updateError.message };

        } else {
            // Create profile if it didn't auto-create
            // Note: Triggers usually handle this. If you have a trigger, this might conflict or be redundant.
            // We'll perform an UPSERT to be safe.
            const { error: upsertError } = await supabaseAdmin
                .from('profiles')
                .upsert({
                    id: userId,
                    full_name: fullName,
                    role: role,
                    email: email, // If email is in profile
                });

            if (upsertError) return { error: "User invited, but profile creation failed: " + upsertError.message };
        }

        revalidatePath('/admin/users');
        return { success: true };

    } catch (error: any) {
        return { error: error.message };
    }
}

export async function deleteUser(userId: string) {
    const supabaseAdmin = createAdminClient();

    try {
        // Delete from Auth (Schema should handle cascade to public.profiles if set up correctly)
        // If not cascade, delete profile first.
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) {
            console.error("Delete Error:", deleteError);
            return { error: deleteError.message };
        }

        // Just in case cascade isn't on
        await supabaseAdmin.from('profiles').delete().eq('id', userId);

        revalidatePath('/admin/users');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
