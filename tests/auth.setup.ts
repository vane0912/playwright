import { test as setup, expect } from '@playwright/test';
import {deploy_url, email_test} from './urls'
import fs from 'fs';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
  if(!fs.existsSync(authFile)){
    await page.goto(deploy_url + 'turkey/apply-now');
    const dropdown_country =  page.getByTestId('filter-value');

    await expect(dropdown_country).toBeVisible();
    await dropdown_country.click();
    const input_country = page.getByTestId('dropdown-general.common_nationality_country');

    await expect(input_country).toBeVisible();
    await input_country.fill('Mexico');
    await page.waitForTimeout(1000)
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(1000)
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000)
    const selector_products = page.getByTestId('dropdown-general.visa_type_id');
    await selector_products.selectOption('38')

    const arrival_date_visible = page.locator('[name="general.arrival_date"]')
    await expect(arrival_date_visible).toBeVisible()
    await arrival_date_visible.click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
    await page.locator('.dp--future').filter({hasText: '12'}).first().click()

    const continue_sidebar = page.locator('id=btnContinueSidebar')
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/turkey/apply-now#step=step_3a')

    await expect(page.locator('[name="general.email"]')).toBeVisible()
    await page.locator('[name="general.email"]').fill(email_test)

    
    const name_applicant = page.getByPlaceholder("John William")
    await expect(name_applicant).toBeVisible()
    await name_applicant.fill('Test')

    const last_name = page.getByPlaceholder("Smith").first()
    await last_name.fill('Test')

    const dob_day = page.locator('[name="applicant.0.dob.day"]')
    await dob_day.selectOption('13')

    const dob_month = page.locator('[name="applicant.0.dob.month"]')
    await dob_month.selectOption('7')

    const dob_year = page.locator('[name="applicant.0.dob.year"]')
    await dob_year.selectOption('2000')

    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/turkey/apply-now#step=step_3c')
    
    const passport_num = page.locator('[name="applicant.0.passport_num"]')
    await expect(passport_num).toBeVisible()
    await passport_num.fill('123456789')

    const passport_day = page.locator('[name="applicant.0.passport_expiration_date.day"]')
    await passport_day.selectOption('13')

    const passport_month = page.locator('[name="applicant.0.passport_expiration_date.month"]')
    await passport_month.selectOption('7')

    const passport_year = page.locator('[name="applicant.0.passport_expiration_date.year"]')
    await passport_year.selectOption('2030')

    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/turkey/apply-now#step=step_4')

    await expect(page.getByTestId('processing-standard')).toBeVisible()
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/turkey/apply-now#step=review')
    await page.waitForTimeout(2000)
    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }
    const denial_protection = page.getByRole('checkbox')
    await denial_protection.check() 
    await expect(denial_protection).toBeChecked()
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()

    await page.waitForNavigation({waitUntil: 'load'})

    // Set password
    await page.goto(deploy_url + 'account/settings/security')
    const password_set = page.locator('id=new_password')
    await expect(password_set).toBeVisible()
    await password_set.fill('testivisa5!')
    const password_set_confirm = page.locator('id=password_repeat')
    await password_set_confirm.fill('testivisa5!')
    await page.getByTestId('updatePasswordBtn').click()
    const confirmation_modal = page.locator('.swal-overlay--show-modal')
    await expect.soft(confirmation_modal).toBeVisible()

    await page.context().storageState({ path: authFile });
  }
});