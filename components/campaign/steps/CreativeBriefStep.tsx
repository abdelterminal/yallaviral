"use client";

import { useCampaignStore } from "@/store/useCampaignStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Minus } from "lucide-react";
import { useTranslations } from "next-intl";

interface CreativeBriefStepProps {
    onNext: () => void;
    onBack: () => void;
}

export function CreativeBriefStep({ onNext, onBack }: CreativeBriefStepProps) {
    const {
        selectedModels,
        globalQuantity,
        setGlobalQuantity,
        setModelQuantity
    } = useCampaignStore();
    const t = useTranslations('Campaign');
    const tc = useTranslations('Common');

    const hasNoTalent = selectedModels.length === 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="flex items-center gap-2 text-3xl font-black tracking-tight">
                    {t('briefTitle')} <FileText className="h-8 w-8 text-primary" />
                </h2>
                <p className="text-muted-foreground text-lg">
                    {t('briefSubtitle')}
                </p>
            </div>

            <Card className="bg-black/40 border-white/10 p-6 space-y-6">
                <h3 className="text-xl font-bold text-white">{t('videoQuantities')}</h3>

                {hasNoTalent ? (
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                        <div>
                            <p className="font-bold text-white">{t('totalVideos')}</p>
                            <p className="text-sm text-muted-foreground">{t('usingOwnTalent')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-white/10 text-white hover:bg-white/10"
                                onClick={() => setGlobalQuantity(Math.max(1, globalQuantity - 1))}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-bold text-lg text-white">{globalQuantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-white/10 text-white hover:bg-white/10"
                                onClick={() => setGlobalQuantity(globalQuantity + 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {selectedModels.map(model => (
                            <div key={model.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
                                        {model.image_url ? (
                                            <img src={model.image_url} alt={model.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-white/10 flex items-center justify-center text-xs text-white">No Img</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{model.name}</p>
                                        <p className="text-sm text-muted-foreground">{model.hourly_rate} MAD {t('perVideo')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 self-end sm:self-auto">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="border-white/10 text-white hover:bg-white/10"
                                        onClick={() => setModelQuantity(model.id, Math.max(1, (model.quantity || 1) - 1))}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className="w-8 text-center font-bold text-lg text-white">{model.quantity || 1}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="border-white/10 text-white hover:bg-white/10"
                                        onClick={() => setModelQuantity(model.id, (model.quantity || 1) + 1)}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            <div className="flex items-center justify-between pt-8 border-t border-white/10">
                <Button variant="ghost" onClick={onBack} className="text-white hover:bg-white/10">
                    {tc('back')}
                </Button>
                <Button size="lg" onClick={onNext} className="min-w-[150px] font-bold">
                    {tc('continue')}
                </Button>
            </div>
        </div>
    );
}
