const { test, expect } = require('@playwright/test');
const {deploy_url} = require('../urls');

test.skip('Payment with VISA', async({page}) => {
  await page.goto(deploy_url + 'colombia/apply-now?splitversion=202508-86b638rf9')
    
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
  await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=step_3a')

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
  await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=step_3c')

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
  await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=step_4')

  await expect(continue_sidebar).toBeEnabled()
  await continue_sidebar.click()
  await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=review')
  await page.waitForTimeout(2000)
  const duplicate = await page.isVisible('id=btnDisclaimerNext')
  if (duplicate){
    await page.locator('id=btnDisclaimerNext').click()
  }
  await expect(continue_sidebar).toBeEnabled()
  await page.waitForTimeout(2000)
    
  await continue_sidebar.click()
  const frame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first()
  const card_number = frame.locator("id=Field-numberInput")
  await page.waitForTimeout(2000)
  
  await card_number.fill('4556 7610 2998 3886')

  const expiration_month = frame.locator("id=Field-expiryInput")
  await expiration_month.fill('10/26')

  const cvv = page.locator("id=Field-cvcInput")
  await cvv.fill('123')
  /*
  const cardholder_name = page.getByPlaceholder("Cardholder name")
  await cardholder_name.fill('John Smith')
  */
  const zip_code = frame.locator("id=Field-postalCodeInput")
  await zip_code.fill('12345')
  
  const payment_btn = frame.locator('id=btnSubmitPayment')
  await expect(payment_btn).toBeVisible()
  await expect(payment_btn).toBeEnabled()
  await payment_btn.click()
  await page.waitForNavigation({waitUntil: 'load'})
  await page.waitForTimeout(1000)
  const request = await fetch("https://littleserver-production.up.railway.app/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      Cancelled: page.url().split("/")[4] 
    }),
  });
  await request.json()
})
  
test.skip('Payment with Master Card', async({page}) => {
    await page.goto(deploy_url + 'colombia/apply-now?splitversion=202508-86b638rf9')
    
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
    await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=step_3a')
  
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
    await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=step_3c')
  
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
    await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=step_4')
  
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=review')
    await page.waitForTimeout(2000)
    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }
    await expect(continue_sidebar).toBeEnabled()
    await page.waitForTimeout(2000)
    
    await continue_sidebar.click()
    
    const frame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first()
    const card_number = frame.locator("id=Field-numberInput")
    await page.waitForTimeout(2000)
    
    await card_number.fill('5555 5555 5555 4444')
  
    const expiration_month = frame.locator("id=Field-expiryInput")
    await expiration_month.fill('10/26')
  
    const cvv = frame.locator("id=Field-cvcInput")
    await cvv.fill('123')
    /*
    const cardholder_name = page.getByPlaceholder("Cardholder name")
    await cardholder_name.fill('John Smith')
    */
    const zip_code = frame.locator("id=Field-postalCodeInput")
    await zip_code.fill('12345')
  
    const payment_btn = frame.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})
})
  
test.skip('Payment with Amex', async({page}) => {
    await page.goto(deploy_url + 'colombia/apply-now?splitversion=202508-86b638rf9')
    
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
    await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=step_3a')
  
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
    await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=step_3c')
  
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
    await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=step_4')
  
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=review')
    await page.waitForTimeout(2000)
    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }
    await expect(continue_sidebar).toBeEnabled()
    await page.waitForTimeout(2000)
    
    await continue_sidebar.click()
    const frame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first()
    const card_number = frame.locator("id=Field-numberInput")
    await page.waitForTimeout(2000)
    
    await card_number.fill('3782 8224 6310 005')
    
    const expiration_month = frame.locator("id=Field-expiryInput")
    await expiration_month.fill('10/26')
  
    const cvv = frame.locator("id=Field-cvcInput")
    await cvv.fill('1234')
  /*
    const cardholder_name = page.getByPlaceholder("Cardholder name")
    await cardholder_name.fill('John Smith')
  */
    const zip_code = frame.locator("id=Field-postalCodeInput")
    await zip_code.fill('12345')
  
    const payment_btn = frame.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})
})
  
test.skip('Payment with Discover', async({page}) => {
    await page.goto(deploy_url + 'colombia/apply-now?splitversion=202508-86b638rf9')
    
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
    await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=step_3a')
  
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
    await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=step_3c')
  
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
    await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=step_4')
  
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=review')
    await page.waitForTimeout(2000)
    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }
    await expect(continue_sidebar).toBeEnabled()
    await page.waitForTimeout(2000)
    
    await continue_sidebar.click()
    const frame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first()
    //const card_number = page.getByPlaceholder("Card number")
    const card_number = frame.locator("id=Field-numberInput")
    await page.waitForTimeout(2000)
    
    await card_number.fill('6011 1111 1111 1117')
  
    const expiration_month = frame.locator("id=Field-expiryInput")
    await expiration_month.fill('10/26')
  
    const cvv = frame.locator("id=Field-cvcInput")
    await cvv.fill('123')
  /*
    const cardholder_name = page.getByPlaceholder("Cardholder name")
    await cardholder_name.fill('John Smith')
  */
    //const zip_code = page.getByPlaceholder("ZIP code")
    const zip_code = frame.locator("id=Field-postalCodeInput")
    await zip_code.fill('12345')
    
    const payment_btn = frame.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})
})
test.skip('Payment Invalid', async({page}) => {
    await page.goto(deploy_url + 'colombia/apply-now?splitversion=202508-86b638rf9')
    
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
    await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=step_3a')
  
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
    await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=step_3c')
  
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
    await page.waitForURL('**/colombia/apply-now?splitversion=202508-86b638rf9#step=step_4')
  
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    await page.waitForURL('colombia/apply-now?splitversion=202508-86b638rf9#step=review')
    await page.waitForTimeout(2000)
    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }
    await expect(continue_sidebar).toBeEnabled()
    await page.waitForTimeout(2000)
    
    await continue_sidebar.click()
    const frame = page.frameLocator('iframe[name^="__privateStripeFrame"]').first()
    //const card_number = page.getByPlaceholder("Card number")
    const card_number = frame.locator("id=Field-numberInput")
  
    await card_number.fill('3425 234532 45234')
  
    const expiration_month = frame.locator("id=Field-expiryInput")
    await expiration_month.fill('10 / 20')
  
    const cvv = frame.locator("id=Field-cvcInput")
    await cvv.fill('1')
    /*
    const cardholder_name = page.getByPlaceholder("Cardholder name")
    await cardholder_name.fill('John Smith')
    */
    //const zip_code = page.getByPlaceholder("ZIP code")
    const zip_code = frame.locator("id=Field-postalCodeInput")
    await zip_code.fill('122')
    await expect(frame.locator("id=Field-numberError")).toContainText("Your card number is invalid.")
    await expect(frame.locator("id=Field-expiryError")).toContainText("Your card number is invalid.")
    await expect(frame.locator("id=Field-cvcError")).toContainText("Your card’s security code is incomplete.")
    await expect(frame.locator("id=Field-postalCodeError")).toContainText("Your ZIP is invalid.")
    const payment_btn = frame.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeDisabled()
})