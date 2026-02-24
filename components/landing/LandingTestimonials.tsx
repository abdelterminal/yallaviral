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
        <section className="py-24 bg-black/50 border-t border-white/5">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-black tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-4">
                        {t('statsTitle')}
                    </h2>
                    <p className="text-white/60 text-lg max-w-xl mx-auto">
                        {t('statsSubtitle')}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mb-16">
                    {statKeys.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={i}
                                className="flex flex-col items-center text-center p-8 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm hover:border-white/20 transition-all"
                            >
                                <div
                                    className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
                                    style={{ backgroundColor: `rgba(${stat.color}, 0.1)`, color: `rgb(${stat.color})` }}
                                >
                                    <Icon className="h-6 w-6" />
                                </div>
                                <span className="text-4xl font-black text-white mb-1">{stat.value}</span>
                                <span className="text-sm text-muted-foreground font-medium">{t(stat.labelKey)}</span>
                            </div>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link href="/signup">
                        <Button size="lg" className="font-bold text-lg px-8 py-6 shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] transition-all rounded-xl">
                            {t('ctaCreate')}
                        </Button>
                    </Link>
                    <p className="text-xs text-muted-foreground mt-4">{t('ctaNoCommitment')}</p>
                </div>
            </div>
        </section>
    );
}
