const { test, expect } = require('@playwright/test');
const url_depoy = require('../urls');
const path = require('path');

const email = 'test1236@mailinator.com'
test.skip('Passport Order', async({page}) =>{
    await page.goto(url_depoy + 'passport-renewal/united-states/application')
    await expect(page.locator('#btnContinueSidebar')).toBeEnabled()
    await page.locator('#btnContinueSidebar').click()

    await page.waitForURL('**/passport-renewal/united-states/application#step=step_2')
    await expect(page.getByPlaceholder('John William')).toBeVisible()
    await page.getByPlaceholder('John William').fill('Test')
    await page.getByPlaceholder('Smith').first().fill('Test')

    const dob_day = page.locator('[name="general.dob.day"]')
    await dob_day.selectOption('13')

    const dob_month = page.locator('[name="general.dob.month"]')
    await dob_month.selectOption('7')

    const dob_year = page.locator('[name="general.dob.year"]')
    await dob_year.selectOption('2000')

    await page.getByPlaceholder('johnsmith@gmail.com').fill(email)
    await expect(page.locator('#btnContinueSidebar')).toBeEnabled()
    await page.locator('#btnContinueSidebar').click()

    await page.waitForURL('**/passport-renewal/united-states/application#step=step_3')
    const passport_issue_day = page.locator('[name="general.passport_issued_date.day"]')
    await expect(passport_issue_day).toBeVisible()
    await passport_issue_day.selectOption('13')
    await page.waitForTimeout(1000)

    const passport_issue_month = page.locator('[name="general.passport_issued_date.month"]')
    await passport_issue_month.selectOption('7')
    await page.waitForTimeout(1000)
    const passport_issue_year = page.locator('[name="general.passport_issued_date.year"]')
    await passport_issue_year.selectOption('2022')

    await page.waitForTimeout(1000)
    const passport_expiration_day = page.locator('[name="general.passport_expiration_date.day"]')
    await passport_expiration_day.selectOption('13')
    
    await page.waitForTimeout(1000)
    const passport_expiration_month = page.locator('[name="general.passport_expiration_date.month"]')
    await passport_expiration_month.selectOption('7')
    
    const passport_expiration_year = page.locator('[name="general.passport_expiration_date.year"]')
    await passport_expiration_year.selectOption('2034')
    await page.waitForTimeout(1000)

    await expect(page.locator('#btnContinueSidebar')).toBeEnabled()
    await page.locator('#btnContinueSidebar').click()

    await page.waitForURL('**/passport-renewal/united-states/application#step=step_4')
    await page.waitForTimeout(2000)
    await page.locator('#btnContinueSidebar').waitFor()
    await page.locator('#btnContinueSidebar').click()

    await page.waitForURL('**/passport-renewal/united-states/application#step=review')
    await page.waitForTimeout(1000)
    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }
    await page.getByRole('button', { name: 'Continue to payment' }).click()

    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()

    const order_completed_confirmation = page.getByTestId('postPaymentSuccessModal')
    await order_completed_confirmation.waitFor()
    
})