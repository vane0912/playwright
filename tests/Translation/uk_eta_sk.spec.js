const { test, expect, selectors } = require('@playwright/test');
const {deploy_url} = require('../urls');
const path = require('path');
const appFunctions= require('../functions');
const selectors = require('../selectors.js')

let Order_num
let languages = ['pt', 'de', 'fr', 'it', 'es', 'tr', 'ru']
test('Check pre-payment translations UK ETA korean', async ({ page }) => {
    test.slow()
    for (let i = 0; i < languages.length; i++){
        await page.goto(deploy_url + languages[i] + '/united-kingdom/apply-now')
        await page.waitForTimeout(4000)
        await appFunctions.translations(page.getByTestId("step-1-sidebar"), "pre_payment", appFunctions.uk_eta, languages[i])
        await appFunctions.translations(page.locator("id=question-container"), "pre_payment", appFunctions.uk_eta, languages[i])
        await appFunctions.translations(page.locator("h1"), "pre_payment", appFunctions.uk_eta, languages[i])
        
        const continue_sidebar = page.locator('id=btnContinueSidebar')
        await continue_sidebar.click()
        await page.waitForURL('**/' + languages[i] + '/united-kingdom/apply-now#step=step_3a')
        await appFunctions.translations(page.locator("h1"), "pre_payment", appFunctions.uk_eta, languages[i])
        await appFunctions.translations(page.getByTestId("span"), "pre_payment", appFunctions.uk_eta, languages[i])
        await appFunctions.translations(page.locator("id=question-container"), "pre_payment", appFunctions.uk_eta, languages[i])
        
        await appFunctions.step_2(page, continue_sidebar)
        await page.waitForURL('**/' + languages[i] + '/united-kingdom/apply-now#step=step_3c')
        await appFunctions.translations(page.locator("id=question-container"), "pre_payment", appFunctions.uk_eta, languages[i])
        await appFunctions.step_3c(page,continue_sidebar)

        await page.waitForURL('**/' + languages[i] + '/united-kingdom/apply-now#step=review') 
        await page.waitForTimeout(5000)
        await appFunctions.translations(page.locator("id=question-container"), "pre_payment", appFunctions.uk_eta, languages[i])
    }
    await appFunctions.newPaymentCheckout(page, "4111 1111 1111 1111", "123")
    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})
    await page.getByTestId("transition-page-button").click()
    await selectors.phoneNumber(page)
    const next_btn = page.locator('id=btnContinueUnderSection')
    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()

    await page.waitForTimeout(2000)
    await sele

    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=residence_general")
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
    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_personal")    
    await page.waitForTimeout(2000)
    
    await page.getByTestId("boolean-Unemployed").click()
    await page.waitForTimeout(2000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()

    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_documents")
    
    await page.locator('id=instructions-continue').click()
    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname, '..' ,'uploads_passport/2.jpg'));
    await expect(page.locator("id=document-loading")).toBeVisible()
    await page.waitForTimeout(14000)
    await expect(page.locator("id=document-loading")).toBeHidden()
    await page.locator('id=review-continue').click()
    // Confirm instructions appear Passport photo
    // Upload wrong file Passport photo
    await page.locator('id=instructions-continue').click()
    
    // Upload Correct Photo
    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname, '..' ,'uploads_passport/passport.jpg'));
    await expect(page.locator("id=document-loading")).toBeVisible()
    await page.waitForTimeout(10000)
    await expect(page.locator("id=document-loading")).toBeHidden()
    await page.locator('id=review-continue').click()
    await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=trav0_ocr_review")
    await page.getByText("Use selected details").click()
    const submit_post_payment = page.locator('id=btnSubmitApplication')
    await expect(submit_post_payment).toBeEnabled()
    await submit_post_payment.click()
    await page.waitForURL(deploy_url + "order-received-page/" + Order_num)
    await page.waitForTimeout(4000)
    const skip_recomendation = await page.locator('id=skip-recommendation-button').isVisible()
    if(skip_recomendation){
      await page.locator('id=skip-recommendation-button').click()    
    }
    
    await page.locator('id=trackApplication').click()
    
    await page.waitForURL(deploy_url + "order/" + Order_num)
    const request = await fetch("http://localhost:5678/webhook-test/translations", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(appFunctions.uk_eta),
    });
    const respose_api = await request.json()
    console.log(respose_api)
})
