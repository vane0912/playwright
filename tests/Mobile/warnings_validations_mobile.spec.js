const { test, expect, devices } = require('@playwright/test');
const { deploy_url } = require('../urls');

const iPhone13 = devices['iPhone 13'];

test.use({
  ...iPhone13,
});
test('Appointment location error mobile', async({page}) => {
    await page.goto(deploy_url + 'australia/apply-now')
  
    const dropdown_country =  page.getByTestId('filter-value');
    await expect(dropdown_country).toBeVisible();
    await dropdown_country.click();
    const input_country = page.getByTestId('dropdown-general.common_nationality_country');
  
    await expect(input_country).toBeVisible();
    await input_country.fill('Mexico');
    await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()
  
    const selector_products = page.getByTestId('dropdown-general.visa_type_id');
    await selector_products.selectOption('5085')
    
    const arrival_date_visible = page.locator('[name="general.arrival_date"]')
    await expect(arrival_date_visible).toBeVisible()
    await arrival_date_visible.click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
    await page.locator('[data-dp-element="action-next"]').click()
    await page.locator('[data-dp-element="action-next"]').click()
    await page.locator('.dp--future').filter({hasText: '12'}).first().click()
  
    const continue_sidebar = page.locator('id=btnContinueUnderSectionMobile')
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/australia/apply-now#step=step_3a')

    await expect(page.locator('[name="general.email"]')).toBeVisible()
  
    await page.waitForTimeout(1000)
    const dob_day = page.locator('[name="applicant.0.dob.day"]')
    await dob_day.selectOption('13')
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

  
    const add_traveler = page.getByTestId('add-traveler')
    await add_traveler.click()
  
    const dob_day_2 = page.locator('[name="applicant.1.dob.day"]')
    await dob_day_2.selectOption('13')
  
    const dob_month_2 = page.locator('[name="applicant.1.dob.month"]')
    await dob_month_2.selectOption('7')
  
    const dob_year_2 = page.locator('[name="applicant.1.dob.year"]')
    await dob_year_2.selectOption('2000')

    await page.waitForTimeout(1000)
    const name_applicant_2 = page.locator('[name="applicant.1.first_name"]')
    await expect(name_applicant_2).toBeVisible()
    await name_applicant_2.fill('Test')
    await page.waitForTimeout(1000)
    const last_name_2 = page.locator('[name="applicant.1.last_name"]')
    await last_name_2.fill('Test')
    await page.waitForTimeout(1000)
  
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/australia/apply-now#step=step_3c')
  
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
    await page.waitForURL('**/australia/apply-now#step=step_3e')
  
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
  
test('Trip disclaimer appearing for arrival date warnings mobile', async({page}) => {
  const today = new Date()
  await page.goto(deploy_url + 'india/apply-now')
  await page.setViewportSize({ width: 412, height: 915 });

  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()

  await page.locator('.dp__today').filter({hasText: `${today.getDate()}`}).first().click()

  await expect(page.getByTestId('arrivalDateWarningBody')).toBeVisible()
  await expect(page.getByTestId('arrivalDateWarningBody')).toContainText('Apply now to receive your document(s) on time.')

})
  
