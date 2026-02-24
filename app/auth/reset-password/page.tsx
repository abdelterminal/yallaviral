'use client'

import { useState, useEffect } from 'react'
import { updatePassword } from '@/app/(auth)/login/forgot-password/actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { YallaLogo } from "@/components/Logo"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ShieldCheck, Eye, EyeOff } from "lucide-react"
import { createClient } from '@/utils/supabase/client'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isValidSession, setIsValidSession] = useState<boolean | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Supabase automatically exchanges the token from the URL hash
        // We just need to check if a session exists after the exchange
        const supabase = createClient()

        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setIsValidSession(!!session)
        }

        // Listen for auth state changes (token exchange happens automatically)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event) => {
                if (event === 'PASSWORD_RECOVERY') {
                    setIsValidSession(true)
                }
            }
        )

        checkSession()

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.')
            return
        }

        setIsLoading(true)

        const result = await updatePassword(password)

        if (result.error) {
            setError(result.error)
        } else {
            setIsSuccess(true)
            // Redirect to dashboard after 2 seconds
            setTimeout(() => {
                router.push('/dashboard')
            }, 2000)
        }

        setIsLoading(false)
    }

    // Loading state while checking session
    if (isValidSession === null) {
        return (
            <div className="h-screen flex items-center justify-center bg-black">
                <div className="h-8 w-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    // Invalid or expired link
    if (!isValidSession) {
        return (
            <div className="h-screen flex items-center justify-center bg-black font-sans p-6">
                <div className="w-full max-w-[400px] text-center space-y-6">
                    <div className="mx-auto h-16 w-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <ShieldCheck className="h-8 w-8 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Invalid or Expired Link</h2>
                    <p className="text-sm text-muted-foreground">
                        This password reset link has expired or is invalid. Please request a new one.
                    </p>
                    <Link href="/login/forgot-password">
                        <Button className="font-bold bg-primary hover:bg-primary/90 text-white rounded-xl">
                            Request New Link
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-sans selection:bg-primary/30 selection:text-white relative p-6">
            <div className="w-full max-w-[440px] flex flex-col items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 mb-10 group transition-transform hover:scale-105 active:scale-95">
                    <div className="h-8 w-8 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all">
                        <YallaLogo className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-black text-3xl tracking-tight">Yalla<span className="text-primary">Viral</span></span>
                </Link>

                <div className="w-full bg-white/5 border border-white/10 p-8 rounded-3xl shadow-xl backdrop-blur-sm relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {!isSuccess ? (
                        <>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-black tracking-tight mb-2">New Password</h2>
                                <p className="text-sm text-slate-400">
                                    Choose a strong password for your account.
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs animate-in fade-in slide-in-from-top-1">
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="password" className="text-white text-xs font-black uppercase opacity-60 ml-1 tracking-wider">
                                        New Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            minLength={8}
                                            className="bg-white/5 border-white/10 text-white h-10 rounded-xl focus:border-primary/50 text-base transition-all focus:bg-white/10 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Label htmlFor="confirmPassword" className="text-white text-xs font-black uppercase opacity-60 ml-1 tracking-wider">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength={8}
                                        className="bg-white/5 border-white/10 text-white h-10 rounded-xl focus:border-primary/50 text-base transition-all focus:bg-white/10"
                                    />
                                </div>

                                {/* Password strength indicator */}
                                <div className="space-y-1">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-1 flex-1 rounded-full transition-colors ${password.length >= level * 3
                                                    ? password.length >= 12
                                                        ? 'bg-emerald-500'
                                                        : password.length >= 8
                                                            ? 'bg-amber-500'
                                                            : 'bg-red-500'
                                                    : 'bg-white/10'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">
                                        {password.length === 0 ? '' :
                                            password.length < 8 ? 'Too short — minimum 8 characters' :
                                                password.length < 12 ? 'Good' : 'Strong'}
                                    </p>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading || password.length < 8}
                                    className="w-full h-12 font-bold text-base bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all rounded-xl mt-6 group disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Updating...
                                        </span>
                                    ) : (
                                        'Set New Password'
                                    )}
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-500">
                            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Password Updated!</h2>
                            <p className="text-sm text-slate-400">
                                Redirecting you to dashboard...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
