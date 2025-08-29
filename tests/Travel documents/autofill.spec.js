const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');

test('Autofill appears and works', async({page}) => {
  await page.goto(deploy_url + 'thailand/apply-now')
    
  const dropdown_country =  page.getByTestId('filter-value');

  await expect(dropdown_country).toBeVisible();
  await dropdown_country.click();
  const input_country = page.getByTestId('dropdown-general.common_nationality_country');

  await expect(input_country).toBeVisible();
  await input_country.fill('united states');
  await page.getByRole("option", {name: 'United States flag United States'}).click()

  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()

  const continue_sidebar = page.locator('id=btnContinueSidebar')
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/thailand/apply-now#step=step_3a')
  await expect(page.getByTestId("dropdown-prefill-selector")).toBeVisible()
  await page.getByTestId("dropdown-prefill-selector").selectOption("0")
  
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/thailand/apply-now#step=step_3c')

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/thailand/apply-now#step=step_4')
  await page.waitForTimeout(3000)
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/thailand/apply-now#step=review')
  await page.waitForTimeout(2000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()

  const card_number = page.getByPlaceholder("Card number")
  await expect(card_number).toBeVisible()
  await card_number.fill('4556 7610 2998 3886')

  const expiration_month = page.getByPlaceholder("MM/YY")
  await expiration_month.fill('10/26')

  const cvv = page.getByPlaceholder("CVV")
  await cvv.fill('123')

  const cardholder_name = page.getByPlaceholder("Cardholder name")
  await cardholder_name.fill('John Smith')
  
  const zip_code = page.getByPlaceholder("ZIP code")
  await zip_code.fill('12345')
  
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
})