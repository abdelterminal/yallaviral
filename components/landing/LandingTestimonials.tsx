"use client";

import { Rocket, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const statKeys = [
    { value: "48h", labelKey: "stat1Label", icon: Zap, color: "245, 166, 35" },
    { value: "50+", labelKey: "stat2Label", icon: Users, color: "192, 86, 33" },
    { value: "200+", labelKey: "stat3Label", icon: Rocket, color: "34, 150, 110" },
] as const;

export function LandingTestimonials() {
    const t = useTranslations('Landing');

    return (
        <section className="py-32 bg-background relative overflow-hidden text-foreground">
            {/* Ambient background effects */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none -z-10" />
            <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-violet-50/40 rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <span className="text-xs font-black uppercase tracking-widest text-primary mb-6 block">Scale</span>
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-8 pb-4">
                        {t('statsTitle')}
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto">
                        {t('statsSubtitle')}
                    </p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-20">
                    {statKeys.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: i * 0.15 }}
                                className="flex flex-col items-center text-center p-10 rounded-[2.5rem] bg-card border-0 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 group overflow-hidden relative"
                            >
                                {/* Colored top accent on hover */}
                                <div
                                    className="absolute top-0 left-0 w-full h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{ background: `linear-gradient(90deg, transparent, rgb(${stat.color}), transparent)` }}
                                />

                                <div
                                    className="h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 shadow-sm"
                                    style={{ backgroundColor: `rgba(${stat.color}, 0.1)`, color: `rgb(${stat.color})`, boxShadow: `0 0 0 1px rgba(${stat.color}, 0.15), 0 4px 16px -4px rgba(${stat.color}, 0.2)` }}
                                >
                                    <Icon className="h-7 w-7" />
                                </div>
                                <span className="text-5xl font-black text-foreground mb-4 tracking-tight leading-none">{stat.value}</span>
                                <span className="text-sm font-black text-muted-foreground uppercase tracking-widest">{t(stat.labelKey)}</span>
                            </motion.div>
                        );
                    })}
                </div>

                {/* CTA Block */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center mt-12 bg-[#0B0E17] text-white rounded-[3rem] p-16 max-w-5xl mx-auto shadow-2xl relative overflow-hidden"
                >
                    {/* Ambient blobs */}
                    <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#0052FF] opacity-15 blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-violet-500 opacity-10 blur-[80px] pointer-events-none" />

                    {/* Dot grid overlay */}
                    <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                    <h3 className="text-4xl md:text-5xl font-black tracking-tight mb-6 relative z-10 text-white leading-[1.2] px-4">Choose a plan<br />that fits your needs.</h3>
                    <p className="text-white/50 text-lg mb-8 relative z-10 max-w-md mx-auto">Start growing your brand with Morocco&apos;s top creators today.</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                        <Link href="/signup">
                            <Button size="lg" className="h-16 px-12 text-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_hsl(var(--primary)/0.4)] border-0 rounded-full font-bold">
                                {t('ctaCreate')}
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button size="lg" variant="ghost" className="h-16 px-12 text-xl text-white/70 hover:text-white hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full font-bold transition-all">
                                View Features
                            </Button>
                        </Link>
                    </div>
                    <p className="text-sm font-medium text-white/40 mt-6 relative z-10">{t('ctaNoCommitment')}</p>
                </motion.div>
            </div>
        </section>
    );
}

