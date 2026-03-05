'use client'

import { useState, useTransition } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Save, Loader2, CheckCircle } from "lucide-react"
import { updateProfile } from '@/app/(dashboard)/settings/actions'
import { useTranslations } from "next-intl"


interface ProfileFormProps {
    user: {
        id: string
        email: string
    }
    profile: {
        full_name: string | null
        brand_name: string | null
        phone: string | null
        email: string | null
    } | null
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition()
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const t = useTranslations('Settings')
    const tc = useTranslations('Common')

    async function handleSubmit(formData: FormData) {
        setSuccess(false)
        setError(null)

        startTransition(async () => {
            try {
                const result = await updateProfile(formData) as any
                if (result.error) {
                    setError(result.error)
                } else {
                    setSuccess(true)
                    setTimeout(() => setSuccess(false), 3000)
                }
            } catch (err) {
                setError(tc('somethingWentWrong'))
            }
        })
    }

    return (
        <Card className="bg-card border-border backdrop-blur-sm">
            <CardHeader>
                <CardTitle>{t('profileTitle')}</CardTitle>
                <CardDescription>{t('profileDesc')}</CardDescription>
            </CardHeader>
            <form action={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6 pb-6 border-b border-border">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-purple-900 border-4 border-black shadow-xl flex items-center justify-center text-3xl font-black text-foreground uppercase">
                            {profile?.full_name ? profile.full_name.substring(0, 2) : user.email.substring(0, 2)}
                        </div>
                        <div className="space-y-2">
                            {/* Avatar upload could go here later */}
                            <Button type="button" variant="outline" size="sm" className="border-border hover:bg-muted/50" disabled>{t('changeAvatar')}</Button>
                            <p className="text-xs text-muted-foreground">{t('avatarHint')}</p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm font-medium flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" /> {t('profileUpdated')}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>{t('fullName')}</Label>
                            <Input
                                name="fullName"
                                placeholder="Abdel"
                                defaultValue={profile?.full_name || ''}
                                className="bg-muted/50 border-border focus:border-primary/50 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('email')}</Label>
                            <Input
                                disabled
                                value={profile?.email || user.email}
                                className="bg-muted/50 border-border opacity-50 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('companyName')}</Label>
                            <Input
                                name="brandName"
                                placeholder="Yalla Viral"
                                defaultValue={profile?.brand_name || ''}
                                className="bg-muted/50 border-border focus:border-primary/50 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>{t('phoneNumber')}</Label>
                            <Input
                                name="phone"
                                placeholder="+212 6..."
                                defaultValue={profile?.phone || ''}
                                className="bg-muted/50 border-border focus:border-primary/50 transition-colors"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t border-border px-6 py-4 flex justify-end">
                    <Button type="submit" disabled={isPending} className="font-bold shadow-lg shadow-primary/20">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('saving')}
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> {t('saveChanges')}
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
