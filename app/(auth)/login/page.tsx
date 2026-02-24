import { LoginForm } from '@/components/auth/LoginForm';
import { Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import Link from 'next/link';

export async function generateMetadata() {
    const t = await getTranslations('Auth');
    return {
        title: `${t('loginTitle')} | YallaViral`,
    };
}

export default async function LoginPage() {
    const t = await getTranslations('Auth');

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-sans selection:bg-primary/30 selection:text-white relative p-6">

            {/* Language Switcher container for Auth */}
            <div className="absolute top-8 right-8 z-50">
                <LanguageSwitcher />
            </div>

            {/* Main Centered Content */}
            <div className="w-full max-w-[440px] flex flex-col items-center">

                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-2 mb-10 group transition-transform hover:scale-105 active:scale-95">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.5)]">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-black text-3xl tracking-tight">Yalla<span className="text-primary">Viral</span></span>
                </Link>

                {/* Form Container */}
                <div className="w-full bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl backdrop-blur-sm relative z-10">
                    <LoginForm />
                </div>

            </div>
        </div>
    );
}
