const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');

test('Buy super rush', async({page}) => {
  var myDate = new Date(new Date(). getTime()+(2*24*60*60*1000));
  const datepicker_date = new Date(myDate);
  const date1 = datepicker_date.getDate();
  await page.goto(deploy_url + 'malaysia/apply-now')
    
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

  //await page.waitForURL('**/malaysia/apply-now#step=step_2')
  /*
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('.dp--future').filter({hasText: date1}).first().click()
  
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  */
  await page.waitForURL('**/malaysia/apply-now#step=step_3a')
  await expect(page.getByTestId("dropdown-prefill-selector")).toBeVisible()
  await page.getByTestId("dropdown-prefill-selector").selectOption("0")
  
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/malaysia/apply-now#step=step_3c')

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/malaysia/apply-now#step=step_4')

  const super_rush = page.getByTestId('processing-super_rush')
  await expect(super_rush).toBeVisible()
  await expect(super_rush).toContainText("Super Rush30 minute processing", "$69.99")
  await super_rush.click()

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/malaysia/apply-now#step=review')
  await page.waitForTimeout(2000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()

  const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').nth(1)
  await stripeFrame.locator("id=Field-numberInput").fill('6011 1111 1111 1117');

  const expiration_month = stripeFrame.locator("id=Field-expiryInput")
  await expiration_month.fill('10/26')

  const cvv = stripeFrame.locator("id=Field-cvcInput")
  await cvv.fill('123')
  /*
  const cardholder_name = page.getByPlaceholder("Cardholder name")
  await cardholder_name.fill('John Smith')
  
  const zip_code = page.getByPlaceholder("ZIP code")
  await zip_code.fill('12345')
  */
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()

  await page.waitForNavigation({waitUntil: 'load'})
})