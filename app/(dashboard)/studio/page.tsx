import { createClient } from "@/utils/supabase/server";
import { ResourceCard } from "@/components/studio/ResourceCard";
import { Clapperboard } from "lucide-react";
import { Resource } from "@/types/database";
import { getTranslations } from "next-intl/server";

// This is a Server Component, so we can fetch data directly
export default async function StudioPage() {
    const supabase = await createClient();
    const t = await getTranslations('Studio');

    const { data: resources, error } = await supabase
        .from("resources")
        .select("*")
        .eq("type", "studio")
        .eq("status", "active");

    if (error) {
        return <div className="p-8 text-destructive">{t('errorLoading')} {error.message}</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="flex items-center gap-2 text-3xl font-black tracking-tight">
                    {t('title')} <Clapperboard className="h-8 w-8 text-primary" />
                </h2>
                <p className="text-muted-foreground">
                    {t('subtitle')}
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
