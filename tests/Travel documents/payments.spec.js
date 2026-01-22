const { test, expect } = require('@playwright/test');
const appFunctions = require('../functions')

test('Payment with VISA', async({page}) => {
  await appFunctions.step_1(page,"us", "thailand/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')
  
  await appFunctions.step_2(page,continue_sidebar, "**/thailand/apply-now#step=step_3c")

  const passport_num = page.locator('[name="applicant.0.passport_num"]')
  await expect(passport_num).toBeVisible()
  await passport_num.fill('123456789')
  const passport_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
  await passport_day.selectOption('13')
  const passport_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
  await passport_month.selectOption('7')
  const passport_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
  await passport_year.selectOption('2030')
  await page.waitForTimeout(4000)

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  
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

    await appFunctions.step_2(page, continue_sidebar, "**/thailand/apply-now#step=step_3c")
  
    const passport_num = page.locator('[name="applicant.0.passport_num"]')
    await expect(passport_num).toBeVisible()
    await passport_num.fill('123456789')
    const passport_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
    await passport_day.selectOption('13')
    const passport_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
    await passport_month.selectOption('7')
    const passport_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
    await passport_year.selectOption('2030')
    await page.waitForTimeout(4000)
    
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    
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
  
  await appFunctions.step_2(page, continue_sidebar, "**/thailand/apply-now#step=step_3c")
  
    const passport_num = page.locator('[name="applicant.0.passport_num"]')
    await expect(passport_num).toBeVisible()
    await passport_num.fill('123456789')
    const passport_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
    await passport_day.selectOption('13')
    const passport_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
    await passport_month.selectOption('7')
    const passport_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
    await passport_year.selectOption('2030')
    await page.waitForTimeout(4000)

    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    
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
  
  await appFunctions.step_2(page, continue_sidebar, "**/thailand/apply-now#step=step_3c")
  
    const passport_num = page.locator('[name="applicant.0.passport_num"]')
    await expect(passport_num).toBeVisible()
    await passport_num.fill('123456789')
    const passport_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
    await passport_day.selectOption('13')
    const passport_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
    await passport_month.selectOption('7')
    const passport_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
    await passport_year.selectOption('2030')
    await page.waitForTimeout(4000)
    
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    
    await appFunctions.newPaymentCheckout(page,"**/thailand/apply-now#", '6011 1111 1111 1117', '1234')
    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})
})