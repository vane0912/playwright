const { test, expect } = require('@playwright/test');
const {deploy_url, email_test, Orders} = require('./urls');

test('Denial Protection', async ({ browser }) =>{
  const context = await browser.newContext({ recordVideo: { dir: 'wolf-evidence/Denial-protection' } });
  await context.addCookies([{name: 'mock_domain', value: 'wolf.test', url: deploy_url}])
  
  const page = await context.newPage();
  await page.goto(deploy_url + 'a/turkey');
  const dropdown_country =  page.getByTestId('filter-value');

  await expect(dropdown_country).toBeVisible();
  await dropdown_country.click();
  const input_country = page.getByTestId('dropdown-general.common_nationality_country');

  await expect(input_country).toBeVisible();
  await input_country.fill('Mexico');
  await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()

  const selector_products = page.getByTestId('dropdown-general.visa_type_id');
  await selector_products.selectOption('38')

  const continue_step1 = page.locator('id=btnContinueSidebar')
  await expect(continue_step1).toBeEnabled()
  await continue_step1.click()
  await page.waitForURL('**/a/turkey#step=step_2')
  
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()
  await expect(page.locator('[name="general.email"]')).toBeVisible()
  

  const continue_sidebar = page.locator('id=btnContinueSidebar')
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/a/turkey#step=step_3a')
  
  const name_applicant = page.getByPlaceholder("John William")
  await expect(name_applicant).toBeVisible()
  await name_applicant.fill('Test')

  const last_name = page.getByPlaceholder("Smith")
  await last_name.fill('Test')

  const dob_day = page.locator('[name="applicant.0.dob.day"]')
  await dob_day.selectOption('11')

  const dob_month = page.locator('[name="applicant.0.dob.month"]')
  await dob_month.selectOption('7')

  const dob_year = page.locator('[name="applicant.0.dob.year"]')
  await dob_year.selectOption('2000')

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/a/turkey#step=step_3c')
  
  const passport_num = page.locator('[name="applicant.0.passport_num"]')
  await expect(passport_num).toBeVisible()
  await passport_num.fill('123456789')

  const passport_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
  await passport_day.selectOption('13')

  const passport_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
  await passport_month.selectOption('7')

  const passport_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
  await passport_year.selectOption('2030')

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/a/turkey#step=step_4')

  await expect(page.getByTestId('processing-standard')).toBeVisible()
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/a/turkey#step=review')
  await page.waitForTimeout(2000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  const denial_protection = page.getByRole('checkbox')
  await denial_protection.check() 
  await expect(denial_protection).toBeChecked()
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})

  Orders.push(page.url().split("/")[4]) 
  await page.getByPlaceholder('111-222-3333').fill('11111111')
  await page.getByTestId('boolean-WhatsApp').click()

  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})

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
})
test('Different currency', async ({ browser }) => {
  const context = await browser.newContext({ recordVideo: { dir: 'wolf-evidence/Different-currency' } });
  await context.addCookies([{name: 'mock_domain', value: 'wolf.test', url: deploy_url}])
  const page = await context.newPage();

  await page.goto(deploy_url + 'a/turkey');
  const currency = page.locator('id=currencyHeader');
  await expect(currency).toBeVisible()
  await currency.click()

  const dropdown_currency = page.getByTestId('filter-value').filter({hasText: 'USD $'})
  await expect(dropdown_currency).toBeVisible()
  await dropdown_currency.click()
  const input_currency = page.getByTestId('dropdown-modal-currency')
  await input_currency.fill('mxn')
  const confirm_currency = page.locator("[value='MXN']")
  await expect(confirm_currency).toBeVisible()
  await confirm_currency.click()
  await page.locator('id=updatePrefButton').click()

  const dropdown_country = page.getByTestId('filter-value');
  await expect(dropdown_country).toBeVisible();
  await dropdown_country.click();
  const input_country = page.getByTestId('dropdown-general.common_nationality_country');
  await expect(input_country).toBeVisible();
  await input_country.fill('Mexico');
  await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()
  
  const selector_products = page.getByTestId('dropdown-general.visa_type_id');
  await selector_products.selectOption('38')
  const continue_step1 = page.locator('id=btnContinueSidebar')
  await expect(continue_step1).toBeEnabled()
  await continue_step1.click()
  
  await page.waitForURL('**/a/turkey#step=step_2')
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()

  const continue_sidebar = page.locator('id=btnContinueSidebar')
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/a/turkey#step=step_3a')
  
  const name_applicant = page.getByPlaceholder("John William")
  await expect(name_applicant).toBeVisible()
  await name_applicant.fill('Test')

  const last_name = page.getByPlaceholder("Smith")
  await last_name.fill('Test')

  const dob_day = page.locator('[name="applicant.0.dob.day"]')
  await dob_day.selectOption('11')

  const dob_month = page.locator('[name="applicant.0.dob.month"]')
  await dob_month.selectOption('7')

  const dob_year = page.locator('[name="applicant.0.dob.year"]')
  await dob_year.selectOption('2000')

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/a/turkey#step=step_3c')
  
  const passport_num = page.locator('[name="applicant.0.passport_num"]')
  await expect(passport_num).toBeVisible()
  await passport_num.fill('123456789')

  const passport_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
  await passport_day.selectOption('13')

  const passport_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
  await passport_month.selectOption('7')

  const passport_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
  await passport_year.selectOption('2030')

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/a/turkey#step=step_4')

  await expect(page.getByTestId('processing-standard')).toBeVisible()
  const standar_processing = page.getByTestId('processing-standard')
  await expect(standar_processing).toBeVisible()
  const price = await standar_processing.filter({has: page.locator('span')}).first().textContent()

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/a/turkey#step=review')
  await page.waitForTimeout(2000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  const total_price = page.getByTestId('order-total')
  await expect(total_price).toBeVisible()
  const total_price_assertion = await page.locator('//span[@data-handle="order-total"]').textContent()

  console.log(total_price_assertion)
  console.log(price.split(' ')[0].replace(",", ""))
  expect.soft(price.split(' ')[0].replace(",", ""), 'Expect Total to be the same as Standard').toContain(total_price_assertion)

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})

  Orders.push(page.url().split("/")[4]) 
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
})
test('Password_test', async ({ browser }) => {
  const context = await browser.newContext({ recordVideo: { dir: 'wolf-evidence/Password-test' } });
  await context.addCookies([{name: 'mock_domain', value: 'wolf.test', url: deploy_url}])
  const page = await context.newPage();
  
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
  await email.fill(email_test)
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
test('Card update', async ({ browser }) => {
  const context = await browser.newContext({ recordVideo: { dir: 'wolf-evidence/Card Payment' } });
  await context.addCookies([{name: 'mock_domain', value: 'wolf.test', url: deploy_url}])
  const page = await context.newPage();
  
  await page.goto(deploy_url + 'account/payment-method')
  await expect(page.getByTestId("updatePaymentMethodBtn")).toBeEnabled()

  await page.goto(deploy_url + 'account/payment-method/edit')
  await page.getByPlaceholder("Card number").fill("4111 1111 1111 1111")
  await page.getByPlaceholder("MM/YY").fill("10/26")
  await page.getByPlaceholder("CVV").fill("123")
  await page.getByPlaceholder("Cardholder name").fill("John Smith")
  await page.locator("id=btnSubmitPayment").click()
  await page.waitForURL('**/account/payment-method')
})
test('Appointment location error', async({ browser }) => {
  const context = await browser.newContext({ recordVideo: { dir: 'wolf-evidence/Appointment-location' } });
  await context.addCookies([{name: 'mock_domain', value: 'wolf.test', url: deploy_url}])
  const page = await context.newPage();
  await page.goto(deploy_url + 'a/australia')

  const dropdown_country =  page.getByTestId('filter-value');
  await expect(dropdown_country).toBeVisible();
  await dropdown_country.click();
  const input_country = page.getByTestId('dropdown-general.common_nationality_country');

  await expect(input_country).toBeVisible();
  await input_country.fill('Mexico');
  await page.waitForTimeout(1000)
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(1000)
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000)
  const selector_products = page.getByTestId('dropdown-general.visa_type_id');
  await selector_products.selectOption('5085')
  const continue_step1 = page.locator('id=btnContinueSidebar')
  await expect(continue_step1).toBeEnabled()
  await continue_step1.click()
  await page.waitForURL('**/a/australia#step=step_2')
  
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()

  await page.waitForTimeout(2000)
  const departure_date_visible = page.locator('[name="general.departure_date"]')
  await expect(departure_date_visible).toBeVisible()
  await departure_date_visible.click()
  await page.waitForTimeout(1000)
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '16'}).first().click()

  const continue_sidebar = page.locator('id=btnContinueSidebar')
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/a/australia#step=step_3a')

  const name_applicant = page.getByPlaceholder("John William")
  await expect(name_applicant).toBeVisible()
  await name_applicant.fill('Test')

  const last_name = page.getByPlaceholder("Smith")
  await last_name.fill('Test')

  const dob_day = page.locator('[name="applicant.0.dob.day"]')
  await dob_day.selectOption('13')

  const dob_month = page.locator('[name="applicant.0.dob.month"]')
  await dob_month.selectOption('7')

  const dob_year = page.locator('[name="applicant.0.dob.year"]')
  await dob_year.selectOption('2000')

  const add_traveler = page.getByTestId('add-traveler')
  await add_traveler.click()

  const name_applicant_2 = page.locator('[name="applicant.1.first_name"]')
  await expect(name_applicant_2).toBeVisible()
  await name_applicant_2.fill('Test')

  const last_name_2 = page.locator('[name="applicant.1.last_name"]')
  await last_name_2.fill('Test')

  const dob_day_2 = page.locator('[name="applicant.1.dob.day"]')
  await dob_day_2.selectOption('13')

  const dob_month_2 = page.locator('[name="applicant.1.dob.month"]')
  await dob_month_2.selectOption('7')

  const dob_year_2 = page.locator('[name="applicant.1.dob.year"]')
  await dob_year_2.selectOption('2000')

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/a/australia#step=step_3c')

  const skip_passport = page.locator('[name="applicant.0.is_passport_on_hand"]')
  await expect(skip_passport).toBeVisible()
  await skip_passport.check()
  await expect(skip_passport).toBeChecked()

  // First Applicant 
  const occupation_triage = page.locator('[name="applicant.0.occupation_triage"]');
  await occupation_triage.click()

  const employe_input = page.getByTestId('dropdown-applicant.0.occupation_triage')
  await expect(employe_input).toBeVisible();
  await employe_input.fill('Employed - More than 2 years in current role');
  await page.waitForTimeout(1000)
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(1000)
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000)

  const monthly_income = page.getByTestId('dropdown-applicant.0.income_triage')
  await expect(monthly_income).toBeVisible()
  await monthly_income.selectOption('Over 2500 USD monthly')

  const assets_div = page.locator('[name="applicant.0.own_state_triage"]');
  const assets_boolean = assets_div.getByTestId('boolean-Yes')
  await assets_boolean.click()

  const other_countries_travel = page.getByTestId('travelerSection-0').getByTestId("boolean-Yes, in the last 5 years, I have traveled out of my home country and returned.")
  await other_countries_travel.click()

  const visa_denied = page.getByTestId('travelerSection-0').getByTestId("boolean-I was denied this visa over 12 months ago")
  await visa_denied.click()

  // Second applicant
  const skip_passport_1 = page.locator('[name="applicant.1.is_passport_on_hand"]')
  await expect(skip_passport_1).toBeVisible()
  await skip_passport_1.check()
  await expect(skip_passport_1).toBeChecked()

  const occupation_triage_1 = page.locator('[name="applicant.1.occupation_triage"]');
  await occupation_triage_1.click()

  const employe_input_1 = page.getByTestId('dropdown-applicant.1.occupation_triage')
  await expect(employe_input_1).toBeVisible();
  await employe_input_1.fill('Employed - More than 2 years in current role');
  await page.waitForTimeout(1000)
  await page.keyboard.press('ArrowDown');
  await page.waitForTimeout(1000)
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000)

  const monthly_income_1 = page.getByTestId('dropdown-applicant.1.income_triage')
  await expect(monthly_income_1).toBeVisible()
  await monthly_income_1.selectOption('Over 2500 USD monthly')

  const assets_div_1 = page.locator('[name="applicant.1.own_state_triage"]');
  const assets_boolean_1 = assets_div_1.getByTestId('boolean-Yes')
  await assets_boolean_1.click()

  const other_countries_travel_1 = page.getByTestId('travelerSection-1').getByTestId('boolean-Yes, in the last 5 years, I have traveled out of my home country and returned.')
  await other_countries_travel_1.click()

  const visa_denied_1 = page.getByTestId('travelerSection-1').getByTestId("boolean-I was denied this visa over 12 months ago")
  await visa_denied_1.click()

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/a/australia#step=step_3e')

  const location_1 = page.locator('[name="applicant.0.appointment_location_id"]')
  await location_1.getByTestId('boolean-4575').click()

  await page.locator('//div[@data-handle="travelerSectionWrapper-1"]//span').click()
  const location_2 = page.locator('[name="applicant.1.appointment_location_id"]')
  await location_2.getByTestId('boolean-23003').click()

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()

  const error_text = page.getByText('Your order cannot include different appointment locations. Please make separate orders for each location.')
  await expect(error_text).toBeVisible()

  await page.waitForTimeout(9000)
})
test('Extra order', async ({ browser }) =>{
  const context = await browser.newContext({ recordVideo: { dir: 'wolf-evidence/Denial-protection' } });
  await context.addCookies([{name: 'mock_domain', value: 'wolf.test', url: deploy_url}])
  
  const page = await context.newPage();
  await page.goto(deploy_url + 'a/turkey');
  const dropdown_country =  page.getByTestId('filter-value');

  await expect(dropdown_country).toBeVisible();
  await dropdown_country.click();
  const input_country = page.getByTestId('dropdown-general.common_nationality_country');

  await expect(input_country).toBeVisible();
  await input_country.fill('Mexico');
  await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()

  const selector_products = page.getByTestId('dropdown-general.visa_type_id');
  await selector_products.selectOption('38')

  const continue_step1 = page.locator('id=btnContinueSidebar')
  await expect(continue_step1).toBeEnabled()
  await continue_step1.click()
  await page.waitForURL('**/a/turkey#step=step_2')
  
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()
  await expect(page.locator('[name="general.email"]')).toBeVisible()
  

  const continue_sidebar = page.locator('id=btnContinueSidebar')
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/a/turkey#step=step_3a')
  
  const name_applicant = page.getByPlaceholder("John William")
  await expect(name_applicant).toBeVisible()
  await name_applicant.fill('Test')

  const last_name = page.getByPlaceholder("Smith")
  await last_name.fill('Test')

  const dob_day = page.locator('[name="applicant.0.dob.day"]')
  await dob_day.selectOption('11')

  const dob_month = page.locator('[name="applicant.0.dob.month"]')
  await dob_month.selectOption('7')

  const dob_year = page.locator('[name="applicant.0.dob.year"]')
  await dob_year.selectOption('2000')

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/a/turkey#step=step_3c')
  
  const passport_num = page.locator('[name="applicant.0.passport_num"]')
  await expect(passport_num).toBeVisible()
  await passport_num.fill('123456789')

  const passport_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
  await passport_day.selectOption('13')

  const passport_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
  await passport_month.selectOption('7')

  const passport_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
  await passport_year.selectOption('2030')

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/a/turkey#step=step_4')

  await expect(page.getByTestId('processing-standard')).toBeVisible()
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/a/turkey#step=review')
  await page.waitForTimeout(2000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  const denial_protection = page.getByRole('checkbox')
  await denial_protection.check() 
  await expect(denial_protection).toBeChecked()
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})

  Orders.push(page.url().split("/")[4]) 
  await page.getByPlaceholder('111-222-3333').fill('11111111')
  await page.getByTestId('boolean-WhatsApp').click()

  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})

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
})
test.skip('Purchase Subscription', async({ browser }) => {
  const context = await browser.newContext({ recordVideo: { dir: 'wolf-evidence/Subscription' } });
  await context.addCookies([{name: 'mock_domain', value: 'wolf.test', url: deploy_url}])
  const page = await context.newPage();
  for(let i = 0; 2 > i; i++){
    await page.goto(deploy_url + 'a/turkey');
    const dropdown_country =  page.getByTestId('filter-value');
  
    await expect(dropdown_country).toBeVisible();
    await dropdown_country.click();
    const input_country = page.getByTestId('dropdown-general.common_nationality_country');
  
    await expect(input_country).toBeVisible();
    await input_country.fill('Mexico');
    await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()
  
    const selector_products = page.getByTestId('dropdown-general.visa_type_id');
    await selector_products.selectOption('38')
  
    const continue_step1 = page.locator('id=btnContinueSidebar')
    await expect(continue_step1).toBeEnabled()
    await continue_step1.click()
    await page.waitForURL('**/a/turkey#step=step_2')
    
    const arrival_date_visible = page.locator('[name="general.arrival_date"]')
    await expect(arrival_date_visible).toBeVisible()
    await arrival_date_visible.click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
    await page.locator('[data-dp-element="action-next"]').click()
    await page.locator('.dp--future').filter({hasText: '12'}).first().click()
    await expect(page.locator('[name="general.email"]')).toBeVisible()
  
    const continue_sidebar = page.locator('id=btnContinueSidebar')
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/a/turkey#step=step_3a')
    
    const name_applicant = page.getByPlaceholder("John William")
    await expect(name_applicant).toBeVisible()
    await name_applicant.fill('Test')
  
    const last_name = page.getByPlaceholder("Smith")
    await last_name.fill('Test')
  
    const dob_day = page.locator('[name="applicant.0.dob.day"]')
    await dob_day.selectOption('13')
  
    const dob_month = page.locator('[name="applicant.0.dob.month"]')
    await dob_month.selectOption('7')
  
    const dob_year = page.locator('[name="applicant.0.dob.year"]')
    await dob_year.selectOption('2000')
  
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/a/turkey#step=step_3c')
    
    const passport_num = page.locator('[name="applicant.0.passport_num"]')
    await expect(passport_num).toBeVisible()
    await passport_num.fill('123456789')
  
    const passport_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
    await passport_day.selectOption('13')
  
    const passport_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
    await passport_month.selectOption('7')
  
    const passport_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
    await passport_year.selectOption('2030')
  
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/a/turkey#step=step_4')
  
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/a/turkey#step=review')
    await page.waitForTimeout(2000)
    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()

    if(i === 1){
      const free_order = page.locator('.card-body')
      await expect(free_order).toBeVisible()
        
      await expect(free_order).toHaveText('Your iVisa+ Subscription covers the total cost of your applicationSubmit order')
      const payment_btn = page.locator('id=btnSubmitPayment')
      await expect(payment_btn).toBeVisible()
      await expect(payment_btn).toBeEnabled()
      await payment_btn.click()
    }else{
      const payment_btn = page.locator('id=btnSubmitPayment')
      await expect(payment_btn).toBeVisible()
      await expect(payment_btn).toBeEnabled()
      await payment_btn.click()
    }
    await page.waitForNavigation({waitUntil: 'load'})
    await page.getByPlaceholder('111-222-3333').fill('11111111')
    await page.getByTestId('boolean-WhatsApp').click()
  
    const next_btn = page.locator('id=btnContinueUnderSection')
    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})
  
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
  
    const track_application = page.locator('#trackApplication')
    await expect(track_application).toBeVisible()
    await track_application.click()
  
    await expect(page.locator("#h1-tag-container")).toBeVisible()
    if(i === 0){
      const open_modal = page.getByTestId('open-subscription-modal-button')
      await expect(open_modal).toBeEnabled()
      await open_modal.click()
    
      await expect(page.locator('#iVisaPlusContent')).toBeVisible()
      const buy_subscription_cta = page.getByTestId("purchase-subscription-button")
      await expect(buy_subscription_cta).toBeEnabled()
      await buy_subscription_cta.click()
    
      const subscription_purchased = page.getByTestId('close-modal')
      await subscription_purchased.click()
    }
  }
})
