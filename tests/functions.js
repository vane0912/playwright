const {deploy_url} = require('./urls');
const cld = require('cld')
const { expect } = require('@playwright/test');

var uk_eta = {
  product: "UK ETA",
  languages: [
    {
        translations: "pt",
        pre_payment: 0,
        pt_pre_payment: [],
        pt_post_payment: [],
        post_payment: 0

    },
    {
        translations: "de",
        pre_payment: 0,
        de_pre_payment: [],
        de_post_payment: [],
        post_payment: 0
    },
    {
        translations: "fr",
        pre_payment: 0,
        fr_pre_payment: [],
        fr_post_payment: [],
        post_payment: 0

    },
    {
        translations: "it",
        pre_payment: 0,
        it_pre_payment: [],
        it_post_payment: [],
        post_payment: 0
    },
    {
        translations: "es",
        pre_payment: 0,
        es_pre_payment: [],
        es_post_payment: [],
        post_payment: 0
    },
    {
        translations: "ru",
        pre_payment: 0,
        ru_pre_payment: [],
        ru_post_payment: [],
        post_payment: 0
    },
    {
        translations: "tr",
        pre_payment: 0,
        tr_pre_payment: [],
        tr_post_payment: [],
        post_payment: 0
    }

  ],
  deployment: deploy_url
}
async function translations(selector, section, product, language){

    const allElements = await selector.all();
    const filtered_array = await Promise.all(
        allElements.map(async (el) => {
            let get_text = (await el.textContent())?.trim()?.replace(/\n/g, ' ').replace(/[0-9]/g, '').replace(/[!@#$%^&*(),.?":{}|<>+]/g, '');
            if(get_text && get_text.length > 0){
                return get_text
            }
        })
    )
    const remove_undefined = filtered_array.filter(Boolean);

    let detect_english = remove_undefined.filter(async (text) => {
        const detect = await cld.detect(text)
        const check_includes = detect.chunks.some(chunk => chunk.code === "en")

        if (check_includes){
            return text
        }
    })
    if(detect_english.length > 0){
        product.languages.forEach(element => {    
            if(element.translations === language){
                element[section]++
                element[`${language}_${section}`].push(...detect_english)
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
    await dob_year.selectOption('2001')

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
    newPaymentCheckout, 
    step_1,
    step_2,
    step_3c
}