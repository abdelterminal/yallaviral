"use client";

import { useCampaignStore } from "@/store/useCampaignStore";
import { Resource } from "@/types/database";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, CheckCircle2, Sparkles, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ModelPortfolio } from "@/components/campaign/ModelPortfolio";
import { useTranslations } from "next-intl";

interface TalentSelectionStepProps {
    availableModels: Resource[];
    onNext: () => void;
    onBack: () => void;
}

export function TalentSelectionStep({ availableModels, onNext, onBack }: TalentSelectionStepProps) {
    const { selectedModels, addModel, removeModel, setModelVideo } = useCampaignStore();
    const t = useTranslations('Campaign');
    const tc = useTranslations('Common');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="flex items-center gap-2 text-3xl font-black tracking-tight">
                    {t('talentTitle')} <Sparkles className="h-8 w-8 text-primary" />
                </h2>
                <p className="text-muted-foreground text-lg">
                    {t('talentSubtitle')}
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {availableModels.map((model) => {
                    const isSelected = selectedModels.some(s => s.id === model.id);
                    return (
                        <Card key={model.id} className={cn(
                            "relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)] hover:border-primary/50 group h-[380px] flex flex-col",
                            isSelected ? "ring-2 ring-primary border-primary bg-primary/10 shadow-[0_0_30px_rgba(124,58,237,0.2)]" : ""
                        )}>
                            <div className="relative h-2/3 w-full bg-muted overflow-hidden">
                                {model.image_url ? (
                                    <img
                                        src={model.image_url}
                                        alt={model.name}
                                        className={cn(
                                            "h-full w-full object-cover transition-transform duration-700",
                                            isSelected ? "scale-105 saturate-0" : "group-hover:scale-105"
                                        )}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground">{tc('noImage')}</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                <div className="absolute bottom-3 left-3 right-3 text-white">
                                    <h4 className="font-bold text-lg leading-tight">{model.name}</h4>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {model.tags?.slice(0, 2).map(tag => (
                                            <span key={tag} className="text-[10px] bg-white/20 backdrop-blur-md px-1.5 py-0.5 rounded text-white/90">#{tag}</span>
                                        ))}
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
                                        <div className="bg-primary text-white px-3 py-1 rounded-full font-bold shadow-lg animate-in zoom-in flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4" /> {tc('selected')}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4 flex flex-col flex-1 gap-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{tc('rate')}</span>
                                    <span className="font-bold">{model.hourly_rate} MAD<span className="text-xs font-normal text-muted-foreground">/video</span></span>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <ModelPortfolio model={model}>
                                        <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 hover:bg-primary/10 px-2">
                                            <Eye className="h-3 w-3 mr-1" /> {tc('portfolio')}
                                        </Button>
                                    </ModelPortfolio>
                                    <Button
                                        className={cn("flex-1 font-bold", isSelected ? "bg-secondary hover:bg-secondary/80 text-white" : "bg-primary hover:bg-primary/90")}
                                        variant={isSelected ? "secondary" : "default"}
                                        onClick={() => {
                                            if (isSelected) {
                                                removeModel(model.id);
                                            } else {
                                                addModel(model);
                                            }
                                        }}
                                    >
                                        {isSelected ? tc('remove') : tc('select')}
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>

            <div className="flex items-center justify-between pt-8 border-t">
                <Button variant="ghost" onClick={onBack}>
                    {tc('back')}
                </Button>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">{tc('selected')}</p>
                        <p className="text-2xl font-black">{selectedModels.length}</p>
                    </div>
                    <Button
                        size="lg"
                        onClick={onNext}
                        disabled={selectedModels.length === 0}
                        className="min-w-[150px] font-bold"
                    >
                        {tc('continue')}
                    </Button>
                </div>
            </div>

        </div>
    );
}
