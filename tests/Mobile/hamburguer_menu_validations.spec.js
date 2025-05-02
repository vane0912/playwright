const { test, expect } = require('@playwright/test');
const {deploy_url, Orders} = require('../urls');

test('Hamburguer Menu mobile', async ({ page }) => {
    await page.goto(deploy_url);
    await page.setViewportSize({ width: 412, height: 915 });
    const headerMobileNav = page.locator('id=headerMobileNav');
    await expect(headerMobileNav).toBeVisible()
    await headerMobileNav.click()
    await expect(page.getByRole('button', { name: 'Open the Get my visa menu' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Open the Travel confidently menu' })).toBeVisible()
    await expect(page.locator("id=mobileLangSelector")).toBeVisible()
    const currency_selector = page.locator('id=mobileCurrencySelector');
    await expect(currency_selector).toBeVisible()
    await expect(page.getByTestId("\mobileLogoutButton")).toBeVisible()
})