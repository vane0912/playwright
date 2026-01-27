const { test, expect } = require('@playwright/test');
const {deploy_url, Orders} = require('../urls');
const appFunctions = require('../functions')
const percySnapshot = require('@percy/playwright');

test('Different currency', async ({ page }) => {
  await page.goto(deploy_url + 'turkey/apply-now');
  const currency = page.locator('id=currencyHeader');
  await expect(currency).toBeVisible()
  await currency.click()

  await page.waitForTimeout(2000)
  await page.keyboard.press("ArrowDown")
  await page.waitForTimeout(2000)
  await page.keyboard.press("ArrowDown")
  await page.waitForTimeout(1000)
  await page.keyboard.press("Enter")
  await page.keyboard.press("Enter")
  await page.waitForTimeout(2000)
  
  const dropdown_currency = page.getByTestId('filter-value').filter({hasText: 'USD $'})
  await expect(dropdown_currency).toBeVisible()
  await dropdown_currency.click()
  const input_currency = page.getByTestId('dropdown-modal-currency')
  await input_currency.fill('mxn')
  const confirm_currency = page.locator("[value='MXN']")
  await expect(confirm_currency).toBeVisible()
  await confirm_currency.click()
  await page.waitForTimeout(3000)
  await percySnapshot(page, 'Update currency modal');
  await page.locator('id=updatePrefButton').click()

  const dropdown_country = page.getByTestId('filter-value');
  await expect(dropdown_country).toBeVisible();
  await dropdown_country.click();
  const input_country = page.getByTestId('dropdown-general.common_nationality_country');
  await expect(input_country).toBeVisible();
  await input_country.fill('Mexico');
  await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()
  const continue_sidebar = page.locator('id=btnContinueSidebar')
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  /*
  const selector_products = page.getByTestId('dropdown-general.visa_type_id');
  await selector_products.selectOption('38')
  
  
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()
  
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  */
  await page.waitForURL('**/turkey/apply-now#step=step_3a')
  
  await appFunctions.step_2(page,continue_sidebar, "**/turkey/apply-now#step=step_3c")
  
  await appFunctions.step_3c(page,continue_sidebar)

  await appFunctions.newPaymentCheckout(page,"**/turkey/apply-now#", '6011 1111 1111 1117', '123')
  
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  const request = await fetch("https://littleserver-production.up.railway.app/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      Rejected: page.url().split("/")[4] 
    }),
  });
  await request.json()

  await page.getByPlaceholder('111-222-3333').fill('11111111')
  await page.getByTestId('boolean-WhatsApp').click()
  
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '2'}).first().click()
  
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  /*
  await expect(page.getByTestId('boolean-Male')).toBeEnabled()
  await page.waitForTimeout(1000)
  await page.getByTestId('boolean-Male').click()
  */
  await page.waitForTimeout(3000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()

  await page.waitForNavigation({waitUntil: 'load'})
  const passport_issue_day = page.locator('[name="applicant.0.passport_issued_date.day"]')
  await passport_issue_day.selectOption('13')
  await page.waitForTimeout(1000)

  const passport_issue_month = page.locator('[name="applicant.0.passport_issued_date.month"]')
  await passport_issue_month.selectOption('7')
  await page.waitForTimeout(1000)
  const passport_issue_year = page.locator('[name="applicant.0.passport_issued_date.year"]')
  await passport_issue_year.selectOption('2020')
  await page.waitForTimeout(1000)

  const submit_post_payment = page.locator('id=btnSubmitApplication')
  await expect(submit_post_payment).toBeEnabled()
  await submit_post_payment.click()
  await page.waitForNavigation({waitUntil: 'load'})
})