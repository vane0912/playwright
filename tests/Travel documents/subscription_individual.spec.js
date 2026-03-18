const { test, expect } = require('@playwright/test');
const percySnapshot = require('@percy/playwright');
const appFunctions = require('../functions')
const selectors = require('../selectors')
const {deploy_url} = require('../urls');

let Order_num 
test('Individual subscription purchase', async ({ page }) => {
  test.slow()
  await appFunctions.step_1(page,"mx", "colombia/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')

  
  const dob_day = page.locator('[name="applicant.0.dob.day"]')
  await dob_day.selectOption('13')
  const dob_month = page.locator('[name="applicant.0.dob.month"]')
  await dob_month.selectOption('8')
  const dob_year = page.locator('[name="applicant.0.dob.year"]')
  await dob_year.selectOption('2001')
  const name_applicant = page.locator('[name="applicant.0.first_name"]')
  await name_applicant.fill('Test')
  
  await page.waitForTimeout(1000)
  const last_name = page.locator('[name="applicant.0.last_name"]')
  await last_name.fill('Test')
  await page.waitForTimeout(1000)
  
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL("**/colombia/apply-now#step=step_3c")
  
  await appFunctions.step_3c(page,continue_sidebar)

  await page.waitForURL('**/colombia/apply-now#step=review')
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
  await page.waitForURL("**/colombia/apply-now#step=review")
  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')

  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  await selectors.phoneNumber(page)
  await selectors.arrival_date(page)
  Order_num = page.url().split("/")[4] 
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=travel_general")
  await selectors.dropdownSelector(page, 'general.arrival_location', 'dropdown-general.arrival_location', 'Armenia', 'Armenia (AXM), El Eden Airport')
  await selectors.inputText(page, 'general.arrival_flight_number', '123')
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_step_3c")
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_personal")
  await selectors.booleanOptions(page, 'applicant.0.gender', 'boolean-Male')
  await selectors.dropdownSelector(page, "applicant.0.home_country", "dropdown-applicant.0.home_country", "mexico", "MX")
  await page.locator("id=btnSubmitApplication").click()
  await page.waitForURL(deploy_url + "order-received-page/" + Order_num)
  await page.waitForTimeout(4000)
  const skip_recomendation = await page.locator('id=skip-recommendation-button').isVisible()
  if(skip_recomendation){
    await page.locator('id=skip-recommendation-button').click()    
  }
  await page.locator('id=trackApplication').click()  
  await page.waitForURL(deploy_url + "order/" + Order_num)
  // Purchase subscription

  await page.getByText("View plans").click()
  await expect(page.locator("id=iVisaPlusContent")).toBeVisible()

  await expect(page.getByTestId("purchase-subscription-button")).toContainText(" Subscribe for $79.99 $29.99")
  await page.waitForTimeout(3000)
  await percySnapshot(page, 'Purchase Subscription modal');
  await page.getByTestId("purchase-subscription-button").click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/purchase_addons/new_mop?subscription=true")
  await page.getByPlaceholder("Card number").fill("4556 7610 2998 3886")
  await page.getByPlaceholder("MM/YY").fill("10/29")
  await page.getByPlaceholder("CVV").fill("123")
  await page.getByPlaceholder("Cardholder name").fill("John Smith")
  await page.locator('id=btnSubmitPayment').click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "?subscription=true")

  // Place free order 
  await appFunctions.step_1(page,"mx", "colombia/apply-now")

  await dob_day.selectOption('13')
  await dob_month.selectOption('8')
  await dob_year.selectOption('2001')
  await name_applicant.fill('Test')
  
  await page.waitForTimeout(1000)
  await last_name.fill('Test')
  await page.waitForTimeout(1000)
  
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL("**/colombia/apply-now#step=step_3c")
  
  await appFunctions.step_3c(page,continue_sidebar)
  
  await page.waitForURL('**/colombia/apply-now#step=review')
  await page.waitForTimeout(2000)
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }

  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})

  await page.getByTestId("transition-page-button").click()
  await selectors.phoneNumber(page)
  await selectors.arrival_date(page)
  Order_num = page.url().split("/")[4] 
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=travel_general")
  await selectors.dropdownSelector(page, 'general.arrival_location', 'dropdown-general.arrival_location', 'Armenia', 'Armenia (AXM), El Eden Airport')
  await selectors.inputText(page, 'general.arrival_flight_number', '123')
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_step_3c")
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_personal")
  await selectors.booleanOptions(page, 'applicant.0.gender', 'boolean-Male')
  await selectors.dropdownSelector(page, "applicant.0.home_country", "dropdown-applicant.0.home_country", "mexico", "MX")
  await page.locator("id=btnSubmitApplication").click()
  await page.waitForURL(deploy_url + "order-received-page/" + Order_num)
  await page.waitForTimeout(4000)
  if(skip_recomendation){
    await page.locator('id=skip-recommendation-button').click()    
  }
  await page.locator('id=trackApplication').click()  
  await page.waitForURL(deploy_url + "order/" + Order_num)
})