"use client";

import { Video, Mic, Zap, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const featureKeys = [
    { titleKey: "feature1Title", descKey: "feature1Desc", icon: Video, color: "192, 86, 33" },
    { titleKey: "feature2Title", descKey: "feature2Desc", icon: Mic, color: "34, 150, 110" },
    { titleKey: "feature3Title", descKey: "feature3Desc", icon: Zap, color: "245, 166, 35" },
    { titleKey: "feature4Title", descKey: "feature4Desc", icon: TrendingUp, color: "45, 130, 160" },
] as const;

export function LandingFeatures() {
    const t = useTranslations('Landing');

    return (
        <section id="features" className="py-32 bg-background relative overflow-hidden text-foreground">
            {/* Soft top gradient to transition from the blue hero */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#0052FF]/10 to-transparent pointer-events-none" />

            {/* Ambient background blobs */}
            <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-1/4 -left-20 w-[400px] h-[400px] bg-violet-100/30 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center max-w-3xl mx-auto mb-20"
                >
                    <span className="text-xs font-black uppercase tracking-widest text-primary mb-6 block">Features</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-8 pb-4">
                        {t('featuresTitle')}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        {t('featuresSubtitle')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {featureKeys.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="h-full flex flex-col items-center justify-start text-center p-10 rounded-[2rem] bg-card border-0 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group relative overflow-hidden"
                        >
                            {/* Colored accent bar at top on hover */}
                            <div
                                className="absolute top-0 left-0 w-full h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: `linear-gradient(90deg, transparent, rgb(${feature.color}), transparent)` }}
                            />

                            <div
                                className="h-16 w-16 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md"
                                style={{ backgroundColor: `rgba(${feature.color}, 0.1)`, color: `rgb(${feature.color})` }}
                            >
                                <feature.icon className="h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-foreground mb-5 tracking-tight px-2">{t(feature.titleKey)}</h3>
                            <p className="text-base text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
                                {t(feature.descKey)}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom section gradient divider */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-b from-transparent to-muted/20 pointer-events-none" />
        </section>
    );
}
