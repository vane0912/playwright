require('dotenv').config();
const { test, expect } = require('@playwright/test');
const appFunctions = require('../../functions')
const selectors = require('../../selectors')


test('Aruba ED Card', async ({ page }) => {
  const month = new Intl.DateTimeFormat('en-US', { month: 'numeric' }).format(new Date());
  const now = new Date();
  const day = now.getDate();
  await page.goto('https://www.flightstats.com/v2/flight-tracker/arrivals/AUA?year=2026&month=' + month + '&date=' + day +'&hour=12')
  const getFlightInfo = await page.locator('.table__CellText-sc-1x7nv9w-15').nth(0).textContent()
  const getFlightAirline = await page.locator('.table__SubText-sc-1x7nv9w-16').nth(0).textContent()
  const flight_number = getFlightInfo.replace(/\D/g, "");

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
  
  
  await selectors.phoneNumber(page)
  await selectors.arrival_date(page)
  await selectors.booleanOptions(page, 'general.flight_reservation', 'boolean-Yes')

  const arrival_airline =  page.getByTestId('filter-value').nth(1);
  await arrival_airline.click();
  const input_airline = page.getByTestId('dropdown-general.arrival_flight_airline');
  await input_airline.fill(getFlightAirline)
  await page.waitForTimeout(2000)
  await page.keyboard.press('Enter')
  await page.locator('[name="general.arrival_flight_number"]').fill("12345")
  await page.waitForTimeout(2000)
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForTimeout(2000)
  await expect(page.locator(".input-error")).toContainText("Please provide a valid arrival flight number ")

  await page.locator('[name="general.arrival_flight_number"]').fill(flight_number)
  await page.waitForTimeout(2000)

  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForTimeout(2000)
  await page.getByTestId('boolean-Male').click()
  await selectors.dropdownSelector(page, "applicant.0.home_country", "dropdown-applicant.0.home_country", "mexico", "MX")
  await page.waitForTimeout(2000)

  const submit_post_payment = page.locator('id=btnSubmitApplication')
  await expect(submit_post_payment).toBeEnabled()
  await submit_post_payment.click()
  await page.waitForNavigation({waitUntil: 'load'})
})