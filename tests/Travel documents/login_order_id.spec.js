const { test, expect } = require('@playwright/test');
const {deploy_url, Orders} = require('../urls');
const { newPaymentCheckout } = require('../functions');
test('Log in with ID', async ({ page }) => {
  await appFunctions.step_1(page,"mx", "turkey/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await appFunctions.step_2(page,continue_sidebar, "**/turkey/apply-now#step=step_3c")
  
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
  
  await newPaymentCheckout(page,"**/turkey/apply-now#", '6011 1111 1111 1117', '123')
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
