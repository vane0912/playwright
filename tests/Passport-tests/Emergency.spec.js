const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');
const path = require('path');

test('Emergency Passport', async({page}) =>{
    test.slow()
    await page.goto(deploy_url + 'passport-renewal/united-states/application')
    await page.waitForTimeout(2000)
    await page.locator("id=btnContinueSidebar").click()
    await page.waitForURL('**/passport-renewal/united-states/application#step=step_2')

    await expect(page.getByPlaceholder('John William')).toBeVisible()

    const dob_day = page.locator('[name="general.dob.day"]')
    await dob_day.selectOption('13')

    const dob_month = page.locator('[name="general.dob.month"]')
    await dob_month.selectOption('7')

    const dob_year = page.locator('[name="general.dob.year"]')
    await dob_year.selectOption('2000')

    const name_applicant = page.locator('[name="general.first_name"]')
    await expect(name_applicant).toBeVisible()
    await name_applicant.fill('Test')
    
    await page.waitForTimeout(1000)
    const last_name = page.locator('[name="general.last_name"]')
    await last_name.fill('Test')
    await page.waitForTimeout(1000)

    await expect(page.locator('#btnContinueSidebar')).toBeEnabled()
    await page.locator('#btnContinueSidebar').click()

    await page.waitForURL('**/passport-renewal/united-states/application#step=step_4')
    await page.waitForTimeout(2000)

    await page.getByText("Emergency Service", {exact: true}).click()

    await page.locator('#btnContinueSidebar').waitFor()
    await page.locator('#btnContinueSidebar').click()
    await page.locator('[name="applicant.0.shipping_address"]').fill('123')
    await page.waitForTimeout(2000)
    await page.keyboard.press("Space")
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter")
    await page.waitForTimeout(1000)

    const state = page.locator('[name="applicant.0.shipping_state"]');
    await expect(state).toBeVisible();
    await state.click();
    const input_state = page.getByTestId('dropdown-applicant.0.shipping_state');

    await expect(input_state).toBeVisible();
    await input_state.fill('Alabama');
    await page.getByRole("option", {name: ' Alabama'}).click()
    await page.waitForTimeout(1000)
    await page.locator('[name="applicant.0.shipping_zip"]').pressSequentially('test', { delay: 100 })
    await page.waitForTimeout(1000)
    await page.locator('[name="applicant.0.shipping_city"]').pressSequentially('test', { delay: 100 })
    await page.waitForTimeout(1000)

    await page.locator('#btnContinueSidebar').click()

    await page.waitForURL('**/passport-renewal/united-states/application#step=review')
    await page.waitForTimeout(2000)

    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }
    await page.getByRole('button', { name: 'Continue to payment' }).click()

    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    
    // Post Payment
    await page.waitForNavigation({waitUntil: 'load'})
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
    //await page.getByTestId('boolean-Female').dispatchEvent('click')
    //await page.waitForTimeout(1000)
    
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
    
    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    /*
    await page.waitForNavigation({waitUntil: 'load'})
    await page.waitForTimeout(2000)
    await page.locator('[name="applicant.0.fathers_first_name"]').pressSequentially('test', { delay: 100 })
    await page.waitForTimeout(1000)
    await page.locator('[name="applicant.0.fathers_last_name"]').pressSequentially('test', { delay: 100 })
    await page.waitForTimeout(1000)
    await page.locator('//div[@name="applicant.0.father_us_citizen"]//button[@data-handle="boolean-Yes"]').click()
        
    await page.locator('[name="applicant.0.mothers_first_name"]').pressSequentially('test', { delay: 100 })
    await page.waitForTimeout(2000)
    await page.locator('//div[@name="applicant.0.mother_us_citizen"]//button[@data-handle="boolean-Yes"]').click()
    await page.waitForTimeout(2000)
    await page.locator('[name="applicant.0.mothers_last_name"]').pressSequentially('test', { delay: 100 })
    await page.waitForTimeout(1000)

    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    */
    await page.waitForNavigation({waitUntil: 'load'})

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

    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})

    //await page.getByTestId('dropdown-applicant.0.occupation').selectOption('self-employed')

    const waitTimeout = async (seconds) => page.waitForTimeout(seconds);
    const locator = async (selector) => page.locator(selector).pressSequentially('test', { delay: 100 });

    async function pressAndWait(selector, timeout){
      await locator(selector);
      await waitTimeout(timeout);
    } 

    /* Esto... */
    await pressAndWait('[name="applicant.0.fathers_first_name"]', 1000);
    await pressAndWait('[name="applicant.0.fathers_last_name"]', 1000);
    /* */

    await page.waitForTimeout(2000)

    /* Es lo mismo que estas lineas */
    await page.locator('[name="applicant.0.fathers_first_name"]').pressSequentially('test', { delay: 100 })
    await page.waitForTimeout(1000)
    await page.locator('[name="applicant.0.fathers_last_name"]').pressSequentially('test', { delay: 100 })
    await page.waitForTimeout(1000)
    /* */
    await page.locator('//div[@name="applicant.0.father_us_citizen"]//button[@data-handle="boolean-Yes"]').click()
        
    await page.locator('[name="applicant.0.mothers_first_name"]').pressSequentially('test', { delay: 100 })
    await page.waitForTimeout(2000)
    await page.locator('//div[@name="applicant.0.mother_us_citizen"]//button[@data-handle="boolean-Yes"]').click()
    await page.waitForTimeout(2000)
    await page.locator('[name="applicant.0.mothers_last_name"]').pressSequentially('test', { delay: 100 })
    await page.waitForTimeout(1000)
    const marital_status = page.getByTestId('dropdown-applicant.0.marital_status');
    await marital_status.selectOption('Single')
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

    await page.getByPlaceholder('XXX-XX-XXXX').click()
    await page.waitForTimeout(1000)
    await page.keyboard.type("123456")
    await page.waitForTimeout(1000)
    await page.keyboard.press('Enter')
    await expect(next_btn).toBeEnabled()
    await page.waitForTimeout(1000)
    await next_btn.click()

    await page.waitForNavigation({waitUntil: 'load'})
    
    await page.locator('id=instructions-continue').click()
    await page.locator('input[type="file"]').nth(2).setInputFiles(path.join(__dirname, 'uploads_passport/Applicant-Photo.jpg'))
    await page.waitForTimeout(8000)
    await page.locator('id=review-continue').click()

    await page.locator('id=instructions-continue').click()
    await page.locator('input[type="file"]').nth(2).setInputFiles(path.join(__dirname, 'uploads_passport/passport.jpg'))
    await page.waitForTimeout(8000)

    const submit_post_payment = page.getByTestId("acceptFileUploadBtn")
    await submit_post_payment.click()
    await page.waitForNavigation({waitUntil: 'load'})
    const track_application = page.locator('#trackApplication')
    await expect(track_application).toBeVisible()
})