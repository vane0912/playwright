const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions');
const selectors = require('../../selectors')
const { deploy_url } = require('../../urls');

let Order_num

test('Brazil Tourist eVisa', async ({ page }) => {
  test.slow()
  await appFunctions.step_1(page,"us", "brazil/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')

  await appFunctions.step_2(page,continue_sidebar)
  await page.waitForURL("**/brazil/apply-now#step=step_3c")
  
  await appFunctions.step_3c(page,continue_sidebar)
  await page.waitForURL("**/brazil/apply-now#step=review")

  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  
  await selectors.phoneNumber(page)
  await selectors.arrival_date(page)
  await selectors.departure_date(page)
  
  Order_num = page.url().split("/")[4] 
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()

  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=residence_general")
  await selectors.addressApi(page, "general.home_address")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_personal")

  await selectors.booleanOptions(page, "applicant.0.gender", "boolean-Female")
  await selectors.dropdownOptions(page,"dropdown-applicant.0.marital_status", "Single")
  await selectors.inputText(page, "applicant.0.birth_city", "test")
  await selectors.inputText(page, "applicant.0.state_of_birth", "test")
  await selectors.booleanOptions(page,"applicant.0.current_occupation", "boolean-Unemployed")
  await selectors.booleanOptions(page,"applicant.0.applicable_statement", "boolean-No, I don’t have information about either")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_past_travel")
  await selectors.booleanOptions(page, "applicant.0.visited_kenya_before","boolean-No")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_documents")
  await selectors.applicantPhoto(page)
  await selectors.passportPhoto(page)
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_ocr_review")
  await page.getByText("Use selected details").click()
  const passport_issue_day = page.locator('[name="applicant.0.passport_issued_date.day"]')
  await expect(passport_issue_day).toBeVisible()
  await passport_issue_day.selectOption('13')
  await page.waitForTimeout(1000)  
  const passport_issue_month = page.locator('[name="applicant.0.passport_issued_date.month"]')
  await passport_issue_month.selectOption('7')
  await page.waitForTimeout(1000)
  const passport_issue_year = page.locator('[name="applicant.0.passport_issued_date.year"]')
  await passport_issue_year.selectOption('2022')  
  await page.waitForTimeout(1000)

  await page.locator("id=btnSubmitApplication").click()
  await page.waitForURL(deploy_url + "order-received-page/" + Order_num)
  await page.waitForTimeout(4000)
  const skip_recomendation = await page.locator('id=skip-recommendation-button').isVisible()
  if(skip_recomendation){
    await page.locator('id=skip-recommendation-button').click()    
  }
  
  await page.locator('id=trackApplication').click()
  
  await page.waitForURL(deploy_url + "order/" + Order_num)
})