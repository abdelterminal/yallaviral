import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

async function deleteAllUsers() {
    console.log("Starting user deletion...");

    // 1. Fetch all users from Supabase Auth
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    if (error) {
        console.error("Error fetching users:", error);
        return;
    }

    if (!users || users.length === 0) {
        console.log("No users found.");
        return;
    }

    console.log(`Found ${users.length} users. Deleting...`);

    // 2. Delete each user (this cascades to profiles if FK is set up correctly, 
    // but we can also manually delete profiles first if needed. 
    // Supabase Auth deletion typically cascades to public tables if ON DELETE CASCADE is set.)
    for (const user of users) {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
        if (deleteError) {
            console.error(`Failed to delete user ${user.id}:`, deleteError.message);
        } else {
            console.log(`Deleted user ${user.email} (${user.id})`);
        }
    }

    // Optional: Manually clean profiles if cascade isn't set
    // await supabase.from('profiles').delete().neq('id', '00000000-0000-0000-0000-000000000000'); 

    console.log("All users deleted.");
}

deleteAllUsers();
