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
        <div className="min-h-screen bg-[#0B0E17] flex flex-col items-center justify-center text-white font-sans selection:bg-primary/30 selection:text-white relative p-6 overflow-hidden">

            {/* Ambient background effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDelay: '1s' }} />

            {/* Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

            {/* Language Switcher container for Auth */}
            <div className="absolute top-8 right-8 z-50">
                <LanguageSwitcher />
            </div>

            {/* Main Centered Content */}
            <div className="w-full max-w-[480px] flex flex-col items-center relative z-10">

                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-3 mb-10 group transition-all hover:scale-105 active:scale-95">
                    <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(0,82,255,0.4)] group-hover:shadow-[0_0_30px_rgba(0,82,255,0.6)] transition-all">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-black text-3xl tracking-tighter text-white">Yalla<span className="text-primary">Viral</span></span>
                </Link>

                {/* Form Container (Frosted Glass) */}
                <div className="w-full bg-[#0B0E17]/60 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] relative">
                    {/* Inner Glow */}
                    <div className="absolute -inset-px rounded-[3rem] bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                    <LoginForm />
                </div>

            </div>
        </div>
    );
}
