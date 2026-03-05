"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star, TrendingUp, Play } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function LandingHero() {
    const t = useTranslations('Landing');

    return (
        <section className="relative w-full pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 -z-10 bg-grid-slate-100/[0.04] bg-[bottom_1px_center]" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* LEFT COLUMN: Copy & Actions */}
                    <div className="flex flex-col items-start text-left space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm font-medium text-primary "
                        >
                            <Sparkles className="mr-2 h-3.5 w-3.5" />
                            <span className="text-xs uppercase tracking-wider font-bold">{t('badge')}</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-6xl font-black tracking-tight sm:text-7xl lg:text-[5rem] text-foreground leading-[1.05]"
                        >
                            {t('heroTitle1')} <br />
                            <span className="text-primary">
                                {t('heroTitle2')}
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="max-w-[600px] text-foreground/80 text-lg md:text-xl font-light leading-relaxed"
                        >
                            {t('heroDescription', { code: 'MAROC2026' })}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                        >
                            <Link href="/signup">
                                <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto hover:scale-105 transition-transform duration-300">
                                    {t('ctaStart')} <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/models">
                                <Button variant="outline" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto border-border bg-card shadow-sm hover:scale-105 transition-transform duration-300">
                                    {t('ctaViewTalent')}
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex items-center gap-4 text-sm font-medium text-muted-foreground"
                        >
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-gray-800 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-yellow-500">
                                    {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <span>{t('usedByBrands')}</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COLUMN: Visuals */}
                    <div className="relative h-[600px] w-full hidden lg:block">
                        {/* Soft background blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[80px]" />

                        {/* Card 1: Creator Profile (Top Left) */}
                        <motion.div
                            initial={{ opacity: 0, x: -50, y: -50 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="absolute top-10 left-0 bg-card border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-5 rounded-3xl w-64"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Kenza" />
                                </div>
                                <div>
                                    <p className="text-foreground font-bold text-sm tracking-tight">{t('creatorName')}</p>
                                    <p className="text-xs text-primary font-medium">{t('creatorAction')}</p>
                                </div>
                            </div>
                            <div className="h-32 bg-muted rounded-xl flex items-center justify-center relative overflow-hidden group">
                                <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80" className="absolute inset-0 w-full h-full object-cover opacity-80" alt="Content" />
                                <div className="w-12 h-12 bg-white/90 shadow-sm backdrop-blur-md rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                                    <Play className="w-5 h-5 text-primary fill-current ml-1" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 2: Studio Booking (Bottom Right) */}
                        <motion.div
                            initial={{ opacity: 0, x: 50, y: 50 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="absolute bottom-20 right-0 bg-card border border-border shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] p-5 rounded-3xl w-72"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t('studioBooking')}</span>
                                <span className="text-xs bg-primary/10 font-bold text-primary px-3 py-1 rounded-full">{t('confirmed')}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0">
                                    <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&q=80" alt="Studio" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-foreground font-bold tracking-tight">{t('studioName')}</p>
                                    <p className="text-sm font-medium text-muted-foreground mt-0.5">Tue, 24 Oct • 14:00</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 3: Analytics (Center Floating) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border shadow-[0_20px_40px_-5px_rgba(124,58,237,0.1)] p-6 rounded-3xl w-64"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <TrendingUp className="w-5 h-5 text-primary" />
                                </div>
                                <span className="text-foreground font-bold">{t('viralReach')}</span>
                            </div>
                            <div className="text-5xl font-black text-foreground mb-1 tracking-tighter">+420%</div>
                            <p className="text-sm font-medium text-muted-foreground">{t('vsLastMonth')}</p>

                            <div className="mt-5 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "85%" }}
                                    transition={{ duration: 1.5, delay: 1 }}
                                    className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
