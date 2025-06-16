const { test, expect } = require('@playwright/test');
const {deploy_url, Orders} = require('../urls');
const percySnapshot = require('@percy/playwright');
let order_num 
test('Individual subscription purchase', async ({ page }) => {
  test.slow()
  await page.goto(deploy_url + 'turkey/apply-now');

  const dropdown_country = page.getByTestId('filter-value');
  await expect(dropdown_country).toBeVisible();
  await dropdown_country.click();
  const input_country = page.getByTestId('dropdown-general.common_nationality_country');
  await expect(input_country).toBeVisible();
  await input_country.fill('Mexico');
  await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()
  
  const selector_products = page.getByTestId('dropdown-general.visa_type_id');
  await selector_products.selectOption('38')
  
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()

  const continue_sidebar = page.locator('id=btnContinueSidebar')
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/turkey/apply-now#step=step_3a')
  
  await page.waitForTimeout(1000)
  const dob_day = page.locator('[name="applicant.0.dob.day"]')
  await dob_day.selectOption('13')
  const dob_month = page.locator('[name="applicant.0.dob.month"]')
  await dob_month.selectOption('7')
  const dob_year = page.locator('[name="applicant.0.dob.year"]')
  await dob_year.selectOption('2002')
  const name_applicant = page.locator('[name="applicant.0.first_name"]')
  await expect(name_applicant).toBeVisible()
  await name_applicant.fill('Test')
  
  await page.waitForTimeout(1000)
  const last_name = page.locator('[name="applicant.0.last_name"]')
  await last_name.fill('Test')
  await page.waitForTimeout(1000)

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/turkey/apply-now#step=step_3c')
  
  const passport_num = page.locator('[name="applicant.0.passport_num"]')
  await expect(passport_num).toBeVisible()
  await passport_num.fill('123456789')
  const passport_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
  await passport_day.selectOption('13')
  const passport_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
  await passport_month.selectOption('7')
  const passport_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
  await passport_year.selectOption('2030')
  await page.waitForTimeout(4000)

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/turkey/apply-now#step=step_4')

  await expect(page.getByTestId('processing-standard')).toBeVisible()
  const standar_processing = page.getByTestId('processing-standard')
  await expect(standar_processing).toBeVisible()
  const price = await standar_processing.filter({has: page.locator('span')}).first().textContent()

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/turkey/apply-now#step=review')
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
  order_num = page.url().split("/")[4] 

  await page.getByPlaceholder('111-222-3333').fill('11111111')
  await page.getByTestId('boolean-WhatsApp').click()

  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await expect(page.getByTestId('boolean-Male')).toBeEnabled()
  await page.waitForTimeout(1000)
  await page.getByTestId('boolean-Male').click()
  await page.waitForTimeout(1000)
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

  await page.locator('id=trackApplication').click()
  await page.waitForURL(deploy_url + "order/" + order_num)

  // Purchase subscription

  await page.getByText("View plans").click()
  await expect(page.locator("id=iVisaPlusContent")).toBeVisible()

  await expect(page.getByTestId("purchase-subscription-button")).toContainText(" Subscribe for $79.99 $29.99")
  await percySnapshot(page, 'Purchase Subscription modal');
  await page.getByTestId("purchase-subscription-button").click()

  await page.waitForURL(deploy_url + "order/" + order_num + "?subscription=true")

  // Place free order 
  await page.goto(deploy_url + 'turkey/apply-now');

  await expect(dropdown_country).toBeVisible();
  await dropdown_country.click();
  await expect(input_country).toBeVisible();
  await input_country.fill('Mexico');
  await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()
  
  await selector_products.selectOption('38')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/turkey/apply-now#step=step_3a')
  
  await page.waitForTimeout(1000)
  await dob_day.selectOption('13')
  await dob_month.selectOption('7')
  await dob_year.selectOption('2002')
  await expect(name_applicant).toBeVisible()
  await name_applicant.fill('Test')
  
  await page.waitForTimeout(1000)
  await last_name.fill('Test')
  await page.waitForTimeout(1000)

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/turkey/apply-now#step=step_3c')
  
  await expect(passport_num).toBeVisible()
  await passport_num.fill('123456789')
  await passport_day.selectOption('13')
  await passport_month.selectOption('7')
  await passport_year.selectOption('2030')
  await page.waitForTimeout(4000)

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/turkey/apply-now#step=step_4')

  await expect(page.getByTestId('processing-standard')).toBeVisible()
  await expect(standar_processing).toBeVisible()
  await percySnapshot(page, 'Discount sidebar');

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/turkey/apply-now#step=review')
  
  await page.waitForTimeout(3000)
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }

  await expect(continue_sidebar).toBeEnabled()
  
  await continue_sidebar.click()

  await expect(page.locator('.card-body')).toContainText("Your iVisa+ Subscription covers the total cost of your application")
  await percySnapshot(page, 'Free order modal');

  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  order_num = page.url().split("/")[4] 

  await page.getByPlaceholder('111-222-3333').fill('11111111')
  await page.getByTestId('boolean-WhatsApp').click()

  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await expect(page.getByTestId('boolean-Male')).toBeEnabled()
  await page.waitForTimeout(1000)
  await page.getByTestId('boolean-Male').click()
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()

  await page.waitForNavigation({waitUntil: 'load'})
  await passport_issue_day.selectOption('13')
  await page.waitForTimeout(1000)

  await passport_issue_month.selectOption('7')
  await page.waitForTimeout(1000)
  await passport_issue_year.selectOption('2020')
  await page.waitForTimeout(1000)
  await expect(submit_post_payment).toBeEnabled()
  await submit_post_payment.click()
  await page.waitForNavigation({waitUntil: 'load'})

  await page.locator('id=trackApplication').click()
  await page.waitForURL(deploy_url + "order/" + order_num)
})