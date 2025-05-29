const { test, expect } = require('@playwright/test');
const {deploy_url, Orders} = require('../urls');

test('Confirm user can see their orders on the portal', async ({ page }) => {
    await page.goto(deploy_url + "account")
    await expect(page.locator("id=main")).toContainText("Turkey eVisa", "Find out why", "Incomplete")
})