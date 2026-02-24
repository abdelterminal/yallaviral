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
            }
        })
    }

    if (success) {
        return (
            <div className="w-full max-w-[400px] flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
                <div className="h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20 shadow-xl shadow-green-500/10">
                    <Sparkles className="h-10 w-10 text-green-400" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black text-white tracking-tight">{t('checkYourEmail')}</h2>
                    <p className="text-muted-foreground max-w-xs mx-auto text-base">
                        {t('confirmationSent')}
                    </p>
                </div>
                <div className="w-full max-w-xs space-y-3 pt-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-muted-foreground space-y-1">
                        <p className="font-bold text-white/60">{t('didntReceive')}</p>
                        <p>{t('checkSpam')}</p>
                    </div>
                    <Link href="/login">
                        <Button className="w-full font-bold bg-white text-black hover:bg-gray-200 mt-2">
                            {t('goToLogin')}
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-[400px] flex flex-col h-full justify-center max-h-[800px]">
            <div className="mb-6 text-center lg:text-left">
                <h2 className="text-4xl font-black text-white tracking-tight mb-1">{t('createAccount')}</h2>
                <p className="text-base text-muted-foreground">{t('createAccountSubtitle')}</p>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-xs">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            <form action={handleSubmit} className="space-y-4" noValidate>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="fullName" className="text-white text-xs font-black uppercase opacity-60 ml-1">{t('fullName')}</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            placeholder={t('namePlaceholder')}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/30 h-10 rounded-xl focus:border-primary/50 text-base transition-all focus:bg-white/10"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="brandName" className="text-white text-xs font-black uppercase opacity-60 ml-1">{t('company')}</Label>
                        <Input
                            id="brandName"
                            name="brandName"
                            placeholder={t('companyPlaceholder')}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/30 h-10 rounded-xl focus:border-primary/50 text-base transition-all focus:bg-white/10"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-white text-xs font-black uppercase opacity-60 ml-1">{t('email')}</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder={t('emailPlaceholder')}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/30 h-10 rounded-xl focus:border-primary/50 text-base transition-all focus:bg-white/10"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-white text-xs font-black uppercase opacity-60 ml-1">{t('phone')}</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder={t('phonePlaceholder')}
                            required
                            className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/30 h-10 rounded-xl focus:border-primary/50 text-base transition-all focus:bg-white/10"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-white text-xs font-black uppercase opacity-60 ml-1">{t('password')}</Label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        className="bg-white/5 border-white/10 text-white h-10 rounded-xl focus:border-primary/50 text-base transition-all focus:bg-white/10"
                    />
                </div>

                {/* Bot Verification Box */}
                <div className="py-2">
                    <div className="relative">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-all cursor-pointer group active:scale-[0.99] hover:border-white/20 select-none">
                            <div className="h-5 w-5 rounded-lg border-2 border-primary/50 flex items-center justify-center bg-black transition-all group-hover:border-primary relative shrink-0 text-primary">
                                <input
                                    type="checkbox"
                                    id="robot"
                                    name="robot"
                                    className="opacity-0 absolute inset-0 cursor-pointer z-10 peer"
                                />
                                <CheckCircle2 className="h-3.5 w-3.5 opacity-0 peer-checked:opacity-100 transition-opacity" />
                            </div>
                            <Label htmlFor="robot" className="text-xs text-white/70 cursor-pointer font-bold select-none group-hover:text-white transition-colors">
                                {t('notRobot')}
                            </Label>
                            <div className="ml-auto opacity-30 text-[8px] font-black tracking-widest uppercase">
                                {t('secure')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full h-12 font-black text-base bg-primary hover:bg-primary/90 text-white shadow-[0_8px_16px_rgba(124,58,237,0.2)] rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:grayscale"
                    >
                        {isPending ? (
                            <Loader2 className="h-5 w-5 animate-spin text-white" />
                        ) : (
                            <>
                                <Sparkles className="h-4 w-4 mr-2" />
                                {t('createAccount')}
                            </>
                        )}
                    </Button>
                </div>

                <div className="text-center pt-2">
                    <p className="text-sm text-muted-foreground font-medium">
                        {t('alreadyHaveAccount')}{" "}
                        <Link href="/login" className="text-primary hover:underline font-black ml-1">
                            {t('signIn')}
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}
