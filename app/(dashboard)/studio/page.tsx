import { createClient } from "@/utils/supabase/server";
import { ResourceCard } from "@/components/studio/ResourceCard";
import { Clapperboard } from "lucide-react";
import { Resource } from "@/types/database";

// This is a Server Component, so we can fetch data directly
export default async function StudioPage() {
    const supabase = await createClient();
    const { data: resources, error } = await supabase
        .from("resources")
        .select("*")
        .eq("type", "studio")
        .eq("status", "active");

    if (error) {
        return <div className="p-8 text-destructive">Error loading studios: {error.message}</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="flex items-center gap-2 text-3xl font-black tracking-tight">
                    Choose Your Set <Clapperboard className="h-8 w-8 text-primary" />
                </h2>
                <p className="text-muted-foreground">
                    One studio, infinite possibilities. Book the specific setup for your content.
                </p>
            </div>

            <div className="grid gap-6 grid-cols-1">
                {resources?.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource as Resource} />
                ))}
            </div>
        </div>
    );
}
