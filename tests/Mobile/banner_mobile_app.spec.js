const { test, expect, devices } = require('@playwright/test');
const { deploy_url } = require('../urls');

const iPhone13 = devices['iPhone 13'];

test.use({
  ...iPhone13,
});
test('Mobile app banner homepage', async ({ page }) => {
    await page.goto(deploy_url);
    const headerMobileNav = page.locator('id=native-app-banner-ad');
    await expect(headerMobileNav).toBeVisible()
    await expect(headerMobileNav).toContainText("iVisa Mobile App", "Online global travel documents", "Get")
})