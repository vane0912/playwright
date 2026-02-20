const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../../urls');
const appFunctions = require('../../functions');
const selectors = require('../../selectors')
const path = require('path');

let Order_num
test('UK ETA', async({page}) => {
  await appFunctions.step_1(page,"us", "united-kingdom/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')

  await appFunctions.step_2(page,continue_sidebar)
  await page.waitForURL("**/united-kingdom/apply-now#step=step_3c")
  
  await appFunctions.step_3c(page,continue_sidebar)
  await page.waitForURL("**/united-kingdom/apply-now#step=review")

  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
    
  Order_num = page.url().split("/")[4] 
  await page.getByPlaceholder('111-222-3333').fill('11111111')
  await page.getByTestId('boolean-WhatsApp').click()
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()

  await page.waitForURL(deploy_url + "order/" + Order_num + "/continue#step=residence_general")
  await selectors.addressApi(page, 'general.home_address')
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
})