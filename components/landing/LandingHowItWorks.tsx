"use client";

import { UserPlus, FileText, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";

const stepKeys = [
    { titleKey: "step1Title", descKey: "step1Desc", icon: UserPlus },
    { titleKey: "step2Title", descKey: "step2Desc", icon: FileText },
    { titleKey: "step3Title", descKey: "step3Desc", icon: Rocket },
] as const;

export function LandingHowItWorks() {
    const t = useTranslations('Landing');

    return (
        <section className="py-24 bg-black relative">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black tracking-tighter sm:text-5xl text-white mb-4">
                        {t('howItWorksTitle')}
                    </h2>
                    <p className="text-white/80 text-lg">
                        {t('howItWorksSubtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20" />

                    {stepKeys.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center space-y-6 relative z-10">
                            <div className="h-24 w-24 rounded-full bg-black border border-white/10 flex items-center justify-center relative shadow-[0_0_30px_rgba(124,58,237,0.2)] group hover:scale-110 transition-transform duration-300">
                                <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />
                                <step.icon className="h-10 w-10 text-primary group-hover:text-white transition-colors" />
                                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white text-black font-bold flex items-center justify-center border-4 border-black text-sm">
                                    {index + 1}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white">{t(step.titleKey)}</h3>
                                <p className="text-white/70 text-sm leading-relaxed max-w-[250px] mx-auto">
                                    {t(step.descKey)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
