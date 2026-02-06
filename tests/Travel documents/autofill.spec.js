const { test, expect } = require('@playwright/test');
const appFunctions = require('../functions')


test('Autofill appears and works', async({page}) => {
  await appFunctions.step_1(page,"us", "thailand/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')
  
  await expect(page.getByTestId("dropdown-prefill-selector")).toBeVisible()
  await page.getByTestId("dropdown-prefill-selector").selectOption("0")
  
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/thailand/apply-now#step=step_3c')

  
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/thailand/apply-now#step=review')
  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
})