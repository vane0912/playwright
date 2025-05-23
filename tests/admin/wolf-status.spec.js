const { test, expect } = require('@playwright/test');
const {deploy_url, Orders} = require('../urls');
const path = require('path');


test('MIN', async({browser}) => {
    const request = await fetch("https://littleserver-production.up.railway.app/");
    const Order = await request.json()
    console.log(Order.Min)

    const context = await browser.newContext();
    await context.clearCookies();

    const page = await context.newPage();
    await page.goto(deploy_url + 'login')

    page.on('dialog', async (dialog) => {
        await dialog.accept(Order.Min);
    });
    await page.getByPlaceholder('1234567 or you@email.com').fill('david@admin.com')
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
    const request = await fetch("https://littleserver-production.up.railway.app/");
    const Order = await request.json()
    console.log(Order.Completed)

    const context = await browser.newContext();
    await context.clearCookies();

    const page = await context.newPage();
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
test('Cancelled', async({browser}) => {
    const request = await fetch("https://littleserver-production.up.railway.app/");
    const Order = await request.json()

    const context = await browser.newContext();
    await context.clearCookies();

    const page = await context.newPage();
    page.on('dialog', async (dialog) => {
        await dialog.accept(Order.Cancelled);
    });

    await page.goto(deploy_url + 'admin/users/27656/edit')
    await page.getByPlaceholder('1234567 or you@email.com').fill('david@admin.com')
    await page.getByRole("button", {name: 'Continue'}).click()

    await page.locator('#password_login_input').fill('testivisa5!')
    await page.locator('#log_in_button').click()

    await page.waitForURL('**/admin/users/27656/edit')
    await page.locator('[name="employee_role"]').selectOption("admin")

    await page.getByRole("button").filter({hasText: "Update user"}).click()
    await page.waitForURL('**/admin/users')

    await page.goto(deploy_url + 'admin')
    const search_order = page.locator('//li[@onclick="searchOrderID();"]')
    await search_order.click()

    await page.locator('[name="change-status"]').selectOption('cancelled')
    await page.locator("select").filter({hasText: "Select reason:"}).selectOption("trip_cancelled")
    await expect(page.getByPlaceholder('Separate with , or ;')).toBeVisible()
    await expect(page.getByTestId('submitChangeStatus')).toBeEnabled()
    await page.getByTestId('submitChangeStatus').click()

    await page.waitForURL('**/admin/orders/my_orders?redirect_to_first_order=1')
})
