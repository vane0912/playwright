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
  
    const arrival_date_visible = page.locator('[name="general.arrival_date"]')
    await expect(arrival_date_visible).toBeVisible()
    await arrival_date_visible.click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  
    await page.locator('.dp--future').filter({hasText: date1}).first().click()

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
    
    // File upload step
    const next_btn = page.locator('id=btnContinueUnderSection')
    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_documents")
    // Confirm instructions appear Applicant photo
    await expect(page.locator("id=document-step")).toContainText("Applicant's photo", "Let's upload your photo", "Face the camera straight on with a plain background.", "No glasses, hats, or scarves", "No smiling.", "It must be different")
    
    // Upload wrong file Applicant photo
    await page.locator('id=instructions-continue').click()

    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname, 'uploads_passport/Error_1.png'));
    await expect(page.locator("id=document-loading")).toBeVisible()
    await page.waitForTimeout(14000)
    await expect(page.locator("id=document-loading")).toBeHidden()
    await expect(page.locator("id=document-step")).toContainText("Let's try that again", " The photo must be clear and in focus", " Don't wear a hat", " Don't wear glasses", "Watch tutorial")
    await percySnapshot(page, 'Error Applicant');
    await page.getByTestId("acceptFileUploadBtn").click()

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
    await expect(page.locator("id=document-step")).toContainText("Passport page", "Upload your passport", "Upload a copy of the passport page showing your photo, name, and date of birth.", "If you have a U.S. passport, include the signature page as well.", "The document must be in color with good lighting—no glares or shadows.", "All page corners must be visible with no objects covering any information.")
    
    // Upload wrong file Passport photo
    await page.locator('id=instructions-continue').click()
    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname, 'uploads_passport/Error_2.png'));
    await expect(page.locator("id=document-loading")).toBeVisible()
    await page.waitForTimeout(10000)
    await expect(page.locator("id=document-loading")).toBeHidden()
    await expect(page.locator("id=document-step")).toContainText("Let's try that again", "Upload the full page with your name and photo. It must be clear and easy to read")
    await percySnapshot(page, 'Passport ER');
    await page.getByTestId("acceptFileUploadBtn").click()
    
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