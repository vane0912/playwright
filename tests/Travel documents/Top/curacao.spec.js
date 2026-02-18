const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions');
const selectors = require('../../selectors')
const { deploy_url } = require('../../urls');

let Order_num

test('Curacao Immigration Card + Passenger Locator Card', async ({ page }) => {
  test.slow()
  await appFunctions.step_1(page,"us", "curacao/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')

  await appFunctions.step_2(page,continue_sidebar)
  await page.waitForURL("**/curacao/apply-now#step=step_3c")
  
  await appFunctions.step_3c(page,continue_sidebar)
  await page.waitForURL("**/curacao/apply-now#step=review")

  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  
  await selectors.phoneNumber(page)
  await selectors.dropdownSelector(page,"general.destination_location_name", "dropdown-general.destination_location_name", "abc", "ABC Apartments")
  await selectors.arrival_date(page)
  await selectors.booleanOptions(page, "general.flight_reservation", "boolean-No")
  await selectors.dropdownSelector(page,"general.city_of_departure", "dropdown-general.city_of_departure", "amsterdam", "Amsterdam")

  Order_num = page.url().split("/")[4] 
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_passport_after_payment")
  await selectors.booleanOptions(page, "applicant.0.gender", "boolean-Male")
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