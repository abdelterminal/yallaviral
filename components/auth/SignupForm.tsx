'use client'

import { useState, useTransition } from 'react'
import { signup } from '@/app/(auth)/login/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from 'next/link'
import { AlertCircle, CheckCircle2, Sparkles, Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"

export default function SignupForm() {
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const t = useTranslations('Auth')

    async function handleSubmit(formData: FormData) {
        setError(null)
        setSuccess(null)

        const fullName = formData.get('fullName')
        const brandName = formData.get('brandName')
        const email = formData.get('email')
        const phone = formData.get('phone')
        const password = formData.get('password')
        const isRobotChecked = formData.get('robot') === 'on'

        if (!fullName || !brandName || !email || !phone || !password) {
            setError(t('allFieldsRequired'))
            return
        }

        if (!isRobotChecked) {
            setError(t('notRobotConfirm'))
            return
        }

        startTransition(async () => {
            try {
                const result = await signup(formData) as any

                if (result?.error) {
                    setError(result.error)
                    const passwordInput = document.getElementById('password') as HTMLInputElement;
                    if (passwordInput) passwordInput.value = '';
                    return
                }

                if (result?.success) {
                    setSuccess(result.message)
                }
            } catch (error: any) {
                if (error?.message === 'NEXT_REDIRECT' || error?.digest?.startsWith?.('NEXT_REDIRECT')) {
                    throw error
                }
                setError(error.message || t('somethingWentWrong'))
                const passwordInput = document.getElementById('password') as HTMLInputElement;
                if (passwordInput) passwordInput.value = '';
            }
        })
    }

    if (success) {
        return (
            <div className="w-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in-95 duration-500 relative z-10">
                <div className="h-24 w-24 bg-emerald-500/10 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)] border border-emerald-500/30">
                    <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                </div>
                <div className="space-y-3">
                    <h2 className="text-3xl font-black text-white tracking-tight">{t('checkYourEmail')}</h2>
                    <p className="text-white/50 max-w-sm mx-auto text-lg leading-relaxed">
                        {t('confirmationSent')}
                    </p>
                </div>
                <div className="w-full space-y-4 pt-4">
                    <div className="p-4 rounded-[2rem] bg-white/5 border border-white/10 text-sm text-white/50 space-y-2">
                        <p className="font-black uppercase tracking-widest text-xs text-white/70">{t('didntReceive')}</p>
                        <p>{t('checkSpam')}</p>
                    </div>
                    <Link href="/login" className="block w-full">
                        <Button className="w-full h-14 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-2xl group transition-all">
                            {t('goToLogin')}
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full flex flex-col relative z-20">
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-black text-white tracking-tight mb-2">{t('createAccount')}</h2>
                <p className="text-lg text-white/50 font-medium">{t('createAccountSubtitle')}</p>
            </div>

            {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <p className="font-semibold">{error}</p>
                </div>
            )}

            <form action={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-xs font-black uppercase tracking-widest text-white/50 ml-1">{t('fullName')}</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            placeholder={t('namePlaceholder')}
                            required
                            className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl focus:ring-primary/40 focus:border-primary focus:placeholder-transparent transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="brandName" className="text-xs font-black uppercase tracking-widest text-white/50 ml-1">{t('company')}</Label>
                        <Input
                            id="brandName"
                            name="brandName"
                            placeholder={t('companyPlaceholder')}
                            required
                            className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl focus:ring-primary/40 focus:border-primary focus:placeholder-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-white/50 ml-1">{t('email')}</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={t('emailPlaceholder')}
                            required
                            className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl focus:ring-primary/40 focus:border-primary focus:placeholder-transparent transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-white/50 ml-1">{t('phone')}</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder={t('phonePlaceholder')}
                            required
                            className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl focus:ring-primary/40 focus:border-primary focus:placeholder-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-white/50 ml-1">{t('password')}</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        className="h-12 bg-white/5 border-white/10 text-white placeholder:text-slate-600 rounded-2xl focus:ring-primary/40 focus:border-primary focus:placeholder-transparent transition-all"
                    />
                </div>

                {/* Bot Verification Box */}
                <div className="py-4">
                    <div className="relative">
                        <div className="flex items-center gap-4 p-4 rounded-[1.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer group active:scale-[0.99] select-none">
                            <div className="h-6 w-6 rounded-lg border-2 border-primary/40 flex items-center justify-center bg-[#0B0E17] transition-all group-hover:border-primary relative shrink-0 text-primary">
                                <input
                                    type="checkbox"
                                    id="robot"
                                    name="robot"
                                    className="opacity-0 absolute inset-0 cursor-pointer z-10 peer"
                                />
                                <CheckCircle2 className="h-4 w-4 opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <Label htmlFor="robot" className="text-sm text-white/50 cursor-pointer font-bold select-none group-hover:text-white transition-colors">
                                {t('notRobot')}
                            </Label>
                            <div className="ml-auto opacity-20 text-[10px] font-black tracking-widest uppercase text-white">
                                {t('secure')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-[0_0_30px_rgba(0,82,255,0.3)] hover:shadow-[0_0_40px_rgba(0,82,255,0.5)] transition-all disabled:opacity-70"
                    >
                        {isPending ? (
                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                        ) : (
                            <span className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                {t('createAccount')}
                            </span>
                        )}
                    </Button>
                </div>

                <div className="text-center pt-4">
                    <p className="text-sm text-white/50 font-medium">
                        {t('alreadyHaveAccount')}{" "}
                        <Link href="/login" className="text-primary hover:text-primary/80 font-black ml-1 transition-colors">
                            {t('signIn')}
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}
