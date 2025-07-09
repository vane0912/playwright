const { test, expect } = require('@playwright/test');
const {deploy_url, email_test, Orders} = require('../urls');
const percySnapshot = require('@percy/playwright');

test('Destination page', async ({ page }) => {
    await page.goto(deploy_url + 'india/tourist-e-visa')
    await page.waitForTimeout(3000)
    await page.locator("footer").scrollIntoViewIfNeeded()
    await page.waitForTimeout(2000)
    await percySnapshot(page, 'LearnMorePage')
})