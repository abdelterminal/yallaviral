import { createClient } from "@/utils/supabase/server";
import { UsersTable } from "@/components/admin/UsersTable";
import { UserDialog } from "@/components/admin/dialogs/UserDialog";

export const revalidate = 0;

export default async function AdminUsersPage() {
    const supabase = await createClient();

    const { data: users } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Users</h2>
                    <p className="text-muted-foreground">Overview of all registered users.</p>
                </div>
                <UserDialog />
            </div>

            <UsersTable users={users || []} />
        </div>
    );
}
