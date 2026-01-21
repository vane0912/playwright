import { test as setup, expect } from '@playwright/test';
import {deploy_url, email_test} from './urls'
import * as appFunctions from './functions'
import fs from 'fs';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
  if(!fs.existsSync(authFile)){
    await appFunctions.step_1(page,"mx", "turkey/apply-now")
    const continue_sidebar = page.locator('id=btnContinueSidebar')

    await expect(page.locator('[name="general.email"]')).toBeVisible()
    await page.locator('[name="general.email"]').fill(email_test)

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
    await page.waitForURL('**/turkey/apply-now#step=step_3c')
    
    const dropdown_country_step3c = page.locator('[name="applicant.0.nationality_country"]');
    await expect(dropdown_country_step3c).toBeVisible();
    await dropdown_country_step3c.click();
    const input_country_3c = page.getByTestId('dropdown-applicant.0.nationality_country');
    await expect(input_country_3c).toBeVisible();
    await input_country_3c.fill('Mexico');
    await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()

    
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
    
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    
    await appFunctions.newPaymentCheckout(page,"**/turkey/apply-now#", '6011 1111 1111 1117', '123')

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