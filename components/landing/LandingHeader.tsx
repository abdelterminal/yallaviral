"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { YallaLogo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function LandingHeader() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const t = useTranslations('Landing');
    const tc = useTranslations('Common');

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change / resize
    useEffect(() => {
        const close = () => setMobileOpen(false);
        window.addEventListener("resize", close);
        return () => window.removeEventListener("resize", close);
    }, []);

    const navLinks = [
        { href: "#features", label: t('navFeatures') },
        { href: "/models", label: t('navCrowd') },
        { href: "/studio", label: t('navStudios') },
    ];

    return (
        <>
            <header
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
                    isScrolled ? "py-3" : "py-5"
                )}
            >
                <div className="container max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between relative">

                    {/* LEFT: Logo — sits outside the pill */}
                    <Link href="/" className="flex items-center gap-2.5 group shrink-0 relative z-10">
                        <div className={cn(
                            "p-2 rounded-xl border transition-all duration-300 backdrop-blur-sm",
                            isScrolled
                                ? "bg-white/10 border-white/15 group-hover:bg-white/20"
                                : "bg-white/10 border-white/20 group-hover:bg-white/20"
                        )}>
                            <YallaLogo className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-white">YallaViral</span>
                    </Link>

                    {/* CENTER: Nav pill — frosted glass */}
                    <nav className={cn(
                        "hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2 transition-all duration-500",
                        isScrolled
                            ? "bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-2 py-1.5 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.4)]"
                            : "bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-full px-2 py-1.5"
                    )}>
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* RIGHT: Auth + Language — sits outside the pill */}
                    <div className="hidden md:flex items-center gap-3 shrink-0 relative z-10">
                        <LanguageSwitcher />
                        <Link href="/login">
                            <Button variant="ghost" className="text-sm font-semibold text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-full h-10 px-4">
                                {tc('logIn')}
                            </Button>
                        </Link>
                        <Link href="/signup">
                            <Button className={cn(
                                "h-10 px-5 text-sm font-bold rounded-full border-0 transition-all duration-300 hover:scale-105",
                                "bg-white text-[#0B0E17] hover:bg-white/95 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                            )}>
                                {tc('getStarted')}
                            </Button>
                        </Link>
                    </div>

                    {/* MOBILE: Hamburger button */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden relative z-10 h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Background bar that appears on scroll */}
                <div className={cn(
                    "absolute inset-0 transition-all duration-500 -z-10",
                    isScrolled
                        ? "bg-[#0B0E17]/70 backdrop-blur-xl border-b border-white/[0.06]"
                        : "bg-transparent"
                )} />
            </header>

            {/* MOBILE: Slide-out drawer */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Drawer panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 bottom-0 w-[300px] bg-[#0B0E17] border-l border-white/10 z-50 md:hidden flex flex-col"
                        >
                            {/* Drawer header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <span className="text-lg font-black text-white tracking-tight">Menu</span>
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="h-10 w-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Drawer nav links */}
                            <div className="flex-1 flex flex-col gap-1 p-4">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex items-center text-lg font-bold text-white/70 hover:text-white hover:bg-white/10 px-4 py-3.5 rounded-2xl transition-all"
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Drawer footer: auth */}
                            <div className="p-6 border-t border-white/10 space-y-3">
                                <div className="flex justify-center mb-2">
                                    <LanguageSwitcher />
                                </div>
                                <Link href="/login" onClick={() => setMobileOpen(false)}>
                                    <Button variant="ghost" className="w-full h-12 text-base font-bold text-white/70 hover:text-white hover:bg-white/10 border border-white/10 rounded-2xl transition-all">
                                        {tc('logIn')}
                                    </Button>
                                </Link>
                                <Link href="/signup" onClick={() => setMobileOpen(false)} className="block mt-3">
                                    <Button className="w-full h-12 text-base font-bold bg-primary text-white hover:bg-primary/90 shadow-[0_0_20px_rgba(0,82,255,0.3)] border-0 rounded-2xl">
                                        {tc('getStarted')}
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
