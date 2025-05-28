const { test, expect, devices } = require('@playwright/test');
const { deploy_url } = require('../urls');

const iPhone13 = devices['iPhone 13'];

test.use({
  ...iPhone13,
});
test('Go to my orders page from homepage', async ({ page }) => {
    await page.goto(deploy_url);
    await page.locator("//a[@href='" + deploy_url + "account'" + "]" ).first().click()
    await page.waitForURL("**/account")
    await expect(page.locator('//div[@data-vue-component="email-confirmed"]')).toBeVisible()
    await expect(page.getByTestId("action-needed-button")).toBeVisible()
    await page.getByRole('button', { name: 'Confirm' }).click()
    await expect(page.locator('//div[@data-vue-component="email-confirmed"]')).toBeHidden()
})