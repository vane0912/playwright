const { test, expect } = require('@playwright/test');
const {deploy_url, Orders} = require('../urls');
const path = require('path');

test('MIN', async({browser}) => {
    const context = await browser.newContext();
    await context.clearCookies();

    const page = await context.newPage();
    await page.goto(deploy_url + 'login')

    page.on('dialog', async (dialog) => {
        await dialog.accept(Orders[0]);
    });
    await page.getByPlaceholder('1234567 or you@email.com').fill('sergio@admin.com')
    await page.getByRole("button", {name: 'Continue'}).click()
    
    await page.locator('#password_login_input').fill('testivisa5!')
    await page.locator('#log_in_button').click()

    await page.waitForURL('**/admin')
    const search_order = page.locator('//li[@onclick="searchOrderID();"]')
    await search_order.click()

    await page.getByTestId('applicant-details').click()
    await page.getByTestId('min_checkbox_first_name').first().click()
    await expect(page.locator('.popup-inner')).toBeVisible()
    await page.getByTestId('Empty field').click()
    await page.waitForTimeout(2000)
    await expect(page.getByTestId('Empty field')).toBeVisible()

    await page.locator('#close').click()    

    await page.locator('[name="change-status"]').selectOption('info_needed')
    await page.getByTestId('minModalYes').click()

    await expect(page.getByPlaceholder('Separate with , or ;')).toBeVisible()
    await expect(page.getByTestId('submitChangeStatus')).toBeEnabled()
    await page.getByTestId('submitChangeStatus').click()

    await page.waitForURL('**/admin/orders/my_orders?redirect_to_first_order=1')
})
test('Complete', async({browser}) => {
    const context = await browser.newContext();
    await context.clearCookies();

    const page = await context.newPage();
    page.on('dialog', async (dialog) => {
        await dialog.accept(Orders[1]);
    });
    await page.goto(deploy_url + 'login')
    await page.getByPlaceholder('1234567 or you@email.com').fill('david@admin.com')
    await page.getByRole("button", {name: 'Continue'}).click()

    await page.locator('#password_login_input').fill('testivisa5!')
    await page.locator('#log_in_button').click()

    await page.waitForURL('**/admin')
    const search_order = page.locator('//li[@onclick="searchOrderID();"]')
    await search_order.click()

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
test('Rejected', async({browser}) => {
    const context = await browser.newContext();
    await context.clearCookies();

    const page = await context.newPage();
    page.on('dialog', async (dialog) => {
        await dialog.accept(Orders[2]);
    });

    await page.goto(deploy_url + 'login')
    await page.getByPlaceholder('1234567 or you@email.com').fill('sergio@admin.com')
    await page.getByRole("button", {name: 'Continue'}).click()

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

