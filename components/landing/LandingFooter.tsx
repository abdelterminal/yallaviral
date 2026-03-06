"use client";

import Link from "next/link";
import { YallaLogo } from "@/components/Logo";
import { Instagram, Linkedin, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export function LandingFooter() {
    const t = useTranslations('Landing');
    const tc = useTranslations('Common');

    return (
        <footer className="w-full bg-white pt-20 pb-8 relative overflow-hidden text-foreground border-t border-slate-100">
            {/* Ambient subtle top light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 transition-colors">
                                <YallaLogo className="h-6 w-6 text-foreground" />
                            </div>
                            <span className="text-xl font-black text-slate-900 tracking-tighter">YallaViral</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            {t('footerBrandDesc')}
                        </p>
                        <div className="flex gap-3">
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-100 hover:shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300">
                                <Instagram className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-100 hover:shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300">
                                <Linkedin className="h-4 w-4" />
                            </Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-slate-100 hover:shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300">
                                <Twitter className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Platform */}
                    <div>
                        <h4 className="text-slate-900 font-black text-sm uppercase tracking-wider mb-6">{t('footerPlatform')}</h4>
                        <ul className="space-y-3">
                            <li><Link href="/models" className="text-slate-500 hover:text-primary transition-colors text-sm">{t('footerBrowseCreators')}</Link></li>
                            <li><Link href="/studio" className="text-slate-500 hover:text-primary transition-colors text-sm">{t('footerBookStudios')}</Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">{t('footerHowItWorks')}</Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">{t('footerCaseStudies')}</Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">{t('footerPricing')}</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Company */}
                    <div>
                        <h4 className="text-slate-900 font-black text-sm uppercase tracking-wider mb-6">{t('footerCompany')}</h4>
                        <ul className="space-y-3">
                            <li><Link href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">{t('footerAbout')}</Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-primary transition-colors text-sm flex items-center gap-2">
                                {t('footerCareers')} <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{t('footerHiring')}</span>
                            </Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">{t('footerBlog')}</Link></li>
                            <li><Link href="#" className="text-slate-500 hover:text-primary transition-colors text-sm">{t('footerPartner')}</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h4 className="text-slate-900 font-black text-sm uppercase tracking-wider mb-6">{t('footerContact')}</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-slate-500 text-sm">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <span dangerouslySetInnerHTML={{ __html: t('footerAddress') }} />
                            </li>
                            <li className="flex items-center gap-3 text-slate-500 text-sm">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span>+212 600 000 000</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-500 text-sm">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span>hello@yallaviral.ma</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-400">
                        {tc('allRightsReserved')}
                    </p>
                    <div className="flex gap-6">
                        <Link href="/legal/privacy" className="text-sm text-slate-400 hover:text-slate-900 transition-colors">{t('footerPrivacy')}</Link>
                        <Link href="/legal/terms" className="text-sm text-slate-400 hover:text-slate-900 transition-colors">{t('footerTerms')}</Link>
                        <Link href="#" className="text-sm text-slate-400 hover:text-slate-900 transition-colors">{t('footerCookies')}</Link>
                    </div>
                    <p className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        🇲🇦 {tc('madeInMeknes')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
