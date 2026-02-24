import { createClient } from "@/utils/supabase/server";
import { ResourcesTable } from "@/components/admin/ResourcesTable";
import { ModelDialog } from "@/components/admin/dialogs/ModelDialog";
import { Users } from "lucide-react";

export const revalidate = 0;

export default async function AdminModelsPage() {
    const supabase = await createClient();

    const { data: resources } = await supabase
        .from("resources")
        .select("*")
        .eq("type", "model")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                        <Users className="h-8 w-8 text-primary" /> Models
                    </h2>
                    <p className="text-muted-foreground">Manage your casting models.</p>
                </div>
                <ModelDialog />
            </div>

            <ResourcesTable resources={resources || []} />
        </div>
    );
}
