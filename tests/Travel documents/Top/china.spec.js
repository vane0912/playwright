const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions');
const selectors = require('../../selectors')
const { deploy_url } = require('../../urls');

let Order_num

test('China Arrival card', async ({ page }) => {
  test.slow()
  await appFunctions.step_1(page,"us", "china/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')

  await appFunctions.step_2(page,continue_sidebar)
  await page.waitForURL("**/china/apply-now#step=step_3c")
  
  await appFunctions.step_3c(page,continue_sidebar)
  await page.waitForURL("**/china/apply-now#step=review")

  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  
  await selectors.phoneNumber(page)
  Order_num = page.url().split("/")[4] 
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=travel_general")
  await selectors.arrival_date(page)
  await selectors.dropdownSelector(page, 'general.arrival_city', 'dropdown-general.arrival_city', 'changsha', 'Changsha')
  await selectors.departure_date(page, "general.departure_date")
  await selectors.booleanOptions(page, 'general.port_of_arrival', 'boolean-Beijing Capital International Airport') 
  await selectors.booleanOptions(page, 'general.flight_reservation', 'boolean-No')
  await selectors.dropdownSelector(page, 'general.city_list_with_dates.0.arrival_city_china', 'dropdown-general.city_list_with_dates.0.arrival_city_china', 'aba', 'Aba')
  await selectors.inputText(page, 'general.city_of_departure', 'Test')
  await selectors.inputText(page, 'general.departure_port', 'Test')
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=accommodation")
  await selectors.inputText(page, 'general.destination_location_name', 'test')
  await selectors.addressApi(page, 'general.destination_address')
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_personal")
  await selectors.booleanOptions(page,'applicant.0.gender', 'boolean-Female')
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_documents")
  await selectors.passportPhoto(page)
  
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_ocr_review")
  await page.getByText("Use selected details").click()
  const passport_issue_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
  await expect(passport_issue_day).toBeVisible()
  await passport_issue_day.selectOption('13')
  await page.waitForTimeout(1000)  
  const passport_issue_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
  await passport_issue_month.selectOption('7')
  await page.waitForTimeout(1000)
  const passport_issue_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
  await passport_issue_year.selectOption('2028')  
  await page.waitForTimeout(1000)
  await selectors.booleanOptions(page,'applicant.0.applied_visa', 'boolean-Yes')
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