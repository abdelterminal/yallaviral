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
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b",
                isScrolled
                    ? "bg-black/70 backdrop-blur-xl border-white/10 py-4 shadow-lg"
                    : "bg-transparent border-transparent py-6"
            )}
        >
            <div className="container px-4 md:px-6 mx-auto flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-primary/10 p-1.5 rounded-lg border border-primary/20 group-hover:bg-primary/20 transition-colors">
                        <YallaLogo className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white">YallaViral</span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-sm font-medium text-gray-400 hover:text-white hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 inline-block">
                        {t('navFeatures')}
                    </Link>
                    <Link href="/models" className="text-sm font-medium text-gray-400 hover:text-white hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 inline-block">
                        {t('navCrowd')}
                    </Link>
                    <Link href="/studio" className="text-sm font-medium text-gray-400 hover:text-white hover:-translate-y-0.5 hover:scale-105 transition-all duration-300 inline-block">
                        {t('navStudios')}
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <Link href="/login" className="hidden sm:inline-flex">
                        <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/10">
                            {tc('logIn')}
                        </Button>
                    </Link>
                    <Link href="/signup">
                        <Button className="font-bold shadow-[0_0_15px_rgba(124,58,237,0.5)] hover:shadow-[0_0_25px_rgba(124,58,237,0.7)] transition-all">
                            {tc('getStarted')}
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}
