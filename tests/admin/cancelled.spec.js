const { test, expect } = require('@playwright/test');
const {deploy_url, Orders} = require('../urls');
const path = require('path');


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
    await page.getByPlaceholder('1234567 or you@email.com').fill('sergio@admin.com')
    await page.getByRole("button", {name: 'Continue'}).click()

    await page.locator('#password_login_input').fill('testivisa5!')
    await page.locator('#log_in_button').click()

    await page.waitForURL('**/admin/users/27656/edit')
    await page.locator('[name="employee_role"]').selectOption("admin")
    await page.getByText("Update user").click()
    await page.waitForTimeout(5000)
    await page.waitForURL('**/admin/users')

    await page.goto(deploy_url + 'admin')
    const search_order = page.locator('//li[@onclick="searchOrderID();"]')
    await search_order.click()


    await page.getByTestId("dl-manage-order-title").click()
    await page.locator('[name="change-status"]').selectOption('cancelled')
    await page.locator("select").filter({hasText: "Select reason:"}).selectOption("trip_cancelled")
    await expect(page.getByPlaceholder('Separate with , or ;')).toBeVisible()
    await expect(page.getByTestId('submitChangeStatus')).toBeEnabled()
    await page.getByTestId('submitChangeStatus').click()

    await page.waitForURL('**/admin/orders/my_orders?redirect_to_first_order=1')
})