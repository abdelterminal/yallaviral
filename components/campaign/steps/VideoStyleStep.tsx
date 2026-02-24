"use client";

import { useCampaignStore } from "@/store/useCampaignStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, CheckCircle2, MonitorPlay, Clapperboard, MessageSquare, PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface VideoStyleStepProps {
    onNext: () => void;
    onBack: () => void;
}

const VIDEO_STYLES = [
    { id: "ugc", titleKey: "ugcTitle", descKey: "ugcDesc", icon: MessageSquare, color: "text-green-400", bgColor: "bg-green-400/10", borderColor: "border-green-400/20" },
    { id: "unboxing", titleKey: "unboxingTitle", descKey: "unboxingDesc", icon: PackageOpen, color: "text-blue-400", bgColor: "bg-blue-400/10", borderColor: "border-blue-400/20" },
    { id: "ad", titleKey: "adTitle", descKey: "adDesc", icon: MonitorPlay, color: "text-purple-400", bgColor: "bg-purple-400/10", borderColor: "border-purple-400/20" },
    { id: "lifestyle", titleKey: "lifestyleTitle", descKey: "lifestyleDesc", icon: Clapperboard, color: "text-pink-400", bgColor: "bg-pink-400/10", borderColor: "border-pink-400/20" },
] as const;

export function VideoStyleStep({ onNext, onBack }: VideoStyleStepProps) {
    const { globalVideoStyle, setGlobalVideoStyle } = useCampaignStore();
    const t = useTranslations('Campaign');
    const tc = useTranslations('Common');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="flex items-center gap-2 text-3xl font-black tracking-tight">
                    {t('videoStyleTitle')} <PlayCircle className="h-8 w-8 text-primary" />
                </h2>
                <p className="text-muted-foreground text-lg">
                    {t('videoStyleSubtitle')}
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {VIDEO_STYLES.map((style) => {
                    const isSelected = globalVideoStyle === style.id;
                    const Icon = style.icon;

                    return (
                        <Card
                            key={style.id}
                            className={cn(
                                "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] group border-2",
                                isSelected
                                    ? `ring-2 ring-primary border-primary bg-primary/10 shadow-[0_0_30px_rgba(124,58,237,0.2)]`
                                    : "border-white/5 hover:border-white/20 bg-black/40"
                            )}
                            onClick={() => setGlobalVideoStyle(style.id)}
                        >
                            <div className="p-6 flex items-start gap-4">
                                <div className={cn("p-3 rounded-xl", style.bgColor, style.color)}>
                                    <Icon className="h-8 w-8" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-xl">{t(style.titleKey)}</h3>
                                        {isSelected && (
                                            <CheckCircle2 className="h-6 w-6 text-primary animate-in zoom-in" />
                                        )}
                                    </div>
                                    <p className="text-muted-foreground text-sm">{t(style.descKey)}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-white/10">
                <Button variant="ghost" onClick={onBack}>
                    {tc('back')}
                </Button>
                <Button
                    size="lg"
                    onClick={onNext}
                    disabled={!globalVideoStyle}
                    className="min-w-[150px] font-bold"
                >
                    {tc('continue')}
                </Button>
            </div>
        </div>
    );
}
