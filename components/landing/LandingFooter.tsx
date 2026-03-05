"use client";

import Link from "next/link";
import { YallaLogo } from "@/components/Logo";
import { Instagram, Linkedin, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

export function LandingFooter() {
    const t = useTranslations('Landing');
    const tc = useTranslations('Common');

    return (
        <footer className="w-full border-t border-border bg-background pt-16 pb-8">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary/20 p-2 rounded-lg border border-primary/20">
                                <YallaLogo className="h-6 w-6" />
                            </div>
                            <span className="text-xl font-black text-foreground tracking-tighter">YallaViral</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {t('footerBrandDesc')}
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 transition-all">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 transition-all">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-primary/20 transition-all">
                                <Twitter className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Platform */}
                    <div>
                        <h4 className="text-foreground font-bold mb-6">{t('footerPlatform')}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/models" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('footerBrowseCreators')}</Link></li>
                            <li><Link href="/studio" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('footerBookStudios')}</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('footerHowItWorks')}</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('footerCaseStudies')}</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('footerPricing')}</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Company */}
                    <div>
                        <h4 className="text-foreground font-bold mb-6">{t('footerCompany')}</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('footerAbout')}</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-2">
                                {t('footerCareers')} <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">{t('footerHiring')}</span>
                            </Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('footerBlog')}</Link></li>
                            <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">{t('footerPartner')}</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h4 className="text-foreground font-bold mb-6">{t('footerContact')}</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-muted-foreground text-sm">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <span dangerouslySetInnerHTML={{ __html: t('footerAddress') }} />
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground text-sm">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span>+212 600 000 000</span>
                            </li>
                            <li className="flex items-center gap-3 text-muted-foreground text-sm">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span>hello@yallaviral.ma</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        {tc('allRightsReserved')}
                    </p>
                    <div className="flex gap-6">
                        <Link href="/legal/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footerPrivacy')}</Link>
                        <Link href="/legal/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footerTerms')}</Link>
                        <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t('footerCookies')}</Link>
                    </div>
                    <p className="text-xs text-muted-foreground/70 font-mono">
                        {tc('madeInMeknes')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
