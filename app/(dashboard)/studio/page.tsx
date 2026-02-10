import { supabase } from "@/lib/supabase";
import { ResourceCard } from "@/components/studio/ResourceCard";
import { Resource } from "@/types/database";

// This is a Server Component, so we can fetch data directly
export default async function StudioPage() {
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
                <h2 className="text-3xl font-black tracking-tight">Book a Studio 🎙️</h2>
                <p className="text-muted-foreground">
                    Premium spaces for your next podcast, shoot, or creative session.
                </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {resources?.map((resource) => (
                    <ResourceCard key={resource.id} resource={resource as Resource} />
                ))}
            </div>
        </div>
    );
}
