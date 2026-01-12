const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');
const { newPaymentCheckout } = require('../functions');

test('Autofill appears and works', async({page}) => {
  await page.goto(deploy_url + 'thailand/apply-now')
    
  const dropdown_country =  page.getByTestId('filter-value');

  await expect(dropdown_country).toBeVisible();
  await dropdown_country.click();
  const input_country = page.getByTestId('dropdown-general.common_nationality_country');

  await expect(input_country).toBeVisible();
  await input_country.fill('united states');
  await page.getByRole("option", {name: 'United States flag United States'}).click()
  
  const continue_sidebar = page.locator('id=btnContinueSidebar')
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  //await page.waitForURL('**/thailand/apply-now#step=step_2')
  /*
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  */
  await page.waitForURL('**/thailand/apply-now#step=step_3a')
  await expect(page.getByTestId("dropdown-prefill-selector")).toBeVisible()
  await page.getByTestId("dropdown-prefill-selector").selectOption("0")
  
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/thailand/apply-now#step=step_3c')

  
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await newPaymentCheckout(page,"**/thailand/apply-now#", '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
})