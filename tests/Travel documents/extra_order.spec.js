const { test, expect } = require('@playwright/test');
const appFunctions = require('../functions')
const path = require('path');
const {general_url} = require('../urls');

test('Extra Order', async ({ page, browser }) => {
  test.slow()
  await appFunctions.step_1(page,"mx", "turkey/apply-now")
  const continue_sidebar = page.locator('id=btnContinueSidebar')

  await appFunctions.step_2(page,continue_sidebar)
  await page.waitForURL("**/turkey/apply-now#step=step_3c")
  
  await appFunctions.step_3c(page,continue_sidebar)
  await page.waitForURL("**/turkey/apply-now#step=review")

  await appFunctions.newPaymentCheckout(page, '6011 1111 1111 1117', '123')
  const payment_btn = page.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()  
  await page.waitForNavigation({waitUntil: 'load'})
  await page.waitForTimeout(1000)
  await page.getByTestId("transition-page-button").click()
  let Order_num = page.url().split("/")[4];

  await page.getByPlaceholder('111-222-3333').fill('11111111')
  await page.getByTestId('boolean-WhatsApp').click()
  
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()

  const next_btn = page.locator('id=btnContinueUnderSection')
  await page.waitForTimeout(1000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()
  
  await page.waitForTimeout(3000)
  await expect(next_btn).toBeEnabled()
  await next_btn.click()

  await page.waitForNavigation({waitUntil: 'load'})
  const passport_issue_day = page.locator('[name="applicant.0.passport_issued_date.day"]')
  await passport_issue_day.selectOption('13')
  await page.waitForTimeout(1000)

  const passport_issue_month = page.locator('[name="applicant.0.passport_issued_date.month"]')
  await passport_issue_month.selectOption('7')
  await page.waitForTimeout(1000)
  const passport_issue_year = page.locator('[name="applicant.0.passport_issued_date.year"]')
  await passport_issue_year.selectOption('2020')
  await page.waitForTimeout(1000)

  const submit_post_payment = page.locator('id=btnSubmitApplication')
  await expect(submit_post_payment).toBeEnabled()
  await submit_post_payment.click()
  await page.waitForNavigation({waitUntil: 'load'})

  await page.goto(general_url + 'admin.visachinaonline.com/login')
  await page.getByPlaceholder('1234567 or you@email.com').fill('david@admin.com')
  await page.getByRole("button", {name: 'Continue'}).click()
  
  await page.locator('#password_login_input').fill('testivisa5!')
  await page.locator('#log_in_button').click()
  await page.waitForURL(general_url + 'admin.visachinaonline.com/admin')
  await page.waitForTimeout(3000)
  page.on('dialog', async (dialog) => {
      await dialog.accept(Order_num);
  });
  const search_order = page.locator('//li[@onclick="searchOrderID();"]');
  await search_order.click()
  await page.getByTestId("dropdown-other-actions").selectOption("additional_payment")
  await page.getByTestId("dropdown-charge-type").selectOption("visa_cost")
  await page.locator('[name="amount"]').fill("10")
  await page.getByTestId("dropdown-charge-reason").selectOption("visa_type_change")
  await page.waitForTimeout(3000)
  await page.locator("id=submitChargeButton").click()
  await page.waitForNavigation()
  const context = await browser.newContext({
      httpCredentials: {
        username: 'admin',
        password: 'testivisa5!',
      },
  });
  await context.clearCookies();
  const email = await context.newPage();
  await email.goto(general_url + 'visachinaonline.com/mail')
  await email.getByText("Payment required for your Turkey eVisa (Order#" + Order_num + ")").first().click()
  const iframe = email.frameLocator('iframe');
  const [newTab] = await Promise.all([
    email.context().waitForEvent('page'),
    iframe.getByText('Pay now').click(),
  ]);
  await newTab.waitForLoadState()
  await expect(newTab.getByText("Additional charge approved.")).toBeVisible()
  await page.getByRole('button', { name: 'OK' }).click()
  await page.getByTestId('applicant-details').click()
  await page.getByTestId('show-docs-applicant-0').click()
  await page.getByTestId('upload-docs-0').selectOption('visa')
  await page.getByTestId('deliverable-upload-applicant-0').setInputFiles(path.join(__dirname, 'uploads/deliverable.jpg'))
  await expect(page.getByTestId('save-uploaded-docs-0')).toBeEnabled()
  await page.getByTestId('save-uploaded-docs-0').click()
  await page.waitForTimeout(10000)
  await expect(page.locator('.upload-input-wrap')).toBeVisible()
  await expect(page.getByTestId('order-status')).toHaveText('Complete')
})