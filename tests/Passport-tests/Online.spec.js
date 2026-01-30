const { test, expect } = require('@playwright/test');
const appFunctions = require('../functions')
const passportSteps = require("../Functions/passport")
const path = require('path');

test('Online Passport', async({page}) =>{
    test.slow()
    await passportSteps.step_1_passport(page)

    const continue_sidebar = page.locator('#btnContinueSidebar')
    await continue_sidebar.click()

    await page.locator('#btnContinueSidebar').waitFor()
    await page.locator('#btnContinueSidebar').click()
    //
    await passportSteps.step_3_passport(page)
    await page.locator('#btnContinueSidebar').click()

    await page.waitForTimeout(3000)
    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }

    await page.getByText('Standard Service', { exact: true }).click()

    await appFunctions.newPaymentCheckout(page,"**/passport-renewal/united-states/application#","4111111111111111", "123", false)

    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    
    // Post Payment
    await page.waitForNavigation({waitUntil: 'load'})
    await page.getByTestId("transition-page-button").click()

    await page.getByTestId('boolean-WhatsApp').dispatchEvent('click')
    
    await page.getByTestId('boolean-Standard — 28 pages').dispatchEvent('click')

    await page.getByPlaceholder('111-222-3333').click()
    await page.waitForTimeout(1000)
    await page.keyboard.type("11111111", {delay: 100})

    const next_btn = page.locator('id=btnContinueUnderSection')
    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    
    await page.waitForNavigation({waitUntil: 'load'})
    
    await page.waitForTimeout(2000)
    const birth_country = page.locator('[name="applicant.0.state_of_birth"]');
    await expect(birth_country).toBeVisible();
    await birth_country.click()
    const input_birth_country = page.getByTestId('dropdown-applicant.0.state_of_birth');
    await expect(input_birth_country).toBeVisible();
    await input_birth_country.fill('alaska');
    await page.getByRole("option", {name: 'AK - ALASKA'}).click()
    await page.waitForTimeout(1000)

    await page.locator('[name="applicant.0.birth_city"]').fill('aaaaaaaaa')

    const eye_color = page.locator('[name="applicant.0.appearance_1"]');
    await expect(eye_color).toBeVisible();
    await eye_color.click();
    const input_eye_color = page.getByTestId('dropdown-applicant.0.appearance_1');

    await expect(input_eye_color).toBeVisible();
    await input_eye_color.fill('amber');
    await page.waitForTimeout(1000)
    await page.keyboard.press("ArrowDown")
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter")
    await page.waitForTimeout(1000)

    const hair_color = page.getByTestId('dropdown-applicant.0.appearence_2');
    await hair_color.selectOption('Brown')

    await page.locator("id=feet-applicant.0.height_fsr").fill('5')
    await page.locator("id=inches-applicant.0.height_fsr").fill('5')

    await page.getByTestId('dropdown-applicant.0.occupation').selectOption('self-employed')

    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()

    await page.waitForNavigation({waitUntil: 'load'})
    /*
    await page.getByPlaceholder('123 Main Street, Springfield, USA').fill('123')
    await page.waitForTimeout(2000)
    await page.keyboard.press("Space")
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter")
    await page.waitForTimeout(1000)
    await page.locator('//li[@data-place-id="ChIJoZ8Hus00K4gRfgPGjqVFR5w"]').click()

    await page.locator('[name="applicant.0.emergency_contact_city"]').fill('aaaaaa')
    await page.locator('[name="applicant.0.emergency_contact_state"]').fill('aaaaaa')
    await page.locator('[name="applicant.0.emergency_contact_zip"]').fill('aaaaaa')
    
    const emergency_contact_country = page.locator('[name="applicant.0.emergency_contact_country"]');
    await expect(emergency_contact_country).toBeVisible();
    await emergency_contact_country.click();
    const input_emergency_contact_country = page.getByTestId('dropdown-applicant.0.emergency_contact_country');

    await expect(input_emergency_contact_country).toBeVisible();
    await input_emergency_contact_country.fill('Mexico');
    await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()

    await page.locator('xpath=//div[@name="applicant.0.emergency_contact_phone"]//div[@data-handle="filter-value"]').click()
    await page.waitForTimeout(2000)
    await page.getByTestId('dial-codes').fill('52')
    await page.waitForTimeout(2000)
    await page.keyboard.press('ArrowDown')
    await page.keyboard.press('Enter')

    await page.getByPlaceholder('Elizabeth').fill('Test')
    await page.waitForTimeout(1000)
    await page.getByPlaceholder('Decker').fill('Test')
    await page.waitForTimeout(1000)
      
    const shipping_state = page.locator('[name="applicant.0.emergency_relationship"]');
    await expect(shipping_state).toBeVisible();
    await shipping_state.click();
    const input_shipping_state = page.getByTestId('dropdown-applicant.0.emergency_relationship');
    await expect(input_shipping_state).toBeVisible();
    await input_shipping_state.fill('Child');
    await page.waitForTimeout(1000)  
    await page.getByRole("option", {name: ' Child'}).click()

    await page.getByPlaceholder('111-222-3333').click()
    await page.waitForTimeout(1000)
    await page.keyboard.type("11111111", {delay: 100})

    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()

    await page.waitForNavigation({waitUntil: 'load'})
    */
    await page.locator('[name="applicant.0.ssn"]').click()
    await page.waitForTimeout(1000)
    await page.keyboard.type("123456")
    await page.waitForTimeout(1000)
    await page.keyboard.press('Enter')
    await expect(next_btn).toBeEnabled()
    await page.waitForTimeout(1000)
    await next_btn.click()

    await page.waitForNavigation({waitUntil: 'load'})
    /*
    await page.locator('[name="applicant.0.fathers_first_name"]').fill('test')
    await page.waitForTimeout(1000)
    await page.locator('[name="applicant.0.fathers_last_name"]').fill('test')
    await page.locator('//div[@name="applicant.0.father_us_citizen"]//button[@data-handle="boolean-Yes"]').click()
    
    await page.locator('[name="applicant.0.mothers_first_name"]').fill('test')
    await page.waitForTimeout(1000)

    await page.waitForTimeout(2000)
    await page.locator('//div[@name="applicant.0.mother_us_citizen"]//button[@data-handle="boolean-Yes"]').click()
    await page.waitForTimeout(2000)
    await page.locator('[name="applicant.0.mothers_last_name"]').pressSequentially('test', { delay: 100 })
    await page.waitForTimeout(1000)

    await expect(next_btn).toBeEnabled()
    await next_btn.click()

    await page.waitForNavigation({waitUntil: 'load'})
    */

    await page.locator('id=instructions-continue').click()
    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname, 'uploads_passport/Applicant-Photo.jpg'));
    await page.waitForTimeout(8000)
    await page.locator('id=review-continue').click()

    await page.locator('id=instructions-continue').click()
    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname, 'uploads_passport/passport.jpg'));
    await page.waitForTimeout(8000)

    await page.locator('id=review-continue').click()

    //await page.getByText("Use selected details").click()
    const passport_issue_day = page.locator('[name="applicant.0.passport_issued_date.day"]')
    await expect(passport_issue_day).toBeVisible()
    await passport_issue_day.selectOption('13')
    await page.waitForTimeout(1000)
    
    const passport_issue_month = page.locator('[name="applicant.0.passport_issued_date.month"]')
    await passport_issue_month.selectOption('7')
    await page.waitForTimeout(1000)

    const passport_issue_year = page.locator('[name="applicant.0.passport_issued_date.year"]')
    await passport_issue_year.selectOption('2012')
    await page.waitForTimeout(1000)
    
    const passport_expiration_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
    await passport_expiration_day.selectOption('13')
    await page.waitForTimeout(1000)
    
    const passport_expiration_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
    await passport_expiration_month.selectOption('7')

    const passport_expiration_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
    await passport_expiration_year.selectOption('2023')  

    await page.locator('[name="applicant.0.passport_num"]').fill('111111111')


    const submit_post_payment = page.locator("id=btnSubmitApplication")
    await submit_post_payment.click()
    await page.waitForNavigation({waitUntil: 'load'})
    const track_application = page.locator('#trackApplication')
    await expect(track_application).toBeVisible()
})