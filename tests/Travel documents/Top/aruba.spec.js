require('dotenv').config();
const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions')


test('Extra Order', async ({ page }) => {
  await appFunctions.step_1(page,"us", "aruba/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')

  await appFunctions.step_2(page,continue_sidebar)
  await page.waitForURL("**/aruba/apply-now#step=step_3c")
  
  await appFunctions.step_3c(page,continue_sidebar)
  await page.waitForURL("**/aruba/apply-now#step=review")

  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  
  
  await page.getByPlaceholder('111-222-3333').fill('11111111')
  await page.getByTestId('boolean-WhatsApp').click()
  
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()

  const arrival_airline =  page.getByTestId('filter-value').nth(1);
  await arrival_airline.click();
  const input_airline = page.getByTestId('dropdown-general.arrival_flight_airline');
  await input_airline.fill("AA")
  await page.getByRole("option", {name: 'American Airlines (AA)'}).click()

  const url = 'https://api.aviationstack.com/v1/flights?limit=1&airline_icao=AAL&access_key=' + process.env.FLIGHT_API;
  const options = {method: 'GET', headers: {Accept: 'application/json'}};
  let flight_number 
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    flight_number = data.data[0].flight.number
  } catch (error) {
    console.error(error);
  }

  await page.locator('[name="general.arrival_flight_number"]').fill(flight_number)
  await page.waitForTimeout(2000)

  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForTimeout(2000)
  await page.getByTestId('boolean-Male').click()
  await page.waitForTimeout(2000)

  const submit_post_payment = page.locator('id=btnSubmitApplication')
  await expect(submit_post_payment).toBeEnabled()
  await submit_post_payment.click()
  await page.waitForNavigation({waitUntil: 'load'})
})