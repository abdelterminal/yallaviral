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
        <section className="py-32 bg-white relative">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-black tracking-tighter sm:text-6xl text-foreground mb-6">
                        {t('howItWorksTitle')}
                    </h2>
                    <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                        {t('howItWorksSubtitle')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-0.5 bg-slate-100" />

                    {stepKeys.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center space-y-8 relative z-10">
                            <div className="h-24 w-24 rounded-[2rem] bg-white border border-slate-100 flex items-center justify-center relative shadow-sm group hover:border-primary/30 transition-all duration-300">
                                <step.icon className="h-10 w-10 text-primary transition-transform group-hover:scale-110" />
                                <div className="absolute -top-3 -right-3 h-10 w-10 rounded-full bg-primary text-white font-black flex items-center justify-center border-4 border-white shadow-sm text-sm">
                                    {index + 1}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-foreground">{t(step.titleKey)}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed max-w-[250px] mx-auto">
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
