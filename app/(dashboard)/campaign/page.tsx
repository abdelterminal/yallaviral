import { supabase } from "@/lib/supabase";
import { CampaignBuilder } from "@/components/campaign/CampaignBuilder";
import { Resource } from "@/types/database";

export default async function CampaignPage() {
    const { data: models, error } = await supabase
        .from("resources")
        .select("*")
        .eq("type", "model")
        .eq("status", "active");

    if (error) {
        return <div className="p-8 text-destructive">Error loading talent: {error.message}</div>;
    }

    return (
        <div className="space-y-8 h-full">
            <div>
                <h2 className="text-3xl font-black tracking-tight">UGC Campaign Builder ✨</h2>
                <p className="text-muted-foreground">
                    Drag & drop creators to build your viral squad.
                </p>
            </div>

            <CampaignBuilder availableModels={(models as Resource[]) || []} />
        </div>
    );
}
