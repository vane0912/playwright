const { test, expect } = require('@playwright/test');
const {deploy_url, Orders} = require('../urls');

test('Log in with ID', async ({ page }) => {
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
  /*
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()
  */
  const continue_sidebar = page.locator('id=btnContinueSidebar')
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/turkey/apply-now#step=step_3a')
  
  const dob_day = page.locator('[name="applicant.0.dob.day"]')
  await dob_day.selectOption('11')

  const dob_month = page.locator('[name="applicant.0.dob.month"]')
  await dob_month.selectOption('7')

  const dob_year = page.locator('[name="applicant.0.dob.year"]')
  await dob_year.selectOption('2000')

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

  Orders.push(page.url().split("/")[4]) 
  
  await page.goto(deploy_url + 'account/settings')
  const user = page.locator('id=loggedInUserContainer')
  await expect(user).toBeVisible()
  await user.click()
  const btn_logout = page.locator('id=btnLogout')
  await expect(btn_logout).toBeVisible()
  await btn_logout.click()
  await page.goto(deploy_url + 'login')
  await page.waitForURL('**/login')
  const email = page.locator('id=email_login_input')
  await expect(email).toBeVisible()
  
  await email.fill(Orders[0])
  const continue_login = page.locator('id=continue_button')
  await expect(continue_login).toBeEnabled()
  await continue_login.click()
  const password = page.locator('id=password_login_input')
  await expect(password).toBeVisible()
  await password.fill('testivisa5!')  
  const login_cta = page.locator('id=log_in_button')
  await expect(login_cta).toBeEnabled()
  await login_cta.click()
  await page.waitForNavigation({waitUntil: 'load'})
})
