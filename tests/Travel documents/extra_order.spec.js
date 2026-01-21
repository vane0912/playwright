const { test, expect } = require('@playwright/test');
const appFunctions = require('../functions')

test('Extra Order', async ({ page }) => {
  await appFunctions.step_1(page,"mx", "turkey/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')

  const dob_day = page.locator('[name="applicant.0.dob.day"]')
  await dob_day.selectOption('11')

  const dob_month = page.locator('[name="applicant.0.dob.month"]')
  await dob_month.selectOption('7')

  const dob_year = page.locator('[name="applicant.0.dob.year"]')
  await dob_year.selectOption('2000')
  
  const name_applicant = page.locator('[name="applicant.0.first_name"]')
  await expect(name_applicant).toBeVisible()
  await name_applicant.fill('Test')
  
  await page.waitForTimeout(1000)
  const last_name = page.locator('[name="applicant.0.last_name"]')
  await last_name.fill('Test')
  await page.waitForTimeout(1000)

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/turkey/apply-now#step=step_3c')
  
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

  await appFunctions.newPaymentCheckout(page,"**/turkey/apply-now#", '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  const request = await fetch("https://littleserver-production.up.railway.app/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      Completed: page.url().split("/")[4] 
    }),
  });
  await request.json()
  
  await page.getByPlaceholder('111-222-3333').fill('11111111')
  await page.getByTestId('boolean-WhatsApp').click()
  
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()

  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  /*
  await expect(page.getByTestId('boolean-Male')).toBeEnabled()
  await page.waitForTimeout(1000)
  await page.getByTestId('boolean-Male').click()
  */
  await page.waitForTimeout(3000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()

  await page.waitForNavigation({waitUntil: 'load'})
  const passport_issue_day = page.locator('[name="applicant.0.passport_issued_date.day"]')
  await passport_issue_day.selectOption('13')
  await page.waitForTimeout(1000)

  const passport_issue_month = page.locator('[name="applicant.0.passport_issued_date.month"]')
  await passport_issue_month.selectOption('7')
  await page.waitForTimeout(1000)
  const passport_issue_year = page.locator('[name="applicant.0.passport_issued_date.year"]')
  await passport_issue_year.selectOption('2020')
  await page.waitForTimeout(1000)

  const submit_post_payment = page.locator('id=btnSubmitApplication')
  await expect(submit_post_payment).toBeEnabled()
  await submit_post_payment.click()
  await page.waitForNavigation({waitUntil: 'load'})
})