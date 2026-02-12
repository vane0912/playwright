const { expect } = require('@playwright/test');
const path = require('path');

async function arrival_date(page){
  const arrival_date_visible = page.locator('[name="general.arrival_date"]')
  await expect(arrival_date_visible).toBeVisible()
  await arrival_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '12'}).first().click()
}

async function departure_date(page){
  const departure_date_visible = page.locator('[name="general.departure_date"]')
  await expect(departure_date_visible).toBeVisible()
  await departure_date_visible.click()
  await expect(page.locator('.dp__outer_menu_wrap')).toBeVisible()
  await page.locator('[data-dp-element="action-next"]').click()
  await page.locator('.dp--future').filter({hasText: '15'}).first().click()
}
async function phoneNumber(page) {
    await page.getByPlaceholder('111-222-3333').fill('11111111')
    await page.getByTestId('boolean-WhatsApp').click()
}

async function addressApi(page, name) {
    await page.locator('[name="' + name + '"]').fill('123')
    await page.waitForTimeout(2000)
    await page.keyboard.press("Space")
    await page.waitForTimeout(1000)
    await page.keyboard.press("Enter")
    await page.waitForTimeout(1000)
    await page.locator('//li[@data-place-id="ChIJeyRnclRJxkcRxIZpwvHtnCk"]').click()
    await page.waitForTimeout(1000)
}

async function booleanOptions(page, name, dataHandle) {
    await page.waitForTimeout(2000)
    await page.locator('[name="' + name + '"]').getByTestId(dataHandle).click()
    await page.waitForTimeout(2000)
}

async function dropdownOptions(page, dataHandle, options) {
    await page.getByTestId(dataHandle).selectOption({value: options})
}
const inputText = async (page, name, customText) => {
    await page.locator('[name="' + name + '"]').fill(customText)
}

const applicantPhoto = async (page) => {
    await page.locator('id=instructions-continue').click()
    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname ,'Travel documents/uploads_passport/Applicant-Photo.jpg'));
    await expect(page.locator("id=document-loading")).toBeVisible()
    await page.waitForTimeout(14000)
    await expect(page.locator("id=document-loading")).toBeHidden()
    await expect(page.locator("id=document-step")).toContainText("Your upload passed our initial review!", "One of our experts will do a final review to ensure it meets all requirements. If it doesn't, we’ll contact you. ", "Don't like it? ", "You can take a new one")
    await page.locator('id=review-continue').click()
}
const passportPhoto = async (page) => {
    await page.locator('id=instructions-continue').click()
    await page.getByTestId("try-another-way-button").click()
    await page.setInputFiles('input[type="file"]', path.join(__dirname ,'Travel documents/uploads_passport/passport.jpg'));
    await expect(page.locator("id=document-loading")).toBeVisible()
    await page.waitForTimeout(14000)
    await expect(page.locator("id=document-loading")).toBeHidden()
    await expect(page.locator("id=document-step")).toContainText("Your upload passed our initial review!", "One of our experts will do a final review to ensure it meets all requirements. If it doesn't, we’ll contact you. ", "Don't like it? ", "You can take a new one")
    await page.locator('id=review-continue').click()
}

const dropdownSelector = async (page, name, dataHandle, text, value) => {
    await page.locator('[name="' + name + '"]').click()
    await page.waitForTimeout(2000)
    await page.getByTestId(dataHandle).fill(text)
    await page.getByRole('option', {value: value}).click()
    await page.waitForTimeout(2000)
}

const datePicker = async (page, name, day, month, year) =>{
    await page.locator('[name="' + name + '.day"]').selectOption(day)
    await page.waitForTimeout(2000)
    await page.locator('[name="' + name + '.month"]').selectOption(month)
    await page.waitForTimeout(2000)
    await page.locator('[name="' + name + '.year"]').selectOption(year)
    await page.waitForTimeout(2000)
}

module.exports = {
    arrival_date,
    phoneNumber,
    booleanOptions,
    departure_date,
    inputText,
    addressApi,
    dropdownOptions,
    applicantPhoto,
    passportPhoto,
    dropdownSelector,
    datePicker
}