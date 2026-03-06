"use client";

import { UserPlus, FileText, Rocket, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Link from "next/link";

const stepKeys = [
    { titleKey: "step1Title", descKey: "step1Desc", icon: UserPlus, accent: "#0052FF" },
    { titleKey: "step2Title", descKey: "step2Desc", icon: FileText, accent: "#22966E" },
    { titleKey: "step3Title", descKey: "step3Desc", icon: Rocket, accent: "#7C3AED" },
] as const;

export function LandingHowItWorks() {
    const t = useTranslations('Landing');

    return (
        <section className="py-32 bg-slate-50 relative overflow-hidden text-foreground">
            {/* Ambient background effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-[150px] pointer-events-none -z-10" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <span className="text-sm font-bold tracking-widest uppercase text-primary/60 mb-4 block">Process</span>
                    <h2 className="text-4xl font-black tracking-tighter sm:text-6xl text-slate-900 mb-6 pb-2">
                        {t('howItWorksTitle')}
                    </h2>
                    <p className="text-slate-500 text-xl max-w-2xl mx-auto">
                        {t('howItWorksSubtitle')}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
                    {/* Connecting Line (Desktop) — gradient dashed */}
                    <div className="hidden md:block absolute top-[140px] left-[20%] right-[20%] h-0.5 z-0 bg-gradient-to-r from-[#0052FF]/30 via-[#22966E]/30 to-[#7C3AED]/30" style={{ backgroundSize: '12px 2px', backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 6px, white 6px, white 12px)' }} />

                    {stepKeys.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            className="flex flex-col items-center text-center p-8 rounded-[2.5rem] bg-white border border-slate-200/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] relative z-10 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] group overflow-hidden"
                        >
                            {/* Colored top accent on hover */}
                            <div
                                className="absolute top-0 left-0 w-full h-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: `linear-gradient(90deg, transparent, ${step.accent}, transparent)` }}
                            />

                            <div className="h-24 w-24 rounded-[2rem] flex items-center justify-center relative shadow-sm mb-6 transition-all duration-300 group-hover:scale-110"
                                style={{ backgroundColor: `${step.accent}10`, border: `1px solid ${step.accent}20` }}
                            >
                                <step.icon className="h-10 w-10" style={{ color: step.accent }} />
                                <div className="absolute -top-3 -right-3 h-10 w-10 rounded-full text-white font-black flex items-center justify-center border-4 border-white shadow-[0_0_15px_rgba(0,82,255,0.3)] text-sm"
                                    style={{ backgroundColor: step.accent }}
                                >
                                    {index + 1}
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">{t(step.titleKey)}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed max-w-[250px] mx-auto">
                                    {t(step.descKey)}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA link */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="text-center mt-12"
                >
                    <Link href="#features" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all duration-300 text-lg">
                        Learn more about our process <ArrowRight className="h-5 w-5" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
