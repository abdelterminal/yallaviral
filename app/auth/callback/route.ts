import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

// This route handles the Supabase auth callback after:
// 1. Email confirmation (signup)
// 2. Password reset link click
// 3. OAuth login callbacks
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') || '/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            return NextResponse.redirect(new URL(next, request.url))
        }
    }

    // If code exchange failed or no code, redirect to login with error
    return NextResponse.redirect(
        new URL('/login?error=Could+not+verify+your+account.+Please+try+again.', request.url)
    )
}
