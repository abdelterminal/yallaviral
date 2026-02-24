"use client";

import { HelpCircle, MessageCircle, BookOpen, ExternalLink, Mail, Info } from "lucide-react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";

export function HelpSupport() {
    const t = useTranslations('Shared');
    const whatsappNumber = "2126XXXXXXXX"; // Replace with real number
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hello! I need help with YallaViral.`;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-muted-foreground hover:bg-white/5 hover:text-white hidden sm:flex" title={t('helpSupport')}>
                    <HelpCircle className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent className="bg-zinc-950/95 border-white/10 backdrop-blur-2xl text-white sm:max-w-md p-8 overflow-y-auto scrollbar-none">
                <SheetHeader className="mb-10 text-left">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 mb-5 shadow-[0_8px_20px_rgba(124,58,237,0.15)]">
                        <HelpCircle className="h-7 w-7 text-primary" />
                    </div>
                    <SheetTitle className="text-3xl font-black text-white tracking-tighter">{t('supportCenter')}</SheetTitle>
                    <SheetDescription className="text-muted-foreground text-base leading-relaxed mt-2">
                        {t('supportDesc')}
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-8">
                    {/* Primary Action: WhatsApp */}
                    <div className="group relative p-1 rounded-[2.2rem] bg-gradient-to-br from-emerald-500/20 via-primary/10 to-transparent border border-white/5 shadow-2xl">
                        <div className="bg-zinc-900/60 rounded-[2rem] p-6 backdrop-blur-xl border border-white/5 transition-colors group-hover:bg-zinc-900/80">
                            <div className="flex items-center justify-between mb-6">
                                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black uppercase tracking-tighter h-6 px-3">{t('liveNow')}</Badge>
                                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                    <MessageCircle className="h-5 w-5 text-emerald-400" />
                                </div>
                            </div>
                            <h3 className="font-black text-xl mb-2 text-white tracking-tight">{t('whatsappSupport')}</h3>
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed opacity-80">
                                {t('whatsappDesc')}
                                <br />
                                <span className="text-emerald-400/80 font-mono text-xs mt-2 inline-block">{t('responseTime')}</span>
                            </p>
                            <Button
                                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black h-14 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98] text-base"
                                onClick={() => window.open(whatsappLink, '_blank')}
                            >
                                <MessageCircle className="mr-2 h-6 w-6" />
                                {t('startChat')}
                            </Button>
                        </div>
                    </div>

                    {/* Quick Resources */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-2">{t('missionResources')}</h4>

                        <a href="#" className="w-full flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] transition-all group active:scale-[0.99] border-l-2 border-l-primary/30">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shadow-inner">
                                    <BookOpen className="h-6 w-6 text-primary" />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-[15px] text-white tracking-tight">{t('knowledgeBase')}</p>
                                    <p className="text-xs text-muted-foreground font-medium">{t('kbDesc')}</p>
                                </div>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
                        </a>

                        <a href="mailto:support@yallaviral.ma" className="w-full flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] transition-all group active:scale-[0.99] border-l-2 border-l-blue-500/30">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors shadow-inner">
                                    <Mail className="h-6 w-6 text-blue-400" />
                                </div>
                                <div className="text-left">
                                    <p className="font-black text-[15px] text-white tracking-tight">{t('officialEmail')}</p>
                                    <p className="text-xs text-muted-foreground font-medium">{t('emailDesc')}</p>
                                </div>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-white transition-colors" />
                        </a>
                    </div>

                    {/* FAQ Mini */}
                    <div className="p-6 rounded-[1.5rem] border border-white/5 bg-white/[0.02] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Info className="h-12 w-12" />
                        </div>
                        <h4 className="text-sm font-black mb-5 text-white flex items-center gap-2 tracking-tight">
                            <Info className="h-4 w-4 text-primary" />
                            {t('flashFaq')}
                        </h4>
                        <div className="space-y-6">
                            <div className="relative pl-3 border-l-2 border-primary/20">
                                <p className="text-[13px] font-bold text-white mb-1.5 leading-tight">{t('faq1Q')}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {t('faq1A')}
                                </p>
                            </div>
                            <div className="relative pl-3 border-l-2 border-primary/20">
                                <p className="text-[13px] font-bold text-white mb-1.5 leading-tight">{t('faq2Q')}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {t('faq2A')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-10">
                    <p className="text-[10px] text-center font-mono text-muted-foreground uppercase opacity-20 tracking-widest leading-loose">
                        // YV-SYSTEM-SUPPORT-V1.0
                        <br />
                        // EST-MEKNES-COMMAND
                    </p>
                </div>
            </SheetContent>
        </Sheet>
    );
}
