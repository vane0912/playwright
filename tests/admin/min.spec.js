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
    //await page.locator("id=customCookieBotAcceptAll").click()
    
    await page.locator('#password_login_input').fill('testivisa5!')
    await page.locator('#log_in_button').click()

    await page.waitForURL('**/admin')
    const search_order = page.locator('//li[@onclick="searchOrderID();"]')
    await search_order.click()

    await page.getByTestId('applicant-details').click()
    await page.getByTestId('min_checkbox_first_name').first().click()
    await expect(page.locator('.popup-inner')).toBeVisible()
    await page.getByTestId('Non-English characters').click()
    await page.waitForTimeout(2000)
    await expect(page.getByTestId('Non-English characters')).toBeVisible()

    await page.locator('#close').click()    
    
    await page.locator('[name="change-status"]').selectOption('info_needed')
    await page.getByTestId('minModalYes').click()

    await expect(page.getByPlaceholder('Separate with , or ;')).toBeVisible()
    await expect(page.getByTestId('submitChangeStatus')).toBeEnabled()
    await page.getByTestId('submitChangeStatus').click()

    await page.waitForURL('**/admin/orders/my_orders?redirect_to_first_order=1')
})