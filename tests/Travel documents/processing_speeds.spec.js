const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');
const percySnapshot = require('@percy/playwright');
const appFunctions = require('../functions')

test.skip('Processing speeds appear and work', async({page}) => {
    var myDate = new Date(new Date().getTime() + (11 * 24 * 60 * 60 * 1000));
    const datepicker_date = new Date(myDate);
    const date1 = datepicker_date.getDate();

    await page.goto(deploy_url + 'india/apply-now')

    const continue_sidebar = page.locator('id=btnContinueSidebar')
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    
    //await page.waitForURL('**/india/apply-now#step=step_2')
    /*
    const arrival_date_visible = page.locator('[name="general.arrival_date"]')
    await expect(arrival_date_visible).toBeVisible()
    await arrival_date_visible.click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  
    await page.locator('.dp--future').filter({hasText: date1}).first().click()
    
    //const continue_sidebar = page.locator('id=btnContinueSidebar')
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    */
    await appFunctions.step_2(page,continue_sidebar, "**/india/apply-now#step=step_3c")

    await appFunctions.step_3c(page,continue_sidebar)
    /*
    const dropdown_country = page.locator('[name="applicant.0.port_of_arrival"]');
    await expect(dropdown_country).toBeVisible();
    await dropdown_country.click();
    const input_country = page.getByTestId('dropdown-applicant.0.port_of_arrival');

    await expect(input_country).toBeVisible();
    await input_country.fill('Ahmedabad Airport - Ahmedabad - AMD');
    await page.locator('//div[@value="Ahmedabad Airport - Ahmedabad - AMD"]').click()
    */
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/india/apply-now#step=step_4')

    const standard = page.getByTestId('processing-standard')
    const rush = page.getByTestId('processing-rush')
    const super_rush = page.getByTestId('processing-super_rush')
    await expect(standard).toBeVisible()
    await expect(rush).toBeVisible()
    await expect(super_rush).toBeVisible()

    await standard.click()
    await page.waitForTimeout(3000)
    const sidebar_step_2 = page.getByTestId('sidebar-summary-breakdown')
    let sidebar_validations = ['India Tourist eVisa', '1 Traveler', 'Government fees', '$25.64', 'Standard, 5 days', '$95.99']
    sidebar_validations.forEach(async txt => await expect(sidebar_step_2).toContainText(txt))
    const correct_total = page.getByTestId('order-total')
    await expect(correct_total).toHaveText('$121.99')

    await rush.click()
    await page.waitForTimeout(3000)
    await expect(continue_sidebar).toBeEnabled()

    sidebar_validations = ['India Tourist eVisa', '1 Traveler', 'Government fees', '$25.64', 'Rush, 4 days', '$115.99']
    sidebar_validations.forEach(async txt => await expect(sidebar_step_2).toContainText(txt))
    await expect(correct_total).toHaveText('$141.99')

    await super_rush.click()
    await page.waitForTimeout(3000)
    await expect(continue_sidebar).toBeEnabled()

    sidebar_validations = ['India Tourist eVisa', '1 Traveler', 'Government fees', '$25.64', 'Super Rush, 3 days', '$175.99']
    sidebar_validations.forEach(async txt => await expect(sidebar_step_2).toContainText(txt))
    await expect(correct_total).toHaveText('$201.99')
    await page.waitForTimeout(3000)
    await percySnapshot(page, 'Processing speeds design');
})