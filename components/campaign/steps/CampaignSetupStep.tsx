"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, CheckCircle2, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface CampaignSetupStepProps {
    onComplete: (hasTalent: boolean, hasScript: boolean) => void;
}

export function CampaignSetupStep({ onComplete }: CampaignSetupStepProps) {
    const t = useTranslations('Campaign');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="flex items-center gap-2 text-3xl font-black tracking-tight">
                    {t('setupTitle')} <Rocket className="h-8 w-8 text-primary" />
                </h2>
                <p className="text-muted-foreground text-lg">
                    {t('setupSubtitle')}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card
                    className="p-8 cursor-pointer hover:border-primary/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] hover:bg-primary/5 transition-all duration-300 group relative overflow-hidden"
                    onClick={() => onComplete(false, false)}
                >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                        <Users className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t('needCreators')}</h3>
                    <p className="text-muted-foreground">
                        {t('needCreatorsDesc')}
                    </p>
                </Card>

                <Card
                    className="p-8 cursor-pointer hover:border-primary/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] hover:bg-primary/5 transition-all duration-300 group relative overflow-hidden"
                    onClick={() => onComplete(true, false)}
                >
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                        <FileText className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{t('haveOwnTalent')}</h3>
                    <p className="text-muted-foreground">
                        {t('haveOwnTalentDesc')}
                    </p>
                </Card>
            </div>

            <p className="text-sm text-center text-muted-foreground pt-4">
                {t('uploadNote')}
            </p>
        </div>
    );
}
