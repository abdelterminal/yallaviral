import { Settings, User, CreditCard, Shield, Bell } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { NotificationsForm } from "@/components/settings/NotificationsForm";
import { SecurityForm } from "@/components/settings/SecurityForm";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
    const t = await getTranslations('Nav');
    return {
        title: `${t('settings')} - YallaViral`,
        description: "Manage your account preferences.",
    };
}

export default async function SettingsPage({
    searchParams,
}: {
    searchParams: Promise<{ tab?: string }>;
}) {
    const supabase = await createClient();
    const t = await getTranslations('Settings');
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const resolvedParams = await searchParams;
    const defaultTab = resolvedParams.tab || "profile";

    return (
        <div className="space-y-8 pb-10">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="flex items-center gap-2 text-3xl font-black tracking-tight text-white">
                        {t('title')} <Settings className="h-8 w-8 text-primary" />
                    </h1>
                    <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
                </div>
            </div>

            <Tabs defaultValue={defaultTab} className="space-y-8">
                <TabsList className="bg-white/5 border border-white/10 p-1 h-auto rounded-full inline-flex">
                    <TabsTrigger value="profile" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black px-6 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]">
                        <User className="h-4 w-4 mr-2" /> {t('profileTab')}
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black px-6 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]">
                        <CreditCard className="h-4 w-4 mr-2" /> {t('billingTab')}
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black px-6 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]">
                        <Bell className="h-4 w-4 mr-2" /> {t('notificationsTab')}
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-black px-6 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]">
                        <Shield className="h-4 w-4 mr-2" /> {t('securityTab')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <ProfileForm user={{ id: user.id, email: user.email! }} profile={profile} />
                </TabsContent>

                <TabsContent value="billing" className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <Card className="bg-gradient-to-br from-primary/10 to-purple-900/10 border-white/10 backdrop-blur-sm text-center py-12">
                        <CardHeader>
                            <CardTitle className="text-2xl">{t('billingTitle')}</CardTitle>
                            <CardDescription className="text-base max-w-md mx-auto">
                                {t('billingDesc')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <a href="https://wa.me/212600000000?text=Hi%2C%20I%27d%20like%20to%20discuss%20billing" target="_blank" rel="noopener noreferrer">
                                <Button className="font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-900/20">
                                    {t('contactWhatsApp')}
                                </Button>
                            </a>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <NotificationsForm
                        defaults={{
                            notify_campaign_updates: profile?.notify_campaign_updates ?? true,
                            notify_deliverables: profile?.notify_deliverables ?? true,
                            notify_marketing: profile?.notify_marketing ?? false,
                        }}
                    />
                </TabsContent>

                <TabsContent value="security" className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <SecurityForm />
                </TabsContent>
            </Tabs>
        </div>
    );
}
