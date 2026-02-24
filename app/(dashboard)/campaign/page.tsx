import { createClient } from "@/utils/supabase/server";
import { CampaignBuilder } from "@/components/campaign/CampaignBuilder";
import { Resource } from "@/types/database";

export default async function CampaignPage() {
    const supabase = await createClient();
    const { data: models } = await supabase
        .from("resources")
        .select("*")
        .eq("type", "model")
        .eq("status", "active");

    const { data: studios } = await supabase
        .from("resources")
        .select("*")
        .eq("type", "studio")
        .eq("status", "active");

    if (!models) { // Simple error check, or handle error better
        return <div className="p-8 text-destructive">Error loading data.</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl animate-in fade-in duration-500">
            <CampaignBuilder
                availableModels={(models as Resource[]) || []}
                availableStudios={(studios as Resource[]) || []}
            />
        </div>
    );
}
