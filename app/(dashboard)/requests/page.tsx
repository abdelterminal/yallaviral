import { Button } from "@/components/ui/button";
import { Plus, Rocket } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CampaignsList } from "@/components/requests/CampaignsList";
import { getTranslations } from "next-intl/server";

export const revalidate = 0;

export async function generateMetadata() {
    const t = await getTranslations('Nav');
    return {
        title: `${t('campaigns')} - YallaViral`,
    };
}

export default async function RequestsPage() {
    const supabase = await createClient();
    const t = await getTranslations('Requests');
    const tc = await getTranslations('Common');

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: bookings } = await supabase
        .from("bookings")
        .select(`
            *,
            resources (
                name,
                hourly_rate,
                image_url
            ),
            profiles (
                full_name
            )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                        {t('title')} <Rocket className="h-5 w-5 text-primary" />
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
                </div>
                <Link href="/campaign">
                    <Button size="sm" className="font-semibold">
                        <Plus className="h-4 w-4" /> {t('newCampaign')}
                    </Button>
                </Link>
            </div>

            {!bookings || bookings.length === 0 ? (
                <div className="rounded-[14px] border border-dashed border-border/30 bg-muted/10 p-16 text-center space-y-4">
                    <p className="text-muted-foreground">{t('noCampaigns')}</p>
                    <Link href="/campaign">
                        <Button variant="outline" size="sm">{t('startFirst')}</Button>
                    </Link>
                </div>
            ) : (
                <CampaignsList bookings={bookings} />
            )}
        </div>
    );
}
