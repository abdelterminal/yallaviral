import SignupForm from '@/components/auth/SignupForm';
import { Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import Link from 'next/link';

export async function generateMetadata() {
    const t = await getTranslations('Auth');
    return {
        title: `${t('signupTitle')} | YallaViral`,
    };
}

export default async function SignupPage() {
    const t = await getTranslations('Auth');

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center text-foreground font-sans selection:bg-primary/30 selection:text-foreground relative p-6">

            {/* Language Switcher */}
            <div className="absolute top-8 right-8 z-50">
                <LanguageSwitcher />
            </div>

            {/* Main Centered Content */}
            <div className="w-full max-w-[440px] flex flex-col items-center">

                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-2 mb-10 group transition-transform hover:scale-105 active:scale-95">
                    <div className="h-8 w-8 bg-primary rounded-xl flex items-center justify-center shadow-[0_4px_14px_-4px_hsl(var(--primary)/0.5)]">
                        <Sparkles className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <span className="font-black text-3xl tracking-tight">Yalla<span className="text-primary">Viral</span></span>
                </Link>

                {/* Form Container */}
                <div className="w-full bg-card border-0 p-8 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative z-10">
                    <SignupForm />
                </div>

            </div>
        </div>
    );
}
