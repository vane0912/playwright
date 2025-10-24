const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');
const path = require('path');
const {translations, uk_eta_ko} = require('../functions');

let Order_num
test('Check translations UK ETA korean', async ({ page }) => {
    test.slow()
    var myDate = new Date(new Date(). getTime()+(10*24*60*60*1000));
    const datepicker_date = new Date(myDate);
    const date1 = datepicker_date.getDate();

    await page.goto(deploy_url + 'ko/united-kingdom/apply-now')
    await page.waitForTimeout(4000)

    await translations(page.locator('id=question-container'), "div", "pre_payment", uk_eta_ko)
    await translations(page.getByTestId("step-1-sidebar"), "div", "pre_payment", uk_eta_ko)
    //await translations(page, page.getByTestId("step-1-sidebar"), "div")

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
    await page.waitForURL('**/ko/united-kingdom/apply-now#step=step_3a')
    
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

    await translations(page.locator('id=main'), "h1", "pre_payment", uk_eta_ko)
    await translations(page.locator('id=main'), "span", "pre_payment", uk_eta_ko)
    await translations(page.locator('id=question-container'), "div", "pre_payment", uk_eta_ko)
  
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    
    await page.waitForURL('**/ko/united-kingdom/apply-now#step=step_3c')

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
    await translations(page.locator('id=main'), "h1", "pre_payment", uk_eta_ko)
    await translations(page.locator('id=main'), "span", "pre_payment", uk_eta_ko)
    await translations(page.locator('id=question-container'), "div", "pre_payment", uk_eta_ko)

    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()

    await page.waitForURL('**/ko/united-kingdom/apply-now#step=step_4')
    await page.waitForTimeout(5000)
    await translations(page.locator('id=main'), "h1", "pre_payment", uk_eta_ko)
    await translations(page.locator('id=main'), "span", "pre_payment", uk_eta_ko)
    await translations(page.locator('id=question-container'), "div", "pre_payment", uk_eta_ko)
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    
    await page.waitForURL('**/united-kingdom/apply-now#step=review')
    await page.waitForTimeout(2000)
    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await translations(page.locator('main'), "div", "pre_payment", uk_eta_ko)
      await page.locator('id=btnDisclaimerNext').click()
    }
    await expect(continue_sidebar).toBeEnabled()
    await translations(page.locator('id=main'), "h1", "pre_payment", uk_eta_ko)
    await translations(page.locator('id=main'), "span", "pre_payment", uk_eta_ko)
    await translations(page.locator('id=question-container'), "div", "pre_payment", uk_eta_ko)
    await continue_sidebar.click()

    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    
    await page.waitForNavigation({waitUntil: 'load'})
    await translations(page.locator('id=post-payment-sidebar'), "div", "post_payment", uk_eta_ko)
    await translations(page.locator('id=post-payment-sidebar'), "h4", "post_payment", uk_eta_ko)
    await translations(page.locator('id=post-payment-sidebar'), "h3", "post_payment", uk_eta_ko)

    await page.getByTestId("transition-page-button").click()
    Order_num = page.url().split("/")[5] 
    await page.getByPlaceholder('202 555 0173').fill('11111111')
    await page.getByTestId('boolean-WhatsApp').click()

    await translations(page.locator('id=question-container'), "div", "post_payment", uk_eta_ko)
    const next_btn = page.locator('id=btnContinueUnderSection')
    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()

    await page.waitForURL(deploy_url + "ko/order/" + Order_num + "/continue#step=residence_general")
    await translations(page.locator('id=question-container'), "div", "post_payment", uk_eta_ko)
    await page.locator('[name="general.home_address"]').fill('123')
    await page.waitForTimeout(2000)
    await page.keyboard.press("Space")
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter")
    await page.waitForTimeout(1000)
    await page.locator('//li[@data-place-id="ChIJ49W-BhhawokR4KLCF2oTVVo"]').click()
    await page.waitForTimeout(1000)
    
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    // Personal details
    await page.waitForURL(deploy_url + "ko/order/" + Order_num + "/continue#step=trav0_personal")    
    await page.waitForTimeout(2000)
    await translations(page.locator('id=question-container'), "post_payment", uk_eta_ko)
    
    //await page.getByTestId('boolean-Male').click()
    
    //await page.getByTestId("boolean-Unemployed").click()
    await page.waitForTimeout(2000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
   
    /*
    await page.waitForURL(deploy_url + "ko/order/" + Order_num + "/continue#step=trav0_work")
    
    await page.waitForTimeout(2000)
    await translations(page, page.locator('id=question-container'), "div")
    const employment = page.getByTestId("boolean-No")
    await expect(employment).toBeVisible();
    await employment.click()
    await page.waitForTimeout(1000)
    // Declarations
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForURL(deploy_url + "ko/order/" + Order_num + "/continue#step=trav0_declarations")
    await page.waitForTimeout(2000)
    await translations(page, page.locator('id=question-container'), "div")
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    */
    await page.waitForURL(deploy_url + "ko/order/" + Order_num + "/continue#step=trav0_documents")
    await translations(page.locator('id=question-container'), "div", "post_payment", uk_eta_ko)
    //File upload
    // Upload wrong file Applicant photo
    await page.locator('id=instructions-continue').click()

    // Upload Correct Photo
    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname, 'uploads_passport/2.jpg'));
    await expect(page.locator("id=document-loading")).toBeVisible()
    await page.waitForTimeout(14000)
    await expect(page.locator("id=document-loading")).toBeHidden()
    
    await translations(page.locator('id=question-container'), "div", "post_payment", uk_eta_ko)
    await page.locator('id=review-continue').click()

    // Confirm instructions appear Passport photo
    await translations(page.locator('id=question-container'), "div", "post_payment", uk_eta_ko)
    
    // Upload wrong file Passport photo
    await page.locator('id=instructions-continue').click()
    
    // Upload Correct Photo
    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname, 'uploads_passport/passport.jpg'));
    await expect(page.locator("id=document-loading")).toBeVisible()
    await page.waitForTimeout(10000)
    await expect(page.locator("id=document-loading")).toBeHidden()
    await translations(page.locator('id=question-container'), "div", "post_payment", uk_eta_ko)

    await page.locator('id=review-continue').click()
    await page.waitForURL(deploy_url + "ko/order/" + Order_num + "/continue#step=trav0_ocr_review")
    await translations(page.locator('main'), "div", "post_payment")
    await page.getByText("선택한 세부정보 사용").click()
    await translations(page.locator('id=question-container'), "div", "post_payment", uk_eta_ko)

    const request = await fetch("https://littleserver-production.up.railway.app/translations", {
    //const request = await fetch("http://localhost:3000/translations", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(uk_eta_ko),
    });
    const respose_api = await request.json()
    console.log(respose_api)
})