const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');
const percySnapshot = require('@percy/playwright');
const path = require('path');

let Order_num
test('File upload checker', async({page}) => {
    test.slow()
    var myDate = new Date(new Date(). getTime()+(10*24*60*60*1000));
    const datepicker_date = new Date(myDate);
    const date1 = datepicker_date.getDate();

    await page.goto(deploy_url + 'india/apply-now')
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
    await page.waitForURL('**/india/apply-now#step=step_3a')
  
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
    await page.waitForURL('**/india/apply-now#step=step_3c')

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
    
    const dropdown_country = page.locator('[name="applicant.0.port_of_arrival"]');
    await expect(dropdown_country).toBeVisible();
    await dropdown_country.click();
    const input_country = page.getByTestId('dropdown-applicant.0.port_of_arrival');

    await expect(input_country).toBeVisible();
    await input_country.fill('Ahmedabad Airport - Ahmedabad - AMD');
    await page.locator('//div[@value="Ahmedabad Airport - Ahmedabad - AMD"]').click()

    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/india/apply-now#step=step_4')

    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/india/apply-now#step=review')
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
    await page.getByTestId("transition-page-button").click()
    Order_num = page.url().split("/")[4] 

    await page.getByPlaceholder('111-222-3333').fill('11111111')
    await page.getByTestId('boolean-WhatsApp').click()
    /*
    const arrival_date_visible = page.locator('[name="general.arrival_date"]')
    await expect(arrival_date_visible).toBeVisible()
    await arrival_date_visible.click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
    await page.locator('.dp--future').filter({hasText: date1}).first().click()
    */
    const religion = page.locator('[name="general.religion"]');
    
    await expect(religion).toBeVisible();
    await religion.click()
    const input_religion = page.getByTestId('dropdown-general.religion');
    //await expect(input_religion).toBeVisible();
    await input_religion.fill('bahai');
    await page.getByRole("option", {name: 'Bahai'}).click()
    await page.waitForTimeout(1000)
    
    // File upload step
    const next_btn = page.locator('id=btnContinueUnderSection')
    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_personal")    
    await page.waitForTimeout(2000)
    await page.getByTestId('boolean-Male').click()
    //await page.locator('[name="applicant.0.birth_city"]').fill('aaaaaaaaa')

    await page.getByTestId('boolean-Married').click()
    
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_residency_information_after_payment")
    
    await page.getByPlaceholder('1234 Sesame St. Apt. 3, Springtown, IL 55555').fill('123')
    await page.waitForTimeout(2000)
    await page.keyboard.press("Space")
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter")
    await page.waitForTimeout(1000)
    await page.locator('//li[@data-place-id="ChIJ49W-BhhawokR4KLCF2oTVVo"]').click()

    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_work")

    await page.waitForTimeout(2000)
    /*
    const employment = page.locator('[name="applicant.0.occupation"]');
    await expect(employment).toBeVisible();
    await employment.click()
    const input_employment = page.getByTestId('dropdown-applicant.0.occupation');
    await expect(input_employment).toBeVisible();
    await input_employment.fill('retired');
    await page.getByRole("option", {name: 'Retired'}).click()
    */
    await page.getByTestId("boolean-Retired").click()
    await page.waitForTimeout(1000)

    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_family")
    /*
    await page.locator('[name="applicant.0.fathers_name"]').fill("test")
    await page.locator('[name="applicant.0.mothers_name"]').fill("test")
    */
    await page.waitForTimeout(3000)
    await page.locator('[name="applicant.0.spouse_first_last_name"]').fill("test")
    await page.waitForTimeout(3000)
    await page.getByTestId("boolean-No, I don’t have information about either").click()
    await page.waitForTimeout(2000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_documents")

    // Confirm instructions appear Applicant photo
    await expect(page.locator("id=document-step")).toContainText("Test Test", "Upload your photo", "Face the camera straight on with a plain background.", "No angles or head tilts ", "No glasses, hats, or scarves", "No glasses, hats, or scarves")
    
    // Upload wrong file Applicant photo
    await page.locator('id=instructions-continue').click()
    /*
    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname, 'uploads_passport/Error_1.png'));
    await expect(page.locator("id=document-loading")).toBeVisible()
    await page.waitForTimeout(14000)
    await expect(page.locator("id=document-loading")).toBeHidden()
    await expect(page.locator("id=document-step")).toContainText("Let's try that again", " The photo must be clear and in focus", " Don't wear a hat", " Don't wear glasses", "Watch tutorial")
    await percySnapshot(page, 'Error Applicant');
    await page.getByTestId("acceptFileUploadBtn").click()
    */
    // Upload Correct Photo
    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname, 'uploads_passport/Applicant-Photo.jpg'));
    await expect(page.locator("id=document-loading")).toBeVisible()
    await page.waitForTimeout(14000)
    await expect(page.locator("id=document-loading")).toBeHidden()
    await expect(page.locator("id=document-step")).toContainText("Your upload passed our initial review!", "One of our experts will do a final review to ensure it meets all requirements. If it doesn't, we’ll contact you. ", "Don't like it? ", "You can take a new one")
    await percySnapshot(page, 'Ap Correct');
    await page.locator('id=review-continue').click()

    // Confirm instructions appear Passport photo
    await expect(page.locator("id=document-step")).toContainText("Show the full page, including the code at the bottom", "Keep the page flat, not bent or at an angle", "All text must be clear, with no glare, shadows, or fingers")
    
    // Upload wrong file Passport photo
    
    await page.locator('id=instructions-continue').click()
    /*
    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname, 'uploads_passport/Error_2.png'));
    await expect(page.locator("id=document-loading")).toBeVisible()
    await page.waitForTimeout(10000)
    await expect(page.locator("id=document-loading")).toBeHidden()
    await expect(page.locator("id=document-step")).toContainText("Let's try that again", "Upload the full page with your name and photo. It must be clear and easy to read")
    await percySnapshot(page, 'Passport ER');
    await page.getByTestId("acceptFileUploadBtn").click()
    */
    // Upload Correct Photo
    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname, 'uploads_passport/passport.jpg'));
    await expect(page.locator("id=document-loading")).toBeVisible()
    await page.waitForTimeout(10000)
    await expect(page.locator("id=document-loading")).toBeHidden()
    await expect(page.locator("id=document-step")).toContainText("Your upload passed our initial review!", "One of our experts will do a final review to ensure it meets all requirements. If it doesn't, we’ll contact you. ", "Don't like it? ", "You can take a new one")
    await percySnapshot(page, 'Good photo Psprt');
    await page.locator('id=review-continue').click()
})