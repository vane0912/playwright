let eld;
async function translations(page, parent, child){
    const module = await import('eld');
    eld = module.eld;
    let ignore = ["Test Test", "+52", "Debug Details", "웁스!!", '2', '3', '$ 22.75', 'USD $102.74', '$ 79.99', '성', '예', "Mexico", "United States", '1', '$79.99', '$119.99', '$159.99']
    
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

    const translations_missing = {
        app_step: "Step_2",
        words_found: detect_english
    }

    console.log(translations_missing)
}

module.exports = {translations}