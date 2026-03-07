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
                    <h1 className="flex items-center gap-2 text-3xl font-black tracking-tight text-foreground">
                        {t('title')} <Settings className="h-8 w-8 text-primary" />
                    </h1>
                    <p className="text-muted-foreground mt-1">{t('subtitle')}</p>
                </div>
            </div>

            <Tabs defaultValue={defaultTab} className="space-y-8">
                <TabsList className="bg-muted border border-border p-1 h-auto rounded-full inline-flex">
                    <TabsTrigger value="profile" className="rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:hover:bg-muted/80 px-6 py-2 transition-all duration-300 hover:bg-muted/80">
                        <User className="h-4 w-4 mr-2" /> {t('profileTab')}
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:hover:bg-muted/80 px-6 py-2 transition-all duration-300 hover:bg-muted/80">
                        <CreditCard className="h-4 w-4 mr-2" /> {t('billingTab')}
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:hover:bg-muted/80 px-6 py-2 transition-all duration-300 hover:bg-muted/80">
                        <Bell className="h-4 w-4 mr-2" /> {t('notificationsTab')}
                    </TabsTrigger>
                    <TabsTrigger value="security" className="rounded-full data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=inactive]:hover:bg-muted/80 px-6 py-2 transition-all duration-300 hover:bg-muted/80">
                        <Shield className="h-4 w-4 mr-2" /> {t('securityTab')}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <ProfileForm user={{ id: user.id, email: user.email! }} profile={profile} />
                </TabsContent>

                <TabsContent value="billing" className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-500">
                    <Card className="bg-primary/5 border-0 text-center py-12">
                        <CardHeader>
                            <CardTitle className="text-2xl">{t('billingTitle')}</CardTitle>
                            <CardDescription className="text-base max-w-md mx-auto">
                                {t('billingDesc')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <a href="https://wa.me/212600000000?text=Hi%2C%20I%27d%20like%20to%20discuss%20billing" target="_blank" rel="noopener noreferrer">
                                <Button className="font-bold bg-[#25D366] hover:bg-[#1da851] text-white shadow-[0_8px_20px_-6px_rgba(37,211,102,0.5)]">
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
