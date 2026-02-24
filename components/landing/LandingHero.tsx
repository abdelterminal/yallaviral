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
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-30 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[500px] bg-purple-600/20 rounded-full blur-[100px] opacity-20" />
            </div>

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* LEFT COLUMN: Copy & Actions */}
                    <div className="flex flex-col items-start text-left space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-xl"
                        >
                            <Sparkles className="mr-2 h-3.5 w-3.5" />
                            <span className="text-xs uppercase tracking-wider font-bold">{t('badge')}</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-gray-500 leading-[1.1]"
                        >
                            {t('heroTitle1')} <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500">
                                {t('heroTitle2')}
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="max-w-[600px] text-white/80 text-lg md:text-xl font-light leading-relaxed"
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
                                <Button size="lg" className="h-14 px-8 text-lg font-bold w-full sm:w-auto bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] hover:scale-105 transition-all duration-300">
                                    {t('ctaStart')} <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href="/models">
                                <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold w-full sm:w-auto border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-primary hover:text-primary hover:bg-primary/10 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                                    {t('ctaViewTalent')}
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="flex items-center gap-4 text-sm font-medium text-white/70"
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
                        {/* Abstract Gradient Blob behind cards */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-primary/30 to-purple-600/30 rounded-full blur-[80px] animate-pulse-slow" />

                        {/* Card 1: Creator Profile (Top Left) */}
                        <motion.div
                            initial={{ opacity: 0, x: -50, y: -50 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="absolute top-10 left-0 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-64 shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Kenza" />
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">{t('creatorName')}</p>
                                    <p className="text-xs text-primary">{t('creatorAction')}</p>
                                </div>
                            </div>
                            <div className="h-32 bg-gray-800/50 rounded-lg flex items-center justify-center relative overflow-hidden group">
                                <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&q=80" className="absolute inset-0 w-full h-full object-cover opacity-60" alt="Content" />
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                                    <Play className="w-5 h-5 text-white fill-current" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 2: Studio Booking (Bottom Right) */}
                        <motion.div
                            initial={{ opacity: 0, x: 50, y: 50 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                            className="absolute bottom-20 right-0 bg-black/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl w-72 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-xs font-bold text-white/70 uppercase tracking-wider">{t('studioBooking')}</span>
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">{t('confirmed')}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-lg bg-gray-800 overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&q=80" alt="Studio" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <p className="text-white font-bold">{t('studioName')}</p>
                                    <p className="text-xs text-white/60">Tue, 24 Oct • 14:00</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Card 3: Analytics (Center Floating) */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl border border-primary/30 p-5 rounded-2xl w-60 shadow-[0_0_50px_rgba(124,58,237,0.3)]"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                <span className="text-white font-bold">{t('viralReach')}</span>
                            </div>
                            <div className="text-4xl font-black text-white mb-1">+420%</div>
                            <p className="text-xs text-white/60">{t('vsLastMonth')}</p>

                            <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "85%" }}
                                    transition={{ duration: 1.5, delay: 1 }}
                                    className="h-full bg-primary"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
