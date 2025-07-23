const { test, expect } = require('@playwright/test');
const {deploy_url, email_test, Orders} = require('../urls');
const percySnapshot = require('@percy/playwright');

test('Privacy', async ({ page }) => {
    await page.goto(deploy_url + 'privacy')
    await page.waitForTimeout(3000)
    await page.locator("footer").scrollIntoViewIfNeeded()
    await page.waitForTimeout(2000)
    await percySnapshot(page, 'PrivacyPage')
})

test('Terms and conditions', async ({ page }) => {
    await page.goto(deploy_url + 'terms-and-conditions')
    await page.waitForTimeout(3000)
    await page.locator("footer").scrollIntoViewIfNeeded()
    await page.waitForTimeout(2000)
    await percySnapshot(page, 'TermsAndConditionsPage')
})