const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');
const path = require('path');
const appFunctions= require('../functions');

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
