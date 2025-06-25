const { test, expect } = require('@playwright/test');
const {deploy_url, email_test} = require('../urls');
const percySnapshot = require('@percy/playwright');

test('Travel Doc application pre and post payment are working', async({page}) => {
    await page.goto(deploy_url + 'colombia/apply-now')

    // Validations step_1
    const container = page.locator('id=question-container')
    const container_txt = ['Apply now for your Colombia Check-MIG Form', "Ensure you select the nationality of the passport you'll be traveling with.", "What is your nationality?", "Applying for", "50,000+ Reviews"]
    container_txt.forEach(async txt => await expect(container).toContainText(txt))

    const sidebar = page.getByTestId('step-1-sidebar')
    const sidebar_txt = [' Most popular', 'Valid for', '90 days after arrival', 'Number of entries','Single entry', 'Max stay', '90 days per entry']
    sidebar_txt.forEach(async txt => await expect(sidebar).toContainText(txt))

    const ids = ['id=help-button', 'id=currencyHeader', 'id=langHeader', 'id=logo-ivisa-link']
    ids.forEach(async id => await expect(page.locator(id)).toBeVisible())
    
    const arrival_date_visible = page.locator('[name="general.arrival_date"]')
    await expect(arrival_date_visible).toBeVisible()
    await arrival_date_visible.click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
    await page.locator('[data-dp-element="action-next"]').click()
    await page.locator('.dp--future').filter({hasText: '12'}).first().click()

    const continue_sidebar = page.locator('id=btnContinueSidebar')
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/colombia/apply-now#step=step_3a')
    
    // Validations Step_2
    await expect(page.locator('[name="general.email"]')).toBeVisible()

    // General checks    
    const sidebar_step_2 = page.getByTestId('sidebar-summary-breakdown')
    const sidebar_validations = ['Colombia Check-MIG Form', '+ Government fees', '$ 0.00']

    sidebar_validations.forEach(async txt => await expect(sidebar_step_2).toContainText(txt))

    // Validations Step_3a
    await expect(page.getByTestId("add-traveler")).toBeVisible()

    // General checks    
    await expect(page.getByRole('heading')).toContainText('Colombia Check-MIG Form')
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.locator("id=question-container")).toContainText('Your Personal Details')
    await expect(page.locator("id=question-container")).toContainText("These should match what's in your passport.")
    await expect(page.locator("id=btnPreviousSidebar")).toBeVisible()    

    const sidebar_3a = ['Colombia Check-MIG Form', '1 Traveler', '+ Government fees', '$ 0.00']
    sidebar_3a.forEach(async txt => await expect(sidebar_step_2).toContainText(txt))

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
    await page.waitForURL('**/colombia/apply-now#step=step_3c')

    // Validations Step_3c
    await expect(page.getByRole('heading')).toContainText('Colombia Check-MIG Form')
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.locator("id=question-container")).toContainText('Your Passport Information')
    await expect(page.locator("id=question-container")).toContainText("Add passport details later")
    await expect(page.locator("id=btnPreviousSidebar")).toBeVisible()    

    sidebar_3a.forEach(async txt => await expect(sidebar_step_2).toContainText(txt))

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
    await page.waitForURL('**/colombia/apply-now#step=step_4')

    // Validations Step_4
    await expect(page.getByRole('heading')).toContainText('Colombia Check-MIG Form')
    await expect(page.locator('footer')).toBeVisible()
    await expect(page.locator("id=question-container")).toContainText('Choose your processing time')
    await expect(page.getByTestId('processing-standard')).toBeVisible()    
    await expect(page.locator("id=btnPreviousSidebar")).toBeVisible()   

    sidebar_3a.forEach(async txt => await expect(sidebar_step_2).toContainText(txt))

    await expect(sidebar_step_2).toContainText('$ 49.99')
    await expect(sidebar_step_2).toContainText('+ Standard, 24 hours')

    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/colombia/apply-now#step=review')

    await page.waitForTimeout(2000)
    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }

    // Validations Review_step
    const question_container = page.locator("id=question-container")
    const question_container_txt = ['Arriving as soon as', 'Standard Processing', 'Colombia Check-MIG Form', 'Valid for: ', '90 days after arrival', 'Max stay: ', '90 days per entry', 'Number of entries: ', 'Single entry', 'travelers', 'Test Test']
    await expect(page.getByRole('heading').first()).toContainText('Review your order')
    await expect(page.locator('footer')).toBeVisible()
    question_container_txt.forEach(async txt => await expect(question_container).toContainText(txt))
  
    const review_step_sidebar = await page.getByTestId('sidebar-summary-breakdown').all()

    await expect(review_step_sidebar[1]).toContainText('Colombia Check-MIG Form')
    await expect(review_step_sidebar[1]).toContainText('1 Traveler')
    await expect(review_step_sidebar[1]).toContainText('+ Government fees')
    await expect(review_step_sidebar[1]).toContainText('$ 0.00')

    await expect(review_step_sidebar[1]).toContainText('$ 49.99')
    await expect(review_step_sidebar[1]).toContainText('+ Standard, 24 hours')
    await percySnapshot(page, 'Review step application')

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

    // Post payment

    // Sidebar checks
    const sidebar_checks = page.locator('//div[@data-vue-component="product-application-suspense-wrapper"]')
    const sidebar_post_payment_txt = ['Colombia Check-MIG Form Application', 'Trip details', 'Test Test', 'Personal Information']
    sidebar_post_payment_txt.forEach(async txt => await expect(sidebar_checks).toContainText(txt))
    await percySnapshot(page, 'Post payment application')
    await expect(page.getByTestId('General information')).toBeVisible()
    await expect(page.getByTestId('Personal Information')).toBeVisible()
    await page.waitForTimeout(1000)
    await page.locator('xpath=//div[@name="general.destination_phone"]//input[@name="telephone"]').click()
    await page.waitForTimeout(1000)
    await page.keyboard.type("11111111", {delay: 100})
    
    await page.getByTestId('boolean-WhatsApp').click()

    const arrive_colombia = page.locator('[name="general.arrival_location"]')
    await arrive_colombia.click()
    const arrive_colombia_input = page.getByTestId('dropdown-general.arrival_location');

    await expect(arrive_colombia_input).toBeVisible();
    await arrive_colombia_input.fill('Armenia (AXM), El Eden Airport');

    await page.getByRole("option", {value: 'Armenia (AXM), El Eden Airport'}).click()

    const host_city = page.locator('[name="general.destination_city"]')
    await host_city.click()
    const host_city_input = page.getByTestId('dropdown-general.destination_city');

    await expect(host_city_input).toBeVisible();
    await host_city_input.fill('ABREGO , NORTE DE SANTANDER');

    await page.getByRole("option", {value: 'ABREGO , NORTE DE SANTANDER'}).click()

    await page.locator('[name="general.destination_address"]').fill('123 William Street')

    await page.locator('[name="general.destination_state"]').fill('aaaaaa')
    await page.locator('[name="general.destination_zip"]').fill('aaaaaa')
    await page.locator('[name="general.destination_country"]').fill('aaaaaa')
    
    await page.waitForTimeout(1000)
    await page.getByPlaceholder('111-222-3333').first().click()
    await page.waitForTimeout(1000)
    await page.keyboard.type("11111111", {delay: 100})
    await page.waitForTimeout(1000)

    await page.waitForTimeout(1000)
    await page.locator('[name="general.arrival_flight_number"]').click()
    await page.waitForTimeout(1000)
    await page.keyboard.type("aaaaaaaa", {delay: 100})
    await page.waitForTimeout(1000)

    const next_btn = page.locator('id=btnContinueUnderSection')
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})

    await expect(page.getByTestId('boolean-Male')).toBeEnabled()

    // Sidebar checks
    sidebar_post_payment_txt.forEach(async txt => await expect(sidebar_checks).toContainText(txt))
    await expect(page.getByTestId('General information')).toBeVisible()
    await expect(page.getByTestId('Personal Information')).toBeVisible()

    await page.waitForTimeout(1000)
    await page.getByTestId('boolean-Male').click()
    await page.waitForTimeout(1000)

    const submit_post_payment = page.locator('id=btnSubmitApplication')
    await expect(submit_post_payment).toBeEnabled()
    await submit_post_payment.click()
    await page.waitForNavigation({waitUntil: 'load'})

    const track_application = page.locator('#trackApplication')
    await expect(track_application).toBeVisible()
})




