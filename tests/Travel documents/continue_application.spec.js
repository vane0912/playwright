const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');
const percySnapshot = require('@percy/playwright');
const appFunctions = require('../functions')
test('Continue with your application banner', async({page}) => {
  await appFunctions.step_1(page,"us", "thailand/apply-now")
  await page.goto(deploy_url)
  await page.goto(deploy_url + 'thailand/apply-now')
  await expect(page.locator("id=finishApplication")).toBeVisible()
  await expect(page.locator("id=finishApplication")).toContainText("Finish Application")
  await percySnapshot(page, 'Continue with application banner');
})