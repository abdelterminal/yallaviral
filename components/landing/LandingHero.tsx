"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function LandingHero() {
    const t = useTranslations('Landing');

    return (
        <section className="relative w-full pt-36 pb-44 overflow-hidden bg-gradient-to-b from-[#0B0E17] via-[#0B0E17] to-[#0052FF] text-white isolate">
            {/* Background Effects — dual ambient blobs for richer depth */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/20 rounded-[100%] blur-[120px] pointer-events-none -z-10" />
            <div className="absolute top-[20%] right-0 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none -z-10" />

            <div className="container px-4 md:px-6 mx-auto relative z-10 flex flex-col items-center text-center">
                {/* HEADINGS & COPY */}
                <div className="flex flex-col items-center space-y-8 max-w-4xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md px-5 py-2 text-sm font-medium text-blue-300 shadow-xl"
                    >
                        <Sparkles className="mr-2 h-4 w-4" />
                        <span className="text-xs font-black uppercase tracking-widest">{t('badge')}</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl lg:text-[6rem] font-black tracking-tight leading-[1.15] text-white pb-6 px-4"
                        style={{ textShadow: '0 4px 30px hsl(220 100% 50% / 0.3)' }}
                    >
                        {t('heroTitle1')} <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-blue-100">
                            {t('heroTitle2')}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="max-w-[750px] text-lg md:text-xl text-white/70 leading-relaxed px-6"
                    >
                        {t('heroDescription', { code: 'MAROC2026' })}
                    </motion.p>

                    {/* CTA BUTTONS */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-6"
                    >
                        <Link href="/signup" className="relative group">
                            {/* Pulse glow behind CTA */}
                            <div className="absolute inset-0 rounded-full bg-primary/50 blur-xl group-hover:blur-2xl transition-all duration-500 opacity-60 group-hover:opacity-80" />
                            <Button size="lg" className="relative h-14 px-8 text-lg w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_hsl(var(--primary)/0.5)] border-0 rounded-full font-bold">
                                {t('ctaStart')} <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href="/models">
                            <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto bg-white/10 text-white hover:bg-white/20 backdrop-blur-md rounded-full border border-white/20 hover:border-white/30 font-bold transition-all duration-300">
                                {t('ctaViewTalent')}
                            </Button>
                        </Link>
                    </motion.div>

                    {/* Social Proof */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex items-center gap-4 text-sm font-medium"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B0E17] ring-2 ring-blue-400/30 bg-gray-800 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex text-yellow-400">
                                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <span className="text-white/60 text-xs">{t('usedByBrands')}</span>
                        </div>
                    </motion.div>
                </div>

                {/* BOTTOM VISUAL: Dashboard Mockup Float */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                    className="relative w-full max-w-5xl mx-auto mt-8"
                >
                    {/* Glowing Backing behind the mockup */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary opacity-40 blur-[120px] rounded-full z-0 pointer-events-none" />

                    <div className="relative z-10 rounded-[2rem] border border-white/15 bg-[#0B0E17]/70 backdrop-blur-2xl p-5 shadow-[0_0_80px_hsl(var(--primary)/0.3)] overflow-hidden">

                        {/* Browser Bar */}
                        <div className="flex items-center gap-2 mb-5 px-2">
                            <div className="w-3 h-3 rounded-full bg-red-400/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                            <div className="w-3 h-3 rounded-full bg-green-400/80" />
                            <div className="mx-auto bg-white/5 border border-white/10 rounded-lg px-4 py-1.5 flex items-center gap-2 w-72 justify-center">
                                <div className="w-3 h-3 rounded-full bg-green-400/60" />
                                <span className="text-[10px] text-white/40 tracking-widest font-mono">yallaviral.ma/dashboard</span>
                            </div>
                        </div>

                        {/* Dashboard Content */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[380px]">

                            {/* Left Sidebar */}
                            <div className="col-span-1 bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col gap-3">
                                <div className="w-3/4 h-5 bg-white/15 rounded-md mb-2" />
                                <div className="w-full h-11 bg-primary/20 border border-primary/30 rounded-xl flex items-center px-3 gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <div className="w-16 h-3 bg-primary/40 rounded" />
                                </div>
                                <div className="w-full h-11 bg-white/[0.03] rounded-xl" />
                                <div className="w-full h-11 bg-white/[0.03] rounded-xl" />
                                <div className="mt-auto flex gap-2">
                                    <div className="flex-1 h-8 bg-white/5 rounded-lg" />
                                    <div className="flex-1 h-8 bg-white/5 rounded-lg" />
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="col-span-1 md:col-span-2 bg-white/[0.03] border border-white/10 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden">
                                {/* Top Stats Row */}
                                <div className="flex gap-3">
                                    {['2.4K', '89%', '+340'].map((val, idx) => (
                                        <div key={idx} className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl p-3 text-center">
                                            <div className="text-lg font-black text-white/90">{val}</div>
                                            <div className="w-12 h-2 bg-white/10 rounded mx-auto mt-1" />
                                        </div>
                                    ))}
                                </div>

                                <div className="w-1/3 h-5 bg-white/15 rounded-md" />

                                {/* Chart Area */}
                                <div className="flex-1 relative">
                                    <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-primary/20 to-transparent flex items-end opacity-60">
                                        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full stroke-primary fill-[url(#heroGrad)] overflow-visible">
                                            <defs>
                                                <linearGradient id="heroGrad" x1="0" x2="0" y1="0" y2="1">
                                                    <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                                                    <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
                                                </linearGradient>
                                            </defs>
                                            <path d="M0,50 L0,35 C10,32 15,28 25,22 C35,16 40,30 50,18 C60,6 70,14 80,8 C90,2 95,12 100,6 L100,50 Z" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
