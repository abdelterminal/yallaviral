import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Read from default ".env.local" file.
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'list',
    timeout: 120000, // 2 minutes for entire test
    globalSetup: require.resolve('./tests/e2e/global.setup'),
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
        // Use the auth state saved during global setup
        storageState: './tests/e2e/.auth/user.json',
        navigationTimeout: 60000, // 1 min for initial Next.js compile
        actionTimeout: 15000,
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],
    webServer: {
        command: 'npm start',
        url: 'http://localhost:3000',
        reuseExistingServer: !process.env.CI,
    },
});
