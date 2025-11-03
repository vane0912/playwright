const { test, expect, devices } = require('@playwright/test');
const { deploy_url, email_test } = require('../urls');

const iPhone13 = devices['iPhone 13'];

test.use({
  ...iPhone13,
});

test('Travel Doc application pre and post payment are working Mobile', async({page}) => {
    await page.goto(deploy_url + 'thailand/apply-now')
    const headerMobileNav = page.locator('id=headerMobileNav');
    await expect(headerMobileNav).toBeVisible()
    // Validations step_1
    const container = page.locator('id=question-container')
    const container_txt = ["Ensure you select the nationality of the passport you'll be traveling with.", "What's your nationality?", "Applying for", "50,000+ Reviews"]
    container_txt.forEach(async txt => await expect(container).toContainText(txt))
    /*
    const arrival_date_visible = page.locator('[name="general.arrival_date"]')
    await expect(arrival_date_visible).toBeVisible()
    await arrival_date_visible.click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
    await page.locator('[data-dp-element="action-next"]').click()
    await page.locator('.dp--future').filter({hasText: '2'}).first().click()
    */
    const continue_sidebar = page.locator('id=btnContinueUnderSectionMobile')
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/thailand/apply-now#step=step_3a')
      
    // Validations Step_3a
    await expect(page.locator('[name="general.email"]')).toBeVisible()
    await expect(page.getByTestId("add-traveler")).toBeVisible()

    // General checks    
    await expect(page.getByRole('heading', { name: 'Thailand Digital Arrival Card' })).toContainText('Thailand Digital Arrival Card')
    await expect(page.locator("id=question-container")).toContainText('Your personal details')
    await expect(page.locator("id=question-container")).toContainText("Enter the details as they appear on your passport")

    //
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

    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/thailand/apply-now#step=step_3c')

    // Validations Step_3c
    await expect(page.getByRole('heading', { name: 'Thailand Digital Arrival Card' })).toContainText('Thailand Digital Arrival Card')
    await expect(page.locator("id=question-container")).toContainText('Passport details')
    await expect(page.locator("id=question-container")).toContainText("Add passport details later")
    
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
    await page.waitForURL('**/thailand/apply-now#step=step_4')

    // Validations Step_4
    await expect(page.getByRole('heading', { name: 'Thailand Digital Arrival Card' })).toContainText('Thailand Digital Arrival Card')
    await expect(page.locator("id=question-container")).toContainText('Choose your processing time')
    await expect(page.getByTestId('processing-standard')).toBeVisible()    

    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/thailand/apply-now#step=review')

    await page.waitForTimeout(2000)
    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }

    // Validations Review_step
    const question_container = page.locator("id=question-container")
    const question_container_txt = ['Standard Processing', 'Thailand Digital Arrival Card', 'Valid for: ', '30 days after arrival', 'Max stay: ', '30 days per entry', 'Number of entries: ', 'Single entry', 'travelers', 'Test Test']
    await expect(page.getByRole('heading', { name: 'Review your order' }).first()).toContainText('Review your order')
    question_container_txt.forEach(async txt => await expect(question_container).toContainText(txt))
  
    const review_step_sidebar = await page.getByTestId('sidebar-summary-breakdown')

    await expect(review_step_sidebar).toContainText('Thailand Digital Arrival Card')
    await expect(review_step_sidebar).toContainText('1 Traveler')
    await expect(review_step_sidebar).toContainText('$59.99')
    await expect(review_step_sidebar).toContainText('Standard, 24 hours')

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
    
    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})
    await page.getByTestId("transition-page-button").click()
    // Post payment
    await page.getByPlaceholder('111-222-3333').fill('11111111')
    
    await page.getByTestId('boolean-WhatsApp').click()
    const arrival_date_visible = page.locator('[name="general.arrival_date"]')
    await expect(arrival_date_visible).toBeVisible()
    await arrival_date_visible.click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
    await page.locator('[data-dp-element="action-next"]').click()
    await page.locator('.dp--future').filter({hasText: '2'}).first().click()
    //await page.locator('[name="general.city_current_residence"]').fill("Test")
    const next_btn = page.locator('id=btnContinueUnderSection')
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})
    await page.waitForTimeout(3000)
    //await page.getByTestId("boolean-Tourism").click()
    /*
    const before_thailand = page.locator('[name="general.country_where_boarded"]')
    await before_thailand.click()
    const before_thailand_input = page.getByTestId('dropdown-general.country_where_boarded');
    await expect(before_thailand_input).toBeVisible();
    await before_thailand_input.fill('Mexico');
    await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()
    */
    await page.locator('[name="general.arrival_flight_number"]').fill("1234")
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})

    // Sidebar checks
    await page.waitForTimeout(1000)
    await page.getByTestId('boolean-Male').click()
    await page.waitForTimeout(1000)
    /*
    const host_city = page.locator('[name="applicant.0.profession_occupation"]')
    await host_city.click()
    const host_city_input = page.getByTestId('dropdown-applicant.0.profession_occupation');

    await expect(host_city_input).toBeVisible();
    await host_city_input.fill('Accountant');
    await page.waitForTimeout(2000)
    await page.getByRole('option', { name: 'Accountant' }).click()
    await page.waitForTimeout(2000)
    */
    const submit_post_payment = page.locator('id=btnSubmitApplication')
    await expect(submit_post_payment).toBeEnabled()
    await submit_post_payment.click()
    await page.waitForNavigation({waitUntil: 'load'})

    const track_application = page.locator('#trackApplication')
    await expect(track_application).toBeVisible()
})




