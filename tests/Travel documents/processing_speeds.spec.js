const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');
const appFunctions = require('../functions')

test('Processing speeds appear and work', async({page}) => {
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
    await appFunctions.step_2(page,continue_sidebar)
    await page.waitForURL("**/india/apply-now#step=step_3c")

    await appFunctions.step_3c(page,continue_sidebar)
    await page.waitForTimeout(3000)
    
    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }
    await page.getByText("Standard").click()
    const correct_total = page.getByTestId('order-total')
    await expect(correct_total).toHaveText('$126.00')

    await page.getByTestId('processing-rush').click()
    await page.waitForTimeout(3000)
    await expect(correct_total).toHaveText('$146.00')

    await page.getByText("Super Rush").click()
    await page.waitForTimeout(3000)
    await expect(correct_total).toHaveText('$206.00')
    await page.waitForURL("**/india/apply-now#step=step_review")

    await appFunctions.newPaymentCheckout(page,'6011 1111 1111 1117', '123')
    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
})