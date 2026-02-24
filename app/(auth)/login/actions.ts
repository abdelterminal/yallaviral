'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { createClient } from '@/utils/supabase/server'
import { actionRateLimit, strictRateLimit, checkRateLimit } from '@/lib/rate-limit'

export async function login(formData: FormData) {
    // Rate limit login (prevent brute force)
    const ip = (await headers()).get('x-forwarded-for') ?? '127.0.0.1'
    const rateLimit = await checkRateLimit(actionRateLimit, `login_${ip}`, 'Login')
    if (!rateLimit.success) return redirect(`/login?error=${encodeURIComponent(rateLimit.error!)}`)

    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        // Map internal errors to user-friendly messages
        const friendlyMessages: Record<string, string> = {
            'Invalid login credentials': 'Incorrect email or password. Please try again.',
            'Email not confirmed': 'Please verify your email address before logging in.',
        };
        const message = friendlyMessages[error.message] || 'Something went wrong. Please try again.';
        return redirect(`/login?error=${encodeURIComponent(message)}`)
    }

    const { data: { user } } = await supabase.auth.getUser();

    let isAdmin = false;
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
        isAdmin = profile?.role === 'admin';
    }

    revalidatePath('/', 'layout')

    if (isAdmin) {
        redirect('/admin')
    } else {
        redirect('/dashboard')
    }
}

import { createAdminClient } from '@/utils/supabase/admin'

export async function signup(formData: FormData) {
    // Stricter rate limit for signups (prevent spam accounts)
    const ip = (await headers()).get('x-forwarded-for') ?? '127.0.0.1'
    const rateLimit = await checkRateLimit(strictRateLimit, `signup_${ip}`, 'Signup')
    if (!rateLimit.success) return { error: rateLimit.error }

    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    if (!password || password.length < 8) {
        return { error: 'Password must be at least 8 characters long.' }
    }

    const fullName = formData.get('fullName') as string
    const brandName = formData.get('brandName') as string
    const phone = formData.get('phone') as string

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    // Create a profile for the new user using ADMIN client to bypass RLS
    if (data.user) {
        const { error: profileError } = await adminSupabase
            .from('profiles')
            .insert([
                {
                    id: data.user.id,
                    full_name: fullName || email.split('@')[0],
                    brand_name: brandName,
                    phone: phone,
                    email: email, // Save email to profiles table
                    role: 'client'
                }
            ])

        if (profileError) {
            console.error("Profile creation error:", profileError)
            return { error: "Account created but profile setup failed. Please contact support." }
        }
    }

    // Check if session is established (email confirmed or not required)
    if (data.session) {
        revalidatePath('/', 'layout')
        redirect('/dashboard')
    } else {
        // Email confirmation required
        return { success: true, message: "Please check your email to confirm your account." }
    }
}
