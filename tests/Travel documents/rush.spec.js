const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');

test('Buy rush speed', async({page}) => {
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
  /*
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('.dp--future').filter({hasText: date1}).first().click()
  */
  const continue_sidebar = page.locator('id=btnContinueSidebar')
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/malaysia/apply-now#step=step_3a')
  await expect(page.getByTestId("dropdown-prefill-selector")).toBeVisible()
  await page.getByTestId("dropdown-prefill-selector").selectOption("0")
  
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/malaysia/apply-now#step=step_3c')

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/malaysia/apply-now#step=step_4')

  const rush = page.getByTestId('processing-rush')
  await expect(rush).toBeVisible()
  await expect(rush).toContainText("Rush4 hours processing", "$59.99")
  await rush.click()

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

  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()

  await page.waitForNavigation({waitUntil: 'load'})
})