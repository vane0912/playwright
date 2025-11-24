const { test, expect, devices } = require('@playwright/test');
const { deploy_url } = require('../urls');

const iPhone13 = devices['iPhone 13'];

test.use({
  ...iPhone13,
});
test('Processing speeds appear and work for mobile', async({page}) => {
    var myDate = new Date(new Date(). getTime() + (11 * 24 * 60 * 60 * 1000));
    const datepicker_date = new Date(myDate);
    const date1 = datepicker_date.getDate();

    await page.goto(deploy_url + 'india/apply-now')
    const continue_sidebar = page.locator('id=btnContinueUnderSectionMobile')
    /*
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    */
    //await page.waitForURL('**/india/apply-now#step=step_2')
    /*
    const arrival_date_visible = page.locator('[name="general.arrival_date"]')
    await expect(arrival_date_visible).toBeVisible()
    await arrival_date_visible.click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
    //await page.locator('[data-dp-element="action-next"]').click()
    await page.locator('.dp--future').filter({hasText: date1}).first().click()
    */
    
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/india/apply-now#step=step_3a')
  
    await page.waitForTimeout(1000)
    const dob_day = page.locator('[name="applicant.0.dob.day"]')
    await dob_day.selectOption('13')
    const dob_month = page.locator('[name="applicant.0.dob.month"]')
    await dob_month.selectOption('7')
    const dob_year = page.locator('[name="applicant.0.dob.year"]')
    await dob_year.selectOption('2000')
    const name_applicant = page.locator('[name="applicant.0.first_name"]')
    await expect(name_applicant).toBeVisible()
    await name_applicant.fill('Test')

    await page.waitForTimeout(1000)
    const last_name = page.locator('[name="applicant.0.last_name"]')
    await last_name.fill('Test')
    await page.waitForTimeout(1000)

  
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/india/apply-now#step=step_3c')

    const passport_num = page.locator('[name="applicant.0.passport_num"]')
    await expect(passport_num).toBeVisible()
    await passport_num.fill('123456789')
    const passport_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
    await passport_day.selectOption('13')
    const passport_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
    await passport_month.selectOption('7')
    const passport_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
    await passport_year.selectOption('2030')
    await page.waitForTimeout(4000)
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
})