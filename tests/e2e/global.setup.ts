import { chromium, type FullConfig } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

async function globalSetup(config: FullConfig) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Fallback if environment variables aren't loaded correctly
    if (!supabaseUrl || !supabaseServiceKey) {
        console.warn("⚠️ Supabase credentials missing during test setup. Tests may fail.");
    }

    const adminAuthClient = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    const TEST_EMAIL = "test-e2e@yallaviral.com";
    const TEST_PASSWORD = "test-password-123!";

    // Create or reset test user using admin client (bypasses RLS)
    try {
        // 1. Delete user if exists (requires retrieving by email first logic via admin API)
        const { data: usersData } = await adminAuthClient.auth.admin.listUsers();
        const existingUser = usersData.users.find(u => u.email === TEST_EMAIL);

        if (existingUser) {
            await adminAuthClient.auth.admin.deleteUser(existingUser.id);
        }

        // 2. Create fresh test user, auto confirmed
        const { data: newUser, error: createError } = await adminAuthClient.auth.admin.createUser({
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
            email_confirm: true,
        });

        if (createError) throw createError;

        if (newUser.user) {
            // Also ensure we have a profile to bypass the "no active user" errors in dashboard
            await adminAuthClient.from('profiles').upsert({
                id: newUser.user.id,
                full_name: 'E2E Test User',
                email: TEST_EMAIL,
                role: 'client'
            });
        }
    } catch (error) {
        console.error("Failed to seed test user:", error);
    }

    // Now log in via the UI to capture the exact Next.js cookies
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', TEST_EMAIL);
    await page.fill('input[name="password"]', TEST_PASSWORD);

    // Use the actual submit button from your login form
    // We target button containing "Log in" or matching type="submit"
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard
    await page.waitForURL('http://localhost:3000/dashboard');

    // Save state
    await page.context().storageState({ path: './tests/e2e/.auth/user.json' });
    await browser.close();
}

export default globalSetup;
