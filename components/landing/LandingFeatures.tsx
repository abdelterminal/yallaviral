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
        <section id="features" className="py-24 bg-black/50 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-black tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4">
                        {t('featuresTitle')}
                    </h2>
                    <p className="text-white/80 text-lg">
                        {t('featuresSubtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featureKeys.map((feature, index) => (
                        <HolographicCard key={index} glowColor={feature.color} className="h-full hover:scale-105 transition-transform duration-300">
                            <div className="flex flex-col items-center justify-center text-center h-full w-full p-8">
                                <div
                                    className="h-12 w-12 rounded-xl flex items-center justify-center mb-6"
                                    style={{ backgroundColor: `rgba(${feature.color}, 0.1)`, color: `rgb(${feature.color})` }}
                                >
                                    <feature.icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{t(feature.titleKey)}</h3>
                                <p className="text-sm text-white/70 leading-relaxed max-w-[280px] mx-auto">
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
