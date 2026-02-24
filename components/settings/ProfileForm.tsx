'use client'

import { useState, useTransition } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Save, Loader2, CheckCircle } from "lucide-react"
import { updateProfile } from '@/app/(dashboard)/settings/actions'


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
                setError("Something went wrong. Please try again.")
            }
        })
    }

    return (
        <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and public profile.</CardDescription>
            </CardHeader>
            <form action={handleSubmit}>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6 pb-6 border-b border-white/10">
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-purple-900 border-4 border-black shadow-xl flex items-center justify-center text-3xl font-black text-white uppercase">
                            {profile?.full_name ? profile.full_name.substring(0, 2) : user.email.substring(0, 2)}
                        </div>
                        <div className="space-y-2">
                            {/* Avatar upload could go here later */}
                            <Button type="button" variant="outline" size="sm" className="border-white/10 hover:bg-white/5" disabled>Change Avatar</Button>
                            <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size of 800K</p>
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm font-medium flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" /> Profile updated successfully
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Full Name</Label>
                            <Input
                                name="fullName"
                                placeholder="Abdel"
                                defaultValue={profile?.full_name || ''}
                                className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                disabled
                                value={profile?.email || user.email}
                                className="bg-white/5 border-white/10 opacity-50 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input
                                name="brandName"
                                placeholder="Yalla Viral"
                                defaultValue={profile?.brand_name || ''}
                                className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number</Label>
                            <Input
                                name="phone"
                                placeholder="+212 6..."
                                defaultValue={profile?.phone || ''}
                                className="bg-white/5 border-white/10 focus:border-primary/50 transition-colors"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t border-white/10 px-6 py-4 flex justify-end">
                    <Button type="submit" disabled={isPending} className="font-bold shadow-lg shadow-primary/20">
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" /> Save Changes
                            </>
                        )}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}
