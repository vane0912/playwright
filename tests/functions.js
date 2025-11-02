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


module.exports = {translations, uk_eta_ko, us_esta_ko}