"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { Sparkles, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from '@/utils/supabase/client';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState('');
    const t = useTranslations('Auth');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const supabase = createClient();

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) {
                console.error('Password reset error:', error);
                // Even on error, we show success to prevent email enumeration
            }
        } catch (error) {
            console.error('Unexpected error during password reset:', error);
        } finally {
            setIsLoading(false);
            setIsSubmitted(true);
        }
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-sans selection:bg-primary/30 selection:text-white relative p-6">

            <div className="absolute top-8 right-8 z-50">
                <LanguageSwitcher />
            </div>

            <div className="w-full max-w-[440px] flex flex-col items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 mb-10 group transition-transform hover:scale-105 active:scale-95">
                    <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all">
                        <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-black text-3xl tracking-tight">Yalla<span className="text-primary">Viral</span></span>
                </Link>

                <div className="w-full bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl backdrop-blur-sm relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black tracking-tight mb-2">{t('forgotTitle')}</h1>
                        <p className="text-sm text-slate-400">{t('forgotSubtitle')}</p>
                    </div>

                    {isSubmitted ? (
                        <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
                            <div className="mx-auto w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mb-4 border border-green-500/20">
                                <CheckCircle2 className="h-6 w-6 text-green-400" />
                            </div>
                            <h2 className="text-xl font-bold">{t('checkEmail')}</h2>
                            <p className="text-sm text-slate-400">
                                {t('checkEmailDesc')}
                            </p>
                            <Link href="/login" className="inline-block mt-4 text-primary hover:text-primary/80 font-bold transition-colors">
                                {t('backToLogin')}
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs font-black uppercase tracking-wider text-slate-400 ml-1">{t('emailAddress')}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    required
                                    className="h-12 bg-white/5 border-white/10 focus:border-primary/50 text-white placeholder:text-slate-600 rounded-xl transition-all"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 font-bold text-base bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all rounded-xl mt-6 group"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        {t('sendResetLink')} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>

                            <div className="text-center mt-6">
                                <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
                                    {t('backToLogin')}
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
