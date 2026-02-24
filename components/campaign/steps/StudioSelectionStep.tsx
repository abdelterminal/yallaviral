"use client";

import { useCampaignStore } from "@/store/useCampaignStore";
import { Resource } from "@/types/database";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, CheckCircle2, Mic2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface StudioSelectionStepProps {
    availableStudios: Resource[];
    onNext: () => void;
    onBack: () => void;
}

export function StudioSelectionStep({ availableStudios, onNext, onBack }: StudioSelectionStepProps) {
    const { selectedStudio, setSelectedStudio } = useCampaignStore();
    const t = useTranslations('Campaign');
    const tc = useTranslations('Common');

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="flex items-center gap-2 text-3xl font-black tracking-tight">
                    {t('studioTitle')} <Mic2 className="h-8 w-8 text-primary" />
                </h2>
                <p className="text-muted-foreground text-lg">
                    {t('studioSubtitle')}
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availableStudios.map((studio) => {
                    const isSelected = selectedStudio?.id === studio.id;
                    return (
                        <Card
                            key={studio.id}
                            className={cn(
                                "group relative overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(124,58,237,0.15)]",
                                isSelected ? "ring-2 ring-primary border-primary bg-primary/10 shadow-[0_0_30px_rgba(124,58,237,0.2)]" : ""
                            )}
                            onClick={() => setSelectedStudio(studio)}
                        >
                            <div className="aspect-video w-full bg-muted overflow-hidden">
                                {studio.image_url ? (
                                    <img
                                        src={studio.image_url}
                                        alt={studio.name}
                                        className={cn(
                                            "h-full w-full object-cover transition-transform duration-700",
                                            isSelected ? "scale-105" : "group-hover:scale-105"
                                        )}
                                    />
                                ) : (
                                    <div className="flex h-full items-center justify-center text-muted-foreground">{tc('noImage')}</div>
                                )}
                                {isSelected && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
                                        <div className="bg-primary text-white h-10 w-10 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in">
                                            <CheckCircle2 className="h-6 w-6" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1">{studio.name}</h3>
                                {studio.tags && (
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                                        <MapPin className="h-3 w-3" />
                                        <span>{studio.tags[0]}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between mt-4">
                                    <span className="font-bold">{studio.hourly_rate} MAD<span className="text-xs font-normal text-muted-foreground">/hr</span></span>
                                    {isSelected && <span className="text-xs font-bold text-primary">{tc('selected')}</span>}
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
                    <Button
                        size="lg"
                        onClick={onNext}
                        disabled={!selectedStudio}
                        className="min-w-[150px] font-bold"
                    >
                        {tc('continue')}
                    </Button>
                </div>
            </div>
        </div>
    );
}
