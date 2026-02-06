const { test, expect } = require('@playwright/test');
const appFunctions = require('../functions')
const path = require('path');

test('Embassy Visa', async({page}) => {
    test.slow()
    await appFunctions.step_1(page,"mx", "australia/apply-now")
    const continue_sidebar = page.locator('id=btnContinueSidebar')
  
    await appFunctions.step_2(page,continue_sidebar)
    await page.waitForURL("**/australia/apply-now#step=step_3c")

    const skip_passport = page.locator('[name="applicant.0.is_passport_on_hand"]')
    await expect(skip_passport).toBeVisible()
    await skip_passport.check()
    await expect(skip_passport).toBeChecked()
  
    // First Applicant 
    /*
    const occupation_triage = page.locator('[name="applicant.0.occupation_triage"]');
    await occupation_triage.click()
  
    const employe_input = page.getByTestId('dropdown-applicant.0.occupation_triage')
    await expect(employe_input).toBeVisible();
    await employe_input.fill('Employed - More than 2 years in current role');
    await page.waitForTimeout(1000)
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(1000)
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000)
  
    const monthly_income = page.getByTestId('dropdown-applicant.0.income_triage')
    await expect(monthly_income).toBeVisible()
    await monthly_income.selectOption('Over 2500 USD monthly')
  
    const assets_div = page.locator('[name="applicant.0.own_state_triage"]');
    const assets_boolean = assets_div.getByTestId('boolean-Yes')
    await assets_boolean.click()
  
    const other_countries_travel = page.getByTestId('travelerSection-0').getByTestId("boolean-Yes, in the last 5 years, I have traveled out of my home country and returned.")
    await other_countries_travel.click()
  
    const visa_denied = page.getByTestId('travelerSection-0').getByTestId("boolean-I was denied this visa over 12 months ago")
    await visa_denied.click()
    */
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    
    await page.waitForURL('**/australia/apply-now#step=step_3e')
    
    const location_1 = page.locator('[name="applicant.0.appointment_location_id"]')
    await location_1.getByTestId('boolean-4575').click()
  
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
    
    await appFunctions.newPaymentCheckout(page,"**/australia/apply-now#", '6011 1111 1111 1117', '123')
    const payment_btn = page.locator('id=btnSubmitPayment')
    await expect(payment_btn).toBeVisible()
    await expect(payment_btn).toBeEnabled()
    await payment_btn.click()

    await page.waitForNavigation({waitUntil: 'load'})
    await page.getByTestId("transition-page-button").click()
    const request = await fetch("https://littleserver-production.up.railway.app/", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        Scheduling: page.url().split("/")[4] 
      }),
    });
    await request.json()

    await page.getByPlaceholder('111-222-3333').fill('11111111')
    await page.getByTestId('boolean-WhatsApp').click()
    
    const arrival_date_visible = page.locator('[name="general.arrival_date"]')
    await expect(arrival_date_visible).toBeVisible()
    await arrival_date_visible.click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
    await page.locator('[data-dp-element="action-next"]').click()
    await page.locator('[data-dp-element="action-next"]').click()
    await page.locator('.dp--future').filter({hasText: '12'}).first().click()
    
    await page.waitForTimeout(5000)

    const departure_date_visible = page.locator('[name="general.departure_date"]')
    await expect(departure_date_visible).toBeVisible()
    await departure_date_visible .click()
    await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
    await page.locator('[data-dp-element="action-next"]').click()
    await page.locator('[data-dp-element="action-next"]').click()
    await page.locator('.dp--future').filter({hasText: '15'}).first().click()
    /*
    const arrival_city = page.locator('//div[@data-ivisa-question-selector="general.arrival_city"]//div[@data-handle="filter-value"]')

    await expect(arrival_city).toBeVisible();
    await arrival_city.click()

    await page.getByTestId("dropdown-general.arrival_city").fill('Adelaide International Airport (ADL)');
    await page.waitForTimeout(1000)
    await page.keyboard.press("ArrowDown")
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter")
    await page.waitForTimeout(1000)
    
    await page.getByPlaceholder("JW Marriott Hotel Madrid or Mario Rodriguez").fill("Test name")

    await page.locator('[name="general.destination_address"]').fill('123')
    await page.waitForTimeout(2000)
    await page.keyboard.press("Space")
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter")
    await page.waitForTimeout(1000)
    await page.locator('//li[@data-place-id="ChIJy03Qsx1akWsRcbqOMJc_Hm8"]').click()
*/  
    await page.locator('//div[@name="general.traveling_with_others"]//div[@data-handle="boolean-No"]').click()
    await page.waitForTimeout(1000)

    await page.locator('//div[@name="general.need_multiple_entry_visa"]//div[@data-handle="boolean-No"]').click()
    await page.waitForTimeout(1000)
    await page.getByTestId("boolean-Me").click()
    await page.waitForTimeout(1000)
    const next_btn = page.locator('id=btnContinueUnderSection')
    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})

    await page.waitForTimeout(3000)
    const occupation_triage = page.locator('[name="applicant.0.occupation_triage"]');
    await occupation_triage.click()
  
    const employe_input = page.getByTestId('dropdown-applicant.0.occupation_triage')
    await expect(employe_input).toBeVisible();
    await employe_input.fill('Homemaker (Partner-dependent income)');
    await page.waitForTimeout(1000)
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(1000)
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1000)
  
    const monthly_income = page.getByTestId('dropdown-applicant.0.income_triage')
    await expect(monthly_income).toBeVisible()
    await monthly_income.selectOption('Over 2500 USD monthly')
  
    const assets_div = page.locator('[name="applicant.0.own_state_triage"]');
    const assets_boolean = assets_div.getByTestId('boolean-Yes')
    await assets_boolean.click()
  
    const other_countries_travel = page.getByTestId("boolean-Yes, in the last 5 years, I have traveled or have a visa for at least 1 of these countries - USA, Canada, Australia, UK, all Schengen countries.")
    await other_countries_travel.click()
  
    const visa_denied = page.getByTestId("boolean-I was denied this visa over 12 months ago")
    await visa_denied.click()

    await page.locator('[name="applicant.0.birth_city"]').fill("test")

    await page.getByPlaceholder('1234 Sesame St. Apt. 3, Springtown, IL 55555').fill('123')
    await page.waitForTimeout(2000)
    await page.keyboard.press("Space")
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter")
    await page.waitForTimeout(1000)
    await page.locator('//li[@data-place-id="ChIJ49W-BhhawokR4KLCF2oTVVo"]').click()

    const birth_country = page.locator('[name="applicant.0.secondary_document_issued_country"]');
    await expect(birth_country).toBeVisible();
    await birth_country.click();
    const issued_country = page.getByTestId('dropdown-applicant.0.secondary_document_issued_country');
    await expect(issued_country).toBeVisible();
    await issued_country.fill('Mexico');
    await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()
    
    await page.getByTestId('boolean-Male').click()
    
    await page.locator('[name="applicant.0.birth_city"]').fill("test")
    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})
    await page.waitForTimeout(2000) 
    /*
    const job_status = page.getByTestId('applicant.0.occupation_grouping');
    await job_status.selectOption('Other')
    await page.waitForTimeout(2000) 
    await page.locator('[name="applicant.0.criminal_offence_details"]').fill("test")
    await page.waitForTimeout(2000) 
    */
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})
    await page.waitForTimeout(2000) 
    const marital_status = page.getByTestId('dropdown-applicant.0.marital_status');
    await marital_status.selectOption('Single / Never Married')
    await page.waitForTimeout(2000) 
    await page.locator('//div[@name="applicant.0.family_residents"]//div[@data-handle="boolean-No"]').click()
    await page.waitForTimeout(2000) 
    await page.locator('//div[@name="applicant.0.family_traveling_with"]//div[@data-handle="boolean-Yes"]').click()
    await page.waitForTimeout(2000) 


    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForTimeout(2000) 
    
    await page.locator('[name="amount"]').click()
    await page.waitForTimeout(1000)
    await page.keyboard.type("1234565", {delay: 100})
    await page.waitForTimeout(1000)


    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})
    await page.waitForTimeout(2000) 
    
    await page.locator('//div[@name="applicant.0.previously_visited"]//div[@data-handle="boolean-No"]').click()
    await page.waitForTimeout(1000)
    await page.locator('//div[@name="applicant.0.current_visas"]//div[@data-handle="boolean-No"]').click()
    await page.waitForTimeout(1000)
    await page.locator('//div[@name="applicant.0.refused_visa"]//div[@data-handle="boolean-No"]').click()
    await page.waitForTimeout(1000)
    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})

    await expect(next_btn).toBeEnabled()
    await next_btn.click()
    await page.waitForNavigation({waitUntil: 'load'})

    await page.locator('id=instructions-continue').click()
    await page.locator('input[type="file"]').nth(1).setInputFiles(path.join(__dirname, 'uploads_passport/Applicant-Photo.jpg'))
    await page.waitForTimeout(8000)
    await page.locator('id=add-file-multiple-continue').click()

    await page.locator('id=instructions-continue').click()
    await page.locator('input[type="file"]').nth(1).setInputFiles(path.join(__dirname, 'uploads_passport/Applicant-Photo.jpg'))
    await page.waitForTimeout(8000)
    await page.locator('id=add-file-multiple-continue').click()

    await page.locator('id=instructions-continue').click()
    await page.locator('id=add-file-multiple-continue').click()
    
    await page.locator('id=instructions-continue').click()
    await page.locator('id=add-file-multiple-continue').click()

    await page.locator('id=instructions-continue').click()
    await page.locator('id=add-file-multiple-continue').click()
    
    await page.locator('id=instructions-continue').click()
    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname, 'uploads_passport/passport.jpg'));
    await page.waitForTimeout(8000)
    await page.locator('id=review-continue').click()

    await page.waitForNavigation({waitUntil: 'load'})

    await page.waitForTimeout(3000)
    await page.getByText("Use selected details").click()
    const passport_issue_day = page.locator('[name="applicant.0.passport_issued_date.day"]')
    await expect(passport_issue_day).toBeVisible()
    await passport_issue_day.selectOption('13')
    await page.waitForTimeout(1000)

    const passport_issue_month = page.locator('[name="applicant.0.passport_issued_date.month"]')
    await passport_issue_month.selectOption('7')
    await page.waitForTimeout(1000)
    const passport_issue_year = page.locator('[name="applicant.0.passport_issued_date.year"]')
    await passport_issue_year.selectOption('2022')

    await page.waitForTimeout(1000)

    await page.locator('//div[@name="applicant.0.other_document"]//div[@data-handle="boolean-No"]').click()
    
    const submit_post_payment = page.locator('id=btnSubmitApplication')
    await expect(submit_post_payment).toBeEnabled()
    await submit_post_payment.click()
    await page.waitForNavigation({waitUntil: 'load'})
  })
  