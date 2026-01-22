const { test, expect } = require('@playwright/test');
const percySnapshot = require('@percy/playwright');
const appFunctions = require('../functions')
let order_num 
test('Individual subscription purchase', async ({ page }) => {
  test.slow()
  await appFunctions.step_1(page,"mx", "turkey/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')
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
    
  await appFunctions.newPaymentCheckout(page,"**/turkey/apply-now#", '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  order_num = page.url().split("/")[4] 

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
  //await page.locator('id=skip-recommendation-button').click()    

  await page.locator('id=trackApplication').click()
  
  await page.waitForURL(deploy_url + "order/" + order_num)

  // Purchase subscription

  await page.getByText("View plans").click()
  await expect(page.locator("id=iVisaPlusContent")).toBeVisible()

  await expect(page.getByTestId("purchase-subscription-button")).toContainText(" Subscribe for $79.99 $29.99")
  await page.waitForTimeout(3000)
  await percySnapshot(page, 'Purchase Subscription modal');
  await page.getByTestId("purchase-subscription-button").click()
  /*
  await page.getByPlaceholder("Card number").fill("4556 7610 2998 3886")
  await page.getByPlaceholder("MM/YY").fill("10/29")
  await page.getByPlaceholder("CVV").fill("123")
  await page.getByPlaceholder("Cardholder name").fill("John Smith")
  await page.waitForTimeout(3000)
  await page.locator("id=btnSubmitPayment").click()
  */
  await page.waitForURL(deploy_url + "order/" + order_num + "?subscription=true")

  // Place free order 
  await appFunctions.step_1(page,"mx", "turkey/apply-now")

  await appFunctions.step_2(page,continue_sidebar, "**/turkey/apply-now#step=step_3c")
  
  await expect(passport_num).toBeVisible()
  await passport_num.fill('123456789')
  await passport_day.selectOption('13')
  await passport_month.selectOption('7')
  await passport_year.selectOption('2030')
  await page.waitForTimeout(4000)

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  
   await page.waitForURL('**/turkey/apply-now#step=step_4')
  
  await expect(page.getByTestId('processing-standard')).toBeVisible()
  const standar_processing = page.getByTestId('processing-standard')
  await expect(standar_processing).toBeVisible()

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/turkey/apply-now#step=review')
  await page.waitForTimeout(2000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  /*
  const cardholder_name = page.getByPlaceholder("Cardholder name")
  await cardholder_name.fill('John Smith')
  
  const zip_code = page.getByPlaceholder("ZIP code")
  await zip_code.fill('12345')
  */

  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  order_num = page.url().split("/")[4] 

  await page.getByPlaceholder('111-222-3333').fill('11111111')
  await page.getByTestId('boolean-WhatsApp').click()
  
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()
  
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
  await passport_issue_day.selectOption('13')
  await page.waitForTimeout(1000)

  await passport_issue_month.selectOption('7')
  await page.waitForTimeout(1000)
  await passport_issue_year.selectOption('2020')
  await page.waitForTimeout(1000)
  await expect(submit_post_payment).toBeEnabled()
  await submit_post_payment.click()
  await page.waitForNavigation({waitUntil: 'load'})
})