import { test, expect } from '@playwright/test';

test.describe('Core Campaign Booking Flow', () => {

    test('should allow a logged-in user to create a campaign and redirect to success', async ({ page }) => {
        // Since we use globalSetup, we are already logged in via storageState.
        page.on('dialog', async dialog => {
            console.log('🚨 ALERT:', dialog.message());
            await dialog.accept();
        });

        await test.step('Navigate to Campaign Builder', async () => {
            await page.goto('/campaign');
            // Ensure we are on the first step: Setup
            await expect(page.getByText("Let's set up your campaign")).toBeVisible({ timeout: 10000 });
        });

        await test.step('Step 1: Setup', async () => {
            // Select "I need creators" which auto-advances
            await page.getByText('I need creators', { exact: true }).first().click();
        });

        await test.step('Step 2: Talent Selection', async () => {
            // Wait for models to load
            await expect(page.getByText('Select Your Talent')).toBeVisible();
            // Click "Select" on the first available model
            const selectBtn = page.getByRole('button', { name: 'Select', exact: true }).first();
            await expect(selectBtn).toBeVisible();
            await selectBtn.click();
            await page.getByRole('button', { name: 'Continue' }).click();
        });

        await test.step('Step 3: Video Style', async () => {
            // Wait for Style step
            await expect(page.getByText('Select Components')).toBeVisible();
            await page.getByText('Performance Ad').click();
            await page.getByRole('button', { name: 'Continue' }).click();
        });

        await test.step('Step 4: Studio Selection', async () => {
            // Wait for Studio step
            await expect(page.getByText('Select a Studio')).toBeVisible();
            // Select the first studio available
            const firstStudio = page.locator('.cursor-pointer').first();
            await expect(firstStudio).toBeVisible();
            await firstStudio.click();
            await page.getByRole('button', { name: 'Continue' }).click();
        });

        await test.step('Step 5: Creative Brief', async () => {
            // Brief step
            await expect(page.getByText('Creative Needs')).toBeVisible();
            await page.getByRole('button', { name: 'Continue' }).click();
        });

        await test.step('Step 6: Schedule', async () => {
            // Schedule step
            await expect(page.getByText('Schedule Your Shoot')).toBeVisible();

            // Pick a future date to ensure it's not disabled/booked
            const availableDay = page.locator('.rdp-day:not(.rdp-day_disabled)').last();
            await availableDay.click();

            // Click a specific time slot, wait until it is actually enabled
            const timeBtn = page.getByText('04:00 PM', { exact: true }).first();
            await expect(timeBtn).toBeEnabled({ timeout: 10000 });
            await timeBtn.click();

            // Finally, go Next
            await page.getByRole('button', { name: 'Continue' }).click();
        });

        await test.step('Step 7: Review and Submit', async () => {
            // Review Step
            await expect(page.getByText('Review & Submit')).toBeVisible();
            await expect(page.getByText('Estimated Quote')).toBeVisible();

            const submitBtn = page.getByRole('button', { name: /Submit Request/i });
            await expect(submitBtn).toBeEnabled();
            await submitBtn.click();
        });

        await test.step('Verify Success Redirect', async () => {
            // Wait for the redirect to /success?id=xxx
            await page.waitForURL(/\/success/, { timeout: 15000 });
            await expect(page.getByText('Request Submitted!')).toBeVisible();
        });
    });

});
