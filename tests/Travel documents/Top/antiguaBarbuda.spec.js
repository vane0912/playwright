const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions');
const selectors = require('../../selectors')
const { deploy_url } = require('../../urls');

let Order_num

test('Antigua & Barbuda Entry Form', async ({ page }) => {
  test.slow()
  await appFunctions.step_1(page,"us", "antigua-barbuda/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')

  await appFunctions.step_2(page,continue_sidebar)
  await page.waitForURL("**/antigua-barbuda/apply-now#step=step_3c")
  
  await appFunctions.step_3c(page,continue_sidebar)
  await page.waitForURL("**/antigua-barbuda/apply-now#step=review")

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
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=accommodation")
  await page.waitForTimeout(2000)
  await selectors.inputText(page, "general.destination_location_name", 'Test')
  await selectors.addressApi(page, "general.destination_address")
  await selectors.inputText(page, "general.destination_zip", "12345")
  await page.waitForTimeout(2000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_personal")
  await selectors.booleanOptions(page, "applicant.0.gender", "boolean-Male")
  await selectors.booleanOptions(page, "applicant.0.marital_status", "boolean-Single")
  await selectors.booleanOptions(page, "applicant.0.current_occupation", "boolean-Unemployed")
  await selectors.inputText(page, "applicant.0.city_bith", "Test")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_residency_information_after_payment")
  await selectors.addressApi(page, "applicant.0.home_address")
  await selectors.dropdownSelector(page, "applicant.0.home_country_code", "dropdown-applicant.0.home_country_code", "usa", "US")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_travel")
  await page.waitForTimeout(2000)
  await selectors.inputText(page, "applicant.0.arrival_flight_number", "12345")

  await selectors.departure_date(page, 'applicant.0.departure_date')

  await selectors.dropdownSelector(page, "applicant.0.arrival_flight_airline", "dropdown-applicant.0.arrival_flight_airline","21", "2I")
  await selectors.inputText(page, "applicant.0.departure_flight_number", "12345")
  await selectors.dropdownSelector(page, "applicant.0.departure_flight_airline", "dropdown-applicant.0.departure_flight_airline","21", "2I")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_past_travel")
  await selectors.booleanOptions(page, "applicant.0.number_times_visited","boolean-This is my first time")
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_declarations")
  await page.waitForTimeout(2000)
  await selectors.inputText(page, "applicant.0.accompanied_luggage", "1")
  await page.waitForTimeout(2000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_documents_2")
  await selectors.applicantPhoto(page)
  await selectors.passportPhoto(page)
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_ocr_review")
  await page.getByText("Use selected details").click()
  await selectors.datePicker(page, "applicant.0.passport_issued_date", '1', '9', '2013')
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