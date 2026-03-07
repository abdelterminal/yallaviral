"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();
    const t = useTranslations('Auth');

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                setError(signInError.message);
                setIsLoading(false);
                const passwordInput = document.getElementById('password') as HTMLInputElement;
                if (passwordInput) passwordInput.value = '';
                return;
            }

            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setError(t('signInError'));
            setIsLoading(false);
            const passwordInput = document.getElementById('password') as HTMLInputElement;
            if (passwordInput) passwordInput.value = '';
        }
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
            {/* Context Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl font-black tracking-tight mb-2 text-white">{t('welcomeBack')}</h2>
                <p className="text-slate-400 font-medium">{t('loginSubtitle')}</p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-4 rounded-2xl font-semibold animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                        {t('emailAddress')}
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@company.com"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        required
                        disabled={isLoading}
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-2xl focus:ring-primary/40 focus:border-primary focus:placeholder-transparent transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                        <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400">
                            {t('password')}
                        </Label>
                        <Link href="/login/forgot-password" className="text-xs font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-all">
                            {t('forgotPassword')}
                        </Link>
                    </div>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                        disabled={isLoading}
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-2xl focus:ring-primary/40 focus:border-primary focus:placeholder-transparent transition-all"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg mt-6 group rounded-2xl shadow-[0_0_30px_rgba(0,82,255,0.3)] hover:shadow-[0_0_40px_rgba(0,82,255,0.5)] transition-all"
                >
                    {isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                        <span className="flex items-center gap-2">
                            {t('signInBtn')} <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    )}
                </Button>
            </form>

            <div className="text-center mt-6">
                <p className="text-sm text-slate-400 font-medium">
                    {t('dontHaveAccount')}{" "}
                    <Link href="/signup" className="text-primary hover:text-primary/80 font-black transition-colors ml-1">
                        {t('signUpLink')}
                    </Link>
                </p>
            </div>
        </div>
    );
}
