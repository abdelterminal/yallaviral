"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { updateNotificationPreferences } from "@/actions/settings";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface NotificationsFormProps {
    defaults: {
        notify_campaign_updates: boolean;
        notify_deliverables: boolean;
        notify_marketing: boolean;
    };
}

export function NotificationsForm({ defaults }: NotificationsFormProps) {
    const [prefs, setPrefs] = useState(defaults);
    const [saving, setSaving] = useState<string | null>(null);
    const t = useTranslations('Settings');

    async function handleToggle(key: keyof typeof prefs) {
        const newValue = !prefs[key];
        const newPrefs = { ...prefs, [key]: newValue };
        setPrefs(newPrefs);
        setSaving(key);

        const result = await updateNotificationPreferences(newPrefs);

        if (result.error) {
            toast.error(t('failedToSave'), { description: result.error });
            setPrefs(prefs); // Revert
        } else {
            toast.success(t('preferencesUpdated'));
        }

        setSaving(null);
    }

    const items = [
        {
            key: "notify_campaign_updates" as const,
            label: t('campaignStatusUpdates'),
            description: t('campaignStatusDesc'),
        },
        {
            key: "notify_deliverables" as const,
            label: t('newDeliverables'),
            description: t('newDeliverablesDesc'),
        },
        {
            key: "notify_marketing" as const,
            label: t('marketingTips'),
            description: t('marketingTipsDesc'),
        },
    ];

    return (
        <Card className="bg-card border-0">
            <CardHeader>
                <CardTitle>{t('emailNotifications')}</CardTitle>
                <CardDescription>{t('emailNotificationsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {items.map((item, index) => (
                    <div key={item.key}>
                        {index > 0 && <Separator className="bg-muted mb-6" />}
                        <div className="flex items-center justify-between space-x-2">
                            <div className="space-y-1">
                                <Label className="text-base font-bold">{item.label}</Label>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {saving === item.key && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                                <Switch
                                    checked={prefs[item.key]}
                                    onCheckedChange={() => handleToggle(item.key)}
                                    disabled={saving !== null}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
