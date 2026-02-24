"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export async function getDeliverables(bookingId: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("deliverables")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching deliverables:", error);
        return [];
    }

    return data;
}

export async function uploadDeliverable(formData: FormData) {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") return { error: "Admin access required" };

    const bookingId = formData.get("bookingId") as string;
    const file = formData.get("file") as File;

    if (!bookingId || !file) return { error: "Missing booking ID or file" };

    // Upload file to Supabase Storage
    const fileExt = file.name.split(".").pop();
    const filePath = `${bookingId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await adminSupabase.storage
        .from("deliverables")
        .upload(filePath, file, {
            contentType: file.type,
            upsert: false,
        });

    if (uploadError) {
        console.error("Storage upload error:", uploadError);
        return { error: "Failed to upload file: " + uploadError.message };
    }

    // Get public URL
    const { data: urlData } = adminSupabase.storage
        .from("deliverables")
        .getPublicUrl(filePath);

    // Insert record into deliverables table
    const { error: dbError } = await adminSupabase
        .from("deliverables")
        .insert({
            booking_id: bookingId,
            file_name: file.name,
            file_url: urlData.publicUrl,
            file_size: file.size,
            file_type: file.type,
            uploaded_by: user.id,
        });

    if (dbError) {
        console.error("DB insert error:", dbError);
        return { error: "File uploaded but record creation failed" };
    }

    revalidatePath(`/requests/${bookingId}`);
    revalidatePath(`/admin/bookings`);
    return { success: true, url: urlData.publicUrl };
}

export async function deleteDeliverable(id: string, fileUrl: string) {
    const supabase = await createClient();
    const adminSupabase = createAdminClient();

    // Verify admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== "admin") return { error: "Admin access required" };

    // Extract file path from URL for storage deletion
    const urlParts = fileUrl.split("/deliverables/");
    if (urlParts.length > 1) {
        const storagePath = decodeURIComponent(urlParts[1]);
        await adminSupabase.storage.from("deliverables").remove([storagePath]);
    }

    // Delete DB record
    const { error } = await adminSupabase
        .from("deliverables")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Delete error:", error);
        return { error: "Failed to delete deliverable" };
    }

    revalidatePath("/admin/bookings");
    revalidatePath("/requests");
    return { success: true };
}
