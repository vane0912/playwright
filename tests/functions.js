const {deploy_url} = require('./urls');
const { expect } = require('@playwright/test');
let eld;

var us_esta_ko = {
  product: "US ESTA",
  pre_payment: 0,
  pre_payment_missing: [],
  post_payment: 0,
  post_payment_missing: [],
  deployment: deploy_url
}

var uk_eta = {
  product: "UK ETA",
  languages: [
    {
        translations: "ko",
        pre_payment: 0,
        ko_pre_payment: [],
        ko_post_payment: [],
        post_payment: 0

    },
    {
        translations: "ja",
        pre_payment: 0,
        ja_pre_payment: [],
        ja_post_payment: [],
        post_payment: 0
    }
  ],
  deployment: deploy_url
}
async function translations(selector, section, product, language){
    const module = await import('eld');
    eld = module.eld;
    let ignore = []
    const allElements = await selector.all();
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
        if (!words_to_ignore && eld.detect(text).language !== language){
            return text
        }
    })
    if(detect_english.length > 0){
        product.languages.forEach(element => {    
            if(element.translations === language){
                element[section]++
                element[`${language}_${section}`].push(...detect_english)
                console.log(element)
            }
        });
    }

}

async function newPaymentCheckout(page,creditCard, cvvNum,continuebtn){
    if(continuebtn){
        await page.getByRole('button', { name: 'Continue to payment' }).click()
    }
    await page.waitForTimeout(2000)
    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }
    await page.locator('[name="number"]').fill(creditCard);

    const expiration_month = page.locator('[name="mmyy"]')
    await expiration_month.fill('10/26')

    const cvv = page.locator('[name="cvv"]')
    await cvv.fill(cvvNum)
    /*
    const zip_code = stripeFrame.locator("id=payment-postalCodeInput")
    await zip_code.fill('12345')
    /*
    const cardholder_name = page.getByPlaceholder("Cardholder name")
    await cardholder_name.fill('John Smith')
    
    const zip_code = page.getByPlaceholder("ZIP code")
    await zip_code.fill('12345')
    */ 
}
async function oldPaymentCheckout(page, url, creditCard, cvvNum){
    await page.waitForURL(url + 'step=review')
    if(continuebtn){
        await page.getByRole('button', { name: 'Continue to payment' }).click()
    }
    await page.waitForTimeout(2000)
    const duplicate = await page.isVisible('id=btnDisclaimerNext')
    if (duplicate){
      await page.locator('id=btnDisclaimerNext').click()
    }
    const stripeFrame = page.frameLocator('iframe[name^="__privateStripeFrame"]').nth(1)
    
    await stripeFrame.locator("id=payment-numberInput").fill(creditCard);

    const expiration_month = stripeFrame.locator("id=payment-expiryInput")
    await expiration_month.fill('10/26')

    const cvv = stripeFrame.locator("id=payment-cvcInput")
    await cvv.fill(cvvNum)
    const zip_code = stripeFrame.locator("id=payment-postalCodeInput")
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

async function step_2(page,continue_sidebar){
    const dob_day = page.locator('[name="applicant.0.dob.day"]')
    await dob_day.selectOption('13')

    const dob_month = page.locator('[name="applicant.0.dob.month"]')
    await dob_month.selectOption('7')

    const dob_year = page.locator('[name="applicant.0.dob.year"]')
    await dob_year.selectOption('2000')

    const name_applicant = page.locator('[name="applicant.0.first_name"]')
    await name_applicant.fill('Test')
    
    await page.waitForTimeout(1000)
    const last_name = page.locator('[name="applicant.0.last_name"]')
    await last_name.fill('Test')
    await page.waitForTimeout(1000)
    
    await expect(continue_sidebar).toBeEnabled()
    await continue_sidebar.click()
}

async function step_3c(page,continue_sidebar){
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
}

module.exports = {
    translations,
    uk_eta,
    us_esta_ko, 
    newPaymentCheckout, 
    step_1,
    step_2,
    step_3c
}