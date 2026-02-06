const { test, expect } = require('@playwright/test');
const appFunctions = require('../functions')

test('Payment with VISA', async({page}) => {
  await appFunctions.step_1(page,"us", "thailand/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')
  
  await appFunctions.step_2(page,continue_sidebar)
  await page.waitForURL("**/thailand/apply-now#step=step_3c")

  await appFunctions.step_3c(page,continue_sidebar)
  
  await appFunctions.newPaymentCheckout(page,"**/thailand/apply-now#", '3782 8224 6310 005', '1234')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
  await page.waitForTimeout(1000)
  const request = await fetch("https://littleserver-production.up.railway.app/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      Cancelled: page.url().split("/")[4] 
    }),
  });
  await request.json()
})
  
test('Payment with Master Card', async({page}) => {
  await appFunctions.step_1(page,"us", "thailand/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')

  await appFunctions.step_2(page,continue_sidebar)
  await page.waitForURL("**/thailand/apply-now#step=step_3c")

  await appFunctions.step_3c(page,continue_sidebar)
  
  await appFunctions.newPaymentCheckout(page,"**/thailand/apply-now#", '5555 5555 5555 4444', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
})
  
test('Payment with Amex', async({page}) => {
  await appFunctions.step_1(page,"us", "thailand/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')
  
  await appFunctions.step_2(page,continue_sidebar)
  await page.waitForURL("**/thailand/apply-now#step=step_3c")
  
  await appFunctions.step_3c(page,continue_sidebar)
    
  await appFunctions.newPaymentCheckout(page,"**/thailand/apply-now#", '3782 8224 6310 005', '1234')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
})
  
test('Payment with Discover', async({page}) => {
  await appFunctions.step_1(page,"us", "thailand/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')
  
  await appFunctions.step_2(page,continue_sidebar)
  await page.waitForURL("**/thailand/apply-now#step=step_3c")
  
  await appFunctions.step_3c(page,continue_sidebar)
  
    await appFunctions.newPaymentCheckout(page,"**/thailand/apply-now#", '6011 1111 1111 1117', '123')
    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})
})