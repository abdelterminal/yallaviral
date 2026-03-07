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
                        <Card key={model.id} className={cn("relative transition-all duration-500 rounded-[2.5rem] hover:-translate-y-2 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] group h-[420px] flex flex-col border-0 bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.06)]",
                            isSelected ? "ring-[6px] ring-primary ring-offset-4 bg-primary/5" : ""
                        )}>
                            <div className="relative h-[280px] w-full p-4 pb-0">
                                <div className="relative w-full h-full rounded-[2rem] overflow-hidden bg-muted shadow-inner">
                                    {model.image_url ? (
                                        <img
                                            src={model.image_url}
                                            alt={model.name}
                                            className={cn("h-full w-full object-cover transition-transform duration-700",
                                                isSelected ? "scale-105 saturate-0" : "group-hover:scale-105"
                                            )}
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground">{tc('noImage')}</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                    <div className="absolute bottom-3 left-3 right-3 text-foreground">
                                        <h4 className="font-bold text-lg leading-tight">{model.name}</h4>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {model.tags?.slice(0, 2).map(tag => (
                                                <span key={tag} className="text-[10px] bg-muted backdrop-blur-md px-1.5 py-0.5 rounded text-foreground/90">#{tag}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-card/40 backdrop-blur-md rounded-[2rem]">
                                            <div className="bg-primary text-white px-5 py-2.5 rounded-full font-black text-sm shadow-[0_8px_30px_-6px_hsl(var(--primary))] animate-in zoom-in flex items-center gap-2">
                                                <CheckCircle2 className="h-5 w-5" /> {tc('selected')}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1 gap-4 bg-transparent pt-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{tc('rate')}</span>
                                    <span className="font-bold">{model.hourly_rate} MAD<span className="text-xs font-normal text-muted-foreground">/video</span></span>
                                </div>

                                <div className="flex gap-3 mt-auto mb-2">
                                    <ModelPortfolio model={model}>
                                        <Button variant="ghost" size="sm" className="text-xs font-bold text-primary hover:text-primary/80 hover:bg-primary/10 px-3 py-6 rounded-2xl h-12">
                                            <Eye className="h-3 w-3 mr-1" /> {tc('portfolio')}
                                        </Button>
                                    </ModelPortfolio>
                                    <Button
                                        className={cn("flex-1 font-black rounded-2xl h-12 transition-all", isSelected ? "bg-muted hover:bg-muted/80 text-foreground border-0 shadow-none" : "bg-primary hover:bg-primary/90 shadow-[0_8px_20px_-6px_hsl(var(--primary))]")}
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
