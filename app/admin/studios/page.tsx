import { createClient } from "@/utils/supabase/server";
import { ResourcesTable } from "@/components/admin/ResourcesTable";
import { StudioDialog } from "@/components/admin/dialogs/StudioDialog";
import { Building2 } from "lucide-react";

export const revalidate = 0;

export default async function AdminStudiosPage() {
    const supabase = await createClient();

    const { data: resources } = await supabase
        .from("resources")
        .select("*")
        .eq("type", "studio")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Building2 className="h-8 w-8 text-primary" /> Studios
                    </h2>
                    <p className="text-muted-foreground">Manage your studio spaces.</p>
                </div>
                <StudioDialog />
            </div>

            <ResourcesTable resources={resources || []} />
        </div>
    );
}
