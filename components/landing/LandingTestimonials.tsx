"use client";

import { Rocket, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

const statKeys = [
    { value: "48h", labelKey: "stat1Label", icon: Zap, color: "234, 179, 8" },
    { value: "50+", labelKey: "stat2Label", icon: Users, color: "139, 92, 246" },
    { value: "200+", labelKey: "stat3Label", icon: Rocket, color: "16, 185, 129" },
] as const;

export function LandingTestimonials() {
    const t = useTranslations('Landing');

    return (
        <section className="py-32 bg-slate-50 border-t border-slate-100">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-black tracking-tighter sm:text-6xl text-foreground mb-6">
                        {t('statsTitle')}
                    </h2>
                    <p className="text-muted-foreground text-xl max-w-xl mx-auto">
                        {t('statsSubtitle')}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
                    {statKeys.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={i}
                                className="flex flex-col items-center text-center p-10 rounded-[2.5rem] border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all duration-300 group"
                            >
                                <div
                                    className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                                    style={{ backgroundColor: `rgba(${stat.color}, 0.1)`, color: `rgb(${stat.color})` }}
                                >
                                    <Icon className="h-7 w-7" />
                                </div>
                                <span className="text-5xl font-black text-foreground mb-2 tracking-tighter">{stat.value}</span>
                                <span className="text-base text-muted-foreground font-bold uppercase tracking-wide">{t(stat.labelKey)}</span>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link href="/signup">
                        <Button size="lg" className="h-16 px-12 text-xl hover:scale-105 transition-transform duration-300">
                            {t('ctaCreate')}
                        </Button>
                    </Link>
                    <p className="text-sm font-medium text-muted-foreground mt-6">{t('ctaNoCommitment')}</p>
                </div>
            </div>
        </section>
    );
}
