const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');
const percySnapshot = require('@percy/playwright');

test('Continue with your application banner', async({page}) => {
  await page.goto(deploy_url + 'thailand/apply-now')
    
  const dropdown_country =  page.getByTestId('filter-value');

  await expect(dropdown_country).toBeVisible();
  await dropdown_country.click();
  const input_country = page.getByTestId('dropdown-general.common_nationality_country');

  await expect(input_country).toBeVisible();
  await input_country.fill('united states');
  await page.getByRole("option", {name: 'United States flag United States'}).click()

  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()

  const continue_sidebar = page.locator('id=btnContinueSidebar')
  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/thailand/apply-now#step=step_3a')

  await page.goto(deploy_url)
  await page.goto(deploy_url + 'thailand/apply-now')
  await expect(page.locator(".banner_container")).toBeVisible()
  await expect(page.locator(".banner_container")).toContainText("You’ve already started an order.")
  await expect(page.getByText("Go to application")).toBeVisible() 
  await percySnapshot(page, 'Continue with application banner');
})