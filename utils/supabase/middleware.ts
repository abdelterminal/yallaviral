import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    try {
        const {
            data: { user },
            error
        } = await supabase.auth.getUser()

        // If we get a specific Refresh Token error, we should clear the cookies
        // so the system doesn't keep trying to refresh an invalid token.
        const errorMsg = error?.message?.toLowerCase() || '';
        if (error && (errorMsg.includes('refresh_token_not_found') || errorMsg.includes('invalid refresh token'))) {
            const clearResponse = NextResponse.next({ request });
            // By returning a fresh response without the session cookies, 
            // the client-side will effectively be logged out.
            return clearResponse;
        }

        if (
            !user &&
            !request.nextUrl.pathname.startsWith('/login') &&
            !request.nextUrl.pathname.startsWith('/auth') &&
            !request.nextUrl.pathname.startsWith('/signup') &&
            request.nextUrl.pathname !== '/'
        ) {
            // no user, potentially respond by redirecting the user to the login page
            const url = request.nextUrl.clone()
            url.pathname = '/login'
            return NextResponse.redirect(url)
        }

        // Admin Route Protection
        if (request.nextUrl.pathname.startsWith('/admin')) {
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();

                if (profile?.role !== 'admin') {
                    // Redirect unauthorized users to home
                    const url = request.nextUrl.clone()
                    url.pathname = '/'
                    return NextResponse.redirect(url)
                }
            }
        }
    } catch (e) {
        // Fallback for unexpected errors during getUser
        console.error('Middleware Auth Error:', e);
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
    // creating a new Response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    return supabaseResponse
}
