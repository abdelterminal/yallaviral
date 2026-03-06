"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { YallaLogo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function LandingHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const t = useTranslations('Landing');
    const tc = useTranslations('Common');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn("fixed top-6 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4",
                isScrolled ? "translate-y-0" : "-translate-y-2"
            )}
        >
            <div className={cn("container max-w-7xl mx-auto flex items-center justify-between px-8 py-4 transition-all duration-500",
                isScrolled
                    ? "bg-background/95 backdrop-blur-sm border border-border rounded-[2.5rem] shadow-[0_12px_40px_rgb(0_0_0_/_0.06)]"
                    : "bg-transparent border-transparent py-6"
            )}>
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/10 p-2 rounded-xl border border-primary/20 group-hover:bg-primary/20 transition-colors">
                        <YallaLogo className="h-6 w-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-foreground">YallaViral</span>
                </Link>

                <nav className="hidden md:flex items-center gap-10">
                    <Link href="#features" className="text-base font-bold text-foreground/60 hover:text-primary transition-colors">
                        {t('navFeatures')}
                    </Link>
                    <Link href="/models" className="text-base font-bold text-foreground/60 hover:text-primary transition-colors">
                        {t('navCrowd')}
                    </Link>
                    <Link href="/studio" className="text-base font-bold text-foreground/60 hover:text-primary transition-colors">
                        {t('navStudios')}
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <Link href="/login" className="hidden sm:inline-flex">
                        <Button variant="ghost" className="text-base font-bold text-foreground/60 hover:text-foreground">
                            {tc('logIn')}
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="h-12 px-6 text-base hover:scale-105 transition-transform duration-300 shadow-sm">
                            {tc('getStarted')}
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
