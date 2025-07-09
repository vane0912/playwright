const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');
const path = require('path');


test('Complete and CMM', async ({ browser }) => {
    const request = await fetch("https://littleserver-production.up.railway.app/");
    const Order = await request.json()
    console.log(Order.Completed)

    const context1 = await browser.newContext();
    await context1.clearCookies();

    const page = await context1.newPage();
    page.on('dialog', async (dialog) => {
        await dialog.accept(Order.Completed);
    });
    await page.goto(deploy_url + 'login')
    await page.getByPlaceholder('1234567 or you@email.com').fill('david@admin.com')
    await page.getByRole("button", {name: 'Continue'}).click()

    await page.locator('#password_login_input').fill('testivisa5!')
    await page.locator('#log_in_button').click()

    await page.waitForURL('**/admin')
    const search_order = page.locator('//li[@onclick="searchOrderID();"]')
    await search_order.click()

    await page.getByTestId("dropdown-other-actions").selectOption("additional_payment")
    await page.getByTestId("dropdown-charge-type").selectOption("visa_cost")
    await page.locator('[name="amount"]').fill("10")
    await page.getByTestId("dropdown-charge-reason").selectOption("visa_type_change")
    await page.waitForTimeout(3000)
    await page.locator("id=submitChargeButton").click()
    await page.waitForURL('**/admin/order_items/' + Order.Completed + '/edit')

    const context = await browser.newContext({
        httpCredentials: {
          username: 'admin',
          password: 'testivisa5!',
        },
    });
    await context.clearCookies();
    const email = await context.newPage();
    await email.goto(deploy_url + 'mail')
    await email.getByText("Payment required for your Turkey eVisa (Order#" + Order.Completed + ")").first().click()

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