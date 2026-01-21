const {deploy_url} = require('./urls');
let eld;

var us_esta_ko = {
  product: "US ESTA",
  pre_payment: 0,
  pre_payment_missing: [],
  post_payment: 0,
  post_payment_missing: [],
  deployment: deploy_url
}

var uk_eta_ko = {
  product: "UK ETA",
  pre_payment: 0,
  pre_payment_missing: [],
  post_payment: 0,
  post_payment_missing: [],
  deployment: deploy_url
}
async function translations(parent, child, section, product){
    const module = await import('eld');
    eld = module.eld;
    let ignore = ["Test Test","(+XX)","Australia","$ 40.00","$ 40.00","$ 99.99","$99.99", "+52", "Debug Details", "웁스!!", '2', '3', '$ 22.75', 'USD $102.74', '$ 79.99', '성', '예', "Mexico", "United States", '1', '$79.99', '$119.99', '$159.99']
    
    const allElements = await parent.locator(child).all();
    const filtered_array = await Promise.all(
        allElements.map(async (el) => {
            let get_text = (await el.textContent())?.trim();
            if(get_text && get_text.length > 0){
                return get_text
            }
        })
    )
    const remove_undefined = filtered_array.filter(Boolean);
    let detect_english = remove_undefined.filter((text) => {
        const words_to_ignore = ignore.some(word => text.includes(word))
        if (!words_to_ignore && eld.detect(text).language !== "ko"){
            return text
        }
    })
    if(detect_english.length > 0){
        product[section]++ 
        product[`${section}_missing`].push(...detect_english)
    }
}

async function newPaymentCheckout(page,url,creditCard, cvvNum){
    await page.waitForURL(url + 'step=review')
    await page.waitForTimeout(2000)
    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').nth(1)
    
    await stripeFrame.locator("id=Field-numberInput").fill(creditCard);

    const expiration_month = stripeFrame.locator("id=Field-expiryInput")
    await expiration_month.fill('10/26')

    const cvv = stripeFrame.locator("id=Field-cvcInput")
    await cvv.fill(cvvNum)
    const zip_code = stripeFrame.locator("id=Field-postalCodeInput")
    await zip_code.fill('12345')
    /*
    const cardholder_name = page.getByPlaceholder("Cardholder name")
    await cardholder_name.fill('John Smith')
    
    const zip_code = page.getByPlaceholder("ZIP code")
    await zip_code.fill('12345')
    */ 
}
async function oldPaymentCheckout(page, url, creditCard, cvvNum){
    await page.waitForURL('**/turkey/apply-now#step=step_4')
    const continue_sidebar = page.locator('id=btnContinueSidebar')
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
    
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').nth(1)
    
    await stripeFrame.locator("id=Field-numberInput").fill('6011 1111 1111 1117');

    const expiration_month = stripeFrame.locator("id=Field-expiryInput")
    await expiration_month.fill('10/26')

    const cvv = stripeFrame.locator("id=Field-cvcInput")
    await cvv.fill(cvvNum)
    const zip_code = stripeFrame.locator("id=Field-postalCodeInput")
    await zip_code.fill('12345')
    /*
    const cardholder_name = page.getByPlaceholder("Cardholder name")
    await cardholder_name.fill('John Smith')
    
    const zip_code = page.getByPlaceholder("ZIP code")
    await zip_code.fill('12345')
    */ 
}

async function step_1(page,country,url){
    await page.goto(deploy_url + url)
    await page.waitForURL(deploy_url + url)
    const dropdown_country =  page.getByTestId('filter-value');
    
    await dropdown_country.click();
    const input_country = page.getByTestId('dropdown-general.common_nationality_country');
    if(country === "us"){
        await input_country.fill('united states');
        await page.getByRole("option", {name: 'United States flag United States'}).click()
    }else{
        await input_country.fill('Mexico');
        await page.getByRole("option", {name: 'Mexico flag Mexico'}).click()
    }
    await page.waitForTimeout(5000)
    const continue_sidebar = page.locator('id=btnContinueSidebar')
    await continue_sidebar.click()
    await page.waitForURL('**/'+ url + '#step=step_3a')
}
module.exports = {
    translations,
    uk_eta_ko,
    us_esta_ko, 
    newPaymentCheckout, 
    step_1
}