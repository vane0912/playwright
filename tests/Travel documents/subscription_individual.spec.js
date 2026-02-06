const { test, expect } = require('@playwright/test');
const percySnapshot = require('@percy/playwright');
const appFunctions = require('../functions')
const {deploy_url} = require('../urls');

let order_num 
test('Individual subscription purchase', async ({ page }) => {
  test.slow()
  await appFunctions.step_1(page,"mx", "turkey/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')
  await appFunctions.step_2(page,continue_sidebar)
  await page.waitForURL("**/turkey/apply-now#step=step_3c")
  
  await appFunctions.step_3c(page,continue_sidebar)

  await page.waitForURL('**/turkey/apply-now#step=review')
  await page.waitForTimeout(2000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }

  const has_subscription = await page.getByText("Confirmation").isVisible()
  if (has_subscription){
    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    
    await page.waitForNavigation({waitUntil: 'load'})
    await page.getByTestId("transition-page-button").click()

    return
  }
  await page.waitForURL("**/turkey/apply-now#step=review")
  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')

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
  await page.waitForTimeout(3000)
  const skip_recomendation = await page.locator('id=skip-recommendation-button').isVisible()
  if(skip_recomendation){
    await page.locator('id=skip-recommendation-button').click()    
  }

  await page.locator('id=trackApplication').click()
  
  await page.waitForURL(deploy_url + "order/" + order_num)

  // Purchase subscription

  await page.getByText("View plans").click()
  await expect(page.locator("id=iVisaPlusContent")).toBeVisible()

  await expect(page.getByTestId("purchase-subscription-button")).toContainText(" Subscribe for $79.99 $29.99")
  await page.waitForTimeout(3000)
  await percySnapshot(page, 'Purchase Subscription modal');
  await page.getByTestId("purchase-subscription-button").click()
  
  await page.waitForURL(deploy_url + "order/" + order_num + "?subscription=true")

  // Place free order 
  await appFunctions.step_1(page,"mx", "turkey/apply-now")

  await appFunctions.step_2(page,continue_sidebar)
  await page.waitForURL("**/turkey/apply-now#step=step_3c")
  
  await appFunctions.step_3c(page,continue_sidebar)
  
  await page.waitForURL('**/turkey/apply-now#step=review')
  await page.waitForTimeout(2000)
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }

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