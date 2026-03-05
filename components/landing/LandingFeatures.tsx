"use client";

import { HolographicCard } from "@/components/dashboard/HolographicCard";
import { Video, Mic, Zap, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

const featureKeys = [
    { titleKey: "feature1Title", descKey: "feature1Desc", icon: Video, color: "139, 92, 246" },
    { titleKey: "feature2Title", descKey: "feature2Desc", icon: Mic, color: "16, 185, 129" },
    { titleKey: "feature3Title", descKey: "feature3Desc", icon: Zap, color: "234, 179, 8" },
    { titleKey: "feature4Title", descKey: "feature4Desc", icon: TrendingUp, color: "59, 130, 246" },
] as const;

export function LandingFeatures() {
    const t = useTranslations('Landing');

    return (
        <section id="features" className="py-32 bg-slate-50 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl font-black tracking-tighter sm:text-6xl text-foreground mb-6">
                        {t('featuresTitle')}
                    </h2>
                    <p className="text-muted-foreground text-xl leading-relaxed">
                        {t('featuresSubtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featureKeys.map((feature, index) => (
                        <HolographicCard key={index} className="h-full">
                            <div className="flex flex-col items-center justify-center text-center h-full w-full p-10">
                                <div
                                    className="h-16 w-16 rounded-[2rem] flex items-center justify-center mb-8 shadow-sm transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: `rgba(${feature.color}, 0.1)`, color: `rgb(${feature.color})` }}
                                >
                                    <feature.icon className="h-7 w-7" />
                                </div>
                                <h3 className="text-2xl font-black text-foreground mb-4 tracking-tight">{t(feature.titleKey)}</h3>
                                <p className="text-base text-muted-foreground font-medium leading-relaxed max-w-[280px] mx-auto">
                                    {t(feature.descKey)}
                                </p>
                            </div>
                        </HolographicCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
