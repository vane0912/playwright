const { test, expect } = require('@playwright/test');
const {deploy_url, Orders} = require('../urls');
const path = require('path');

test('Rejected', async({browser}) => {
    const request = await fetch("https://littleserver-production.up.railway.app/");
    const Order = await request.json()
    console.log(Order.Rejected)

    const context = await browser.newContext();
    await context.clearCookies();

    const page = await context.newPage();
    page.on('dialog', async (dialog) => {
        await dialog.accept(Order.Rejected);
    });

    await page.goto(deploy_url + 'login')
    await page.getByPlaceholder('1234567 or you@email.com').fill('david@admin.com')
    await page.getByRole("button", {name: 'Continue'}).click()
    await page.locator("id=customCookieBotAcceptAll").click()

    await page.locator('#password_login_input').fill('testivisa5!')
    await page.locator('#log_in_button').click()

    await page.waitForURL('**/admin')
    const search_order = page.locator('//li[@onclick="searchOrderID();"]')
    await search_order.click()

    await page.getByTestId('applicant-details').click()
    await page.getByTestId('show-docs-applicant-0').click()
    await page.getByTestId('upload-docs-0').selectOption('reject_letter')

    await page.getByTestId('deliverable-upload-applicant-0').setInputFiles(path.join(__dirname, 'uploads/deliverable.jpg'))
    await expect(page.getByTestId('save-uploaded-docs-0')).toBeEnabled()

    await page.getByTestId('save-uploaded-docs-0').click()
    
    await page.waitForTimeout(10000)
    await expect(page.locator('.upload-input-wrap')).toBeVisible()
    await expect(page.getByTestId('order-status')).toHaveText('Rejected by Gov')
})