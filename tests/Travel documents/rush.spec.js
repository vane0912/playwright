const { test, expect } = require('@playwright/test');
const appFunctions = require('../functions')
const percySnapshot = require('@percy/playwright');

test('Buy rush speed', async({page}) => {
    await appFunctions.step_1(page,"us", "india/apply-now")
    const continue_sidebar = page.locator('id=btnContinueSidebar')
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
  
    await appFunctions.step_2(page,continue_sidebar, "**/india/apply-now#step=step_3c")

    await appFunctions.step_3c(page,continue_sidebar)
    
    await appFunctions.newPaymentCheckout(page,"**/india/apply-now#", '6011 1111 1111 1117', '123')
    await percySnapshot(page, 'ProcessingSpeedsIndia')

    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    
    await page.waitForNavigation({waitUntil: 'load'})
    await page.getByTestId("transition-page-button").click()
})