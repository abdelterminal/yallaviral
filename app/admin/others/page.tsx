import { createClient } from "@/utils/supabase/server";
import { ResourcesTable } from "@/components/admin/ResourcesTable";
import { MaterialDialog } from "@/components/admin/dialogs/MaterialDialog";
import { Camera } from "lucide-react";

export const revalidate = 0;

export default async function AdminOthersPage() {
    const supabase = await createClient();

    // Fetch resources that are type 'gear'
    const { data: resources } = await supabase
        .from("resources")
        .select("*")
        .eq("type", "gear")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Camera className="h-8 w-8 text-primary" /> Materials
                    </h2>
                    <p className="text-muted-foreground">Manage your equipment and gear.</p>
                </div>
                <MaterialDialog />
            </div>

            <ResourcesTable resources={resources || []} />
        </div>
    );
}
