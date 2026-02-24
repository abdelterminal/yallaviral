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
        title: `${t('requests')} - YallaViral`,
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
                    <h1 className="flex items-center gap-2 text-3xl font-black tracking-tight">
                        {t('title')} <Rocket className="h-8 w-8 text-primary" />
                    </h1>
                    <p className="text-muted-foreground">{t('subtitle')}</p>
                </div>
                <Link href="/campaign">
                    <Button className="font-bold shadow-lg shadow-primary/25">
                        <Plus className="mr-2 h-4 w-4" /> {tc('newCampaign')}
                    </Button>
                </Link>
            </div>

            {!bookings || bookings.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-12 text-center space-y-4">
                    <p className="text-muted-foreground text-lg">{t('noCampaigns')}</p>
                    <Link href="/campaign">
                        <Button variant="outline">{t('startFirst')}</Button>
                    </Link>
                </div>
            ) : (
                <CampaignsList bookings={bookings} />
            )}
        </div>
    );
}
