'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { strictRateLimit, checkRateLimit } from '@/lib/rate-limit'

export async function requestPasswordReset(formData: FormData) {
    const ip = (await headers()).get('x-forwarded-for') ?? '127.0.0.1'
    const rateLimit = await checkRateLimit(strictRateLimit, `reset_${ip}`, 'Password Reset')
    if (!rateLimit.success) return { error: rateLimit.error }

    const supabase = await createClient()
    const email = formData.get('email') as string

    if (!email) {
        return { error: 'Email is required.' }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password`,
    })

    if (error) {
        // Don't reveal whether the email exists or not (security best practice)
        console.error('Password reset error:', error.message)
    }

    // Always return success to prevent email enumeration attacks
    return { success: true }
}

export async function updatePassword(newPassword: string) {
    const supabase = await createClient()

    if (!newPassword || newPassword.length < 8) {
        return { error: 'Password must be at least 8 characters long.' }
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    })

    if (error) {
        return { error: 'Failed to update password. The reset link may have expired.' }
    }

    return { success: true }
}
