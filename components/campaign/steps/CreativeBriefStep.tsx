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

            <Card className="bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border-0 rounded-[2rem] p-8 space-y-8">
                <h3 className="text-2xl font-black tracking-tight text-foreground">{t('videoQuantities')}</h3>

                {hasNoTalent ? (
                    <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[1.5rem] shadow-inner border-0">
                        <div>
                            <p className="font-bold text-lg text-foreground">{t('totalVideos')}</p>
                            <p className="text-sm text-muted-foreground">{t('usingOwnTalent')}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-0 shadow-sm rounded-full text-foreground hover:bg-slate-100 bg-white"
                                onClick={() => setGlobalQuantity(Math.max(1, globalQuantity - 1))}
                            >
                                <Minus className="h-4 w-4 text-muted-foreground mr-[2px]" />
                            </Button>
                            <span className="w-10 text-center font-black text-2xl text-foreground">{globalQuantity}</span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-0 shadow-sm rounded-full text-foreground hover:bg-slate-100 bg-white"
                                onClick={() => setGlobalQuantity(globalQuantity + 1)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {selectedModels.map(model => (
                            <div key={model.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50/50 shadow-inner rounded-[1.5rem] border-0 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 shadow-sm rounded-[1rem] overflow-hidden bg-slate-100 p-1">
                                        {model.image_url ? (
                                            <img src={model.image_url} alt={model.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-muted flex items-center justify-center text-xs text-foreground">No Img</div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground">{model.name}</p>
                                        <p className="text-sm text-muted-foreground">{model.hourly_rate} MAD {t('perVideo')}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 self-end sm:self-auto bg-white p-2 rounded-full shadow-sm">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full hover:bg-slate-100"
                                        onClick={() => setModelQuantity(model.id, Math.max(1, (model.quantity || 1) - 1))}
                                    >
                                        <Minus className="h-4 w-4 text-muted-foreground ml-[-1px]" />
                                    </Button>
                                    <span className="w-8 text-center font-black text-xl text-foreground">{model.quantity || 1}</span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full hover:bg-slate-100"
                                        onClick={() => setModelQuantity(model.id, (model.quantity || 1) + 1)}
                                    >
                                        <Plus className="h-4 w-4 text-muted-foreground mr-[0px]" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            <div className="flex items-center justify-between pt-8 border-t border-border">
                <Button variant="ghost" onClick={onBack} className="text-foreground hover:bg-muted">
                    {tc('back')}
                </Button>
                <Button size="lg" onClick={onNext} className="min-w-[150px] font-bold">
                    {tc('continue')}
                </Button>
            </div>
        </div>
    );
}
