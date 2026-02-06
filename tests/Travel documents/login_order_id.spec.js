const { test, expect } = require('@playwright/test');
const {deploy_url, Orders} = require('../urls');
const appFunctions = require('../functions')

test('Log in with ID', async ({ page }) => {
  await appFunctions.step_1(page,"mx", "turkey/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')
  await appFunctions.step_2(page,continue_sidebar)
  await page.waitForURL("**/turkey/apply-now#step=step_3c")

  await appFunctions.step_3c(page,continue_sidebar) 
  await page.waitForURL("**/turkey/apply-now#step=review")
  
  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})

  Orders.push(page.url().split("/")[4]) 
  
  await page.goto(deploy_url + 'account/settings')
  const user = page.locator('id=loggedInUserContainer')
  await expect(user).toBeVisible()
  await user.click()
  const btn_logout = page.locator('id=btnLogout')
  await expect(btn_logout).toBeVisible()
  await btn_logout.click()
  await page.goto(deploy_url + 'login')
  await page.waitForURL('**/login')
  const email = page.locator('id=email_login_input')
  await expect(email).toBeVisible()
  
  await email.fill(Orders[0])
  const continue_login = page.locator('id=continue_button')
  await expect(continue_login).toBeEnabled()
  await continue_login.click()
  const password = page.locator('id=password_login_input')
  await expect(password).toBeVisible()
  await password.fill('testivisa5!')  
  const login_cta = page.locator('id=log_in_button')
  await expect(login_cta).toBeEnabled()
  await login_cta.click()
  await page.waitForNavigation({waitUntil: 'load'})
})
