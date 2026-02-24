"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { updateNotificationPreferences } from "@/actions/settings";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

    async function handleToggle(key: keyof typeof prefs) {
        const newValue = !prefs[key];
        const newPrefs = { ...prefs, [key]: newValue };
        setPrefs(newPrefs);
        setSaving(key);

        const result = await updateNotificationPreferences(newPrefs);

        if (result.error) {
            toast.error("Failed to save", { description: result.error });
            setPrefs(prefs); // Revert
        } else {
            toast.success("Preferences updated");
        }

        setSaving(null);
    }

    const items = [
        {
            key: "notify_campaign_updates" as const,
            label: "Campaign Status Updates",
            description: "Receive emails when your campaign moves to a new stage.",
        },
        {
            key: "notify_deliverables" as const,
            label: "New Deliverables",
            description: "Get notified when a draft or final video is ready.",
        },
        {
            key: "notify_marketing" as const,
            label: "Marketing & Tips",
            description: "Receive weekly tips on how to grow your brand.",
        },
    ];

    return (
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what updates you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {items.map((item, index) => (
                    <div key={item.key}>
                        {index > 0 && <Separator className="bg-white/10 mb-6" />}
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
