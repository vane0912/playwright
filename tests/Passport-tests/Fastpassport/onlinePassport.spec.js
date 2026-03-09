const { test, expect } = require('@playwright/test');
const { chromium } = require('playwright');
const {general_url, deploy_url} = require('../../urls');
const appFunctions = require('../../functions')
const passportSteps = require('../../Functions/passport')
const selectors = require('../../selectors')
const percySnapshot = require('@percy/playwright');
const path = require('path');
const fs = require('fs');
let fastpassportEmail = "automations20@fastpassport.com"
const authPath = path.resolve(__dirname, '../cookies/userPassport.json');

test.describe.configure({ mode: 'serial' });
test.beforeAll('Fastpassport - Account creation, logging and password creation', async () => {
  test.slow()
  const browser = await chromium.launch();
  const context = await browser.newContext()
  const page = await context.newPage();
  const dir = path.dirname(authPath);
  await fs.promises.mkdir(dir, { recursive: true });
  await page.goto(general_url + 'fastpassport.visachinaonline.com/passport-renewal/united-states')
  await page.waitForTimeout(3000)
  await percySnapshot(page, 'fastPassportHomepage')
  await page.getByRole('button').getByText('Start your renewal').click()
  await page.waitForURL('**/passport-renewal/united-states/application#step=step_1')
  await page.waitForTimeout(3000)
  await percySnapshot(page, 'fastPassportStep1')
  const continue_sidebar = page.locator('#btnContinueSidebar')
  await continue_sidebar.click()
  await passportSteps.step_1_passport(page, fastpassportEmail)
  await continue_sidebar.click()
  await passportSteps.step_3_passport(page)
  await continue_sidebar.click()
  await page.waitForTimeout(3000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  await appFunctions.newPaymentCheckout(page, "4111111111111111", "123", false)
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  await expect(page.locator("id=save-and-exit-button")).toBeEnabled()
  await page.locator("id=save-and-exit-button").click()
  await page.getByTestId('confirmExitModalBtn').click()
  await page.waitForURL('**/account')
  await page.locator("id=loggedInUserContainer").click()
  await page.getByRole("menu").getByText('My account').click()
  await page.waitForURL('**/account/settings')
  await page.getByTestId('Security & Privacy').click()
  await page.locator('id=new_password').fill('testivisa5!')
  await page.locator('id=password_repeat').fill('testivisa5!')
  await page.getByTestId("updatePasswordBtn").click()
  await page.locator("id=loggedInUserContainer").click()
  await page.locator("id=btnLogout").click()
  await page.locator("id=loginBtn").click()
  await page.waitForURL(deploy_url + 'login')
  await page.locator("id=email_login_input").fill(fastpassportEmail)
  await page.locator("id=continue_button").click()
  await page.locator("id=password_login_input").fill("testivisa5!")
  await page.locator("id=log_in_button").click()
  await page.waitForNavigation()
  await expect(page.locator("id=loggedInUserContainer")).toBeVisible()
  await context.storageState({ path: authPath });
  
})

test('FastPassport - Online Passport', async({page, context}) =>{
  test.slow()
  const cookiesData = await fs.promises.readFile('../cookies/userPassport.json', 'utf-8');
  const cookies = JSON.parse(cookiesData);
  await context.addCookies(cookies.cookies);
  await page.goto(general_url + 'fastpassport.visachinaonline.com/passport-renewal/united-states')
  await page.reload()
  await page.getByRole('button').getByText('Start your renewal').click()
  await page.waitForURL('**/passport-renewal/united-states/application#step=step_1')
  const continue_sidebar = page.locator('#btnContinueSidebar')
  await continue_sidebar.click()
  await passportSteps.step_1_passport(page)
  await continue_sidebar.click()
  await passportSteps.step_3_passport(page)
  await continue_sidebar.click()

  await page.waitForTimeout(3000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  await page.getByText('Standard Service', { exact: true }).click()
  await page.waitForURL('**/passport-renewal/united-states/application#step=review')
  await appFunctions.newPaymentCheckout(page,"4111111111111111", "123", false)
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  
  // Post Payment
  await page.waitForNavigation({waitUntil: 'load'})
  await page.getByTestId("transition-page-button").click()
  await selectors.phoneNumber(page)
  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  let Order_num = page.url().split("/")[4] 
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(general_url + 'fastpassport.visachinaonline.com/order/' + Order_num + '/continue#step=general_after_payment')
  await selectors.dropdownSelector(page, "applicant.0.state_of_birth", "dropdown-applicant.0.state_of_birth", 'alaska', 'AK - ALASKA')
  await selectors.inputText(page,'applicant.0.birth_city', "test")
  await selectors.dropdownSelector(page, "applicant.0.appearance_1", "dropdown-applicant.0.appearance_1", 'amber', 'Amber')
  await selectors.dropdownOptions(page, "dropdown-applicant.0.appearence_2", "Brown")
  await page.locator("id=feet-applicant.0.height_fsr").fill('5')
  await page.locator("id=inches-applicant.0.height_fsr").fill('5')
  await selectors.dropdownOptions(page, "dropdown-applicant.0.occupation", "self-employed")
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  await page.waitForURL(general_url + 'fastpassport.visachinaonline.com/order/' + Order_num + '/continue#step=trav0_ssn_number')
  await page.locator('[name="applicant.0.ssn"]').click()
  await page.waitForTimeout(1000)
  await page.keyboard.type("123456")
  await page.waitForTimeout(1000)
  await page.keyboard.press('Enter')
  await expect(next_btn).toBeEnabled()
  await page.waitForTimeout(1000)
  await next_btn.click()
  await page.waitForURL(general_url + 'fastpassport.visachinaonline.com/order/' + Order_num + '/continue#step=trav0_documents')
  await selectors.applicantPhoto(page)
  await selectors.passportPhoto(page)
  await selectors.datePicker(page, "applicant.0.passport_issued_date", "13", "7", "2012")
  await selectors.datePicker(page, "applicant.0.passport_expiration_date", "13", "7", "2023")
  await page.locator('[name="applicant.0.passport_num"]').fill('111111111')
  const submit_post_payment = page.locator("id=btnSubmitApplication")
  await submit_post_payment.click()
  await page.waitForNavigation({waitUntil: 'load'})
  const track_application = page.locator('#trackApplication')
  await expect(track_application).toBeVisible()
})

test('FastPassport - USPS Emergency', async({page, context}) => {
  test.slow()
  const cookiesData = await fs.promises.readFile('../cookies/userPassport.json', 'utf-8');
  const cookies = JSON.parse(cookiesData);
  await context.addCookies(cookies.cookies);
  await page.goto(general_url + 'fastpassport.visachinaonline.com/passport-renewal/united-states')
  await page.reload()
  await page.getByRole('button').getByText('Start your renewal').click()
  await page.waitForURL('**/passport-renewal/united-states/application#step=step_1')
  const continue_sidebar = page.locator('#btnContinueSidebar')
  await continue_sidebar.click()
  await passportSteps.step_1_passport(page)
  await continue_sidebar.click()
  await passportSteps.step_3_passport(page)
  await continue_sidebar.click()

  await page.waitForTimeout(3000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  await page.getByText("Emergency Service", {exact: true}).click()
  await page.waitForURL('**/passport-renewal/united-states/application#step=review')
  await appFunctions.newPaymentCheckout(page,"4111111111111111", "123", false)
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

  await selectors.booleanOptions(page, "applicant.0.father_information", "boolean-No")
  await selectors.booleanOptions(page, "applicant.0.mother_information", "boolean-No")

  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.locator('[name="applicant.0.ssn"]').click()
  await page.waitForTimeout(1000)
  await page.keyboard.type("123456")
  await page.waitForTimeout(1000)
  await page.keyboard.press('Enter')
  await expect(next_btn).toBeEnabled()
  await page.waitForTimeout(1000)
  await next_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
  await selectors.applicantPhoto(page)
  await selectors.passportPhoto(page)
  await selectors.datePicker(page, "applicant.0.passport_issued_date", "13", "7", "2012")
  await selectors.datePicker(page, "applicant.0.passport_expiration_date", "13", "7", "2023")
  await page.locator('[name="applicant.0.passport_num"]').fill('111111111')
  const submit_post_payment = page.locator("id=btnSubmitApplication")
  await submit_post_payment.click()
  await page.waitForNavigation({waitUntil: 'load'})
  const track_application = page.locator('#trackApplication')
  await expect(track_application).toBeVisible()

})