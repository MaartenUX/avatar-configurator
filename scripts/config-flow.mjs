/** Loopt de configuratieflow door in een echte browser en let op fouten. */
import { chromium } from 'playwright'
import { serveer } from './serve.mjs'
const { url: base } = await serveer(process.argv[2] ?? 'dist')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
const fouten = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

const eis = (goed, tekst) => {
  console.log(goed ? `  ok  ${tekst}` : `FAIL ${tekst}`)
  if (!goed) fouten.push(tekst)
}

// Leeg beginnen, anders is de configuratie al vastgelegd.
await page.goto(`${base}?scenario=eerste#/`, { waitUntil: 'load' })
await page.waitForTimeout(400)
await page.goto(`${base}#/configuratie`, { waitUntil: 'load' })
await page.waitForTimeout(600)

const stap = async (naam) => {
  await page.screenshot({ path: `shots/cfg-${naam}.png`, fullPage: false })
}

await stap('1-talen')
for (const taal of ['Engels', 'Turks', 'Arabisch']) {
  await page.getByRole('button', { name: taal, exact: true }).click()
}
await page.waitForTimeout(400)
await stap('1-talen-gekozen')

await page.getByRole('button', { name: 'Verder' }).first().click()
await page.waitForTimeout(900)
await stap('2-avatars')

// Voor elke taal de avatar uit de demoset kiezen (CHANGES-03 G29).
for (const naam of ['Sanne', 'Emma', 'Mehmet', 'Nour']) {
  const tile = page.getByRole('button', { name: new RegExp(naam) }).first()
  if (await tile.count()) { await tile.click(); await page.waitForTimeout(250) }
}
await page.waitForTimeout(400)
await stap('2-avatars-gekozen')

await page.locator('#sectie-scenes').scrollIntoViewIfNeeded()
await page.waitForTimeout(900)
await page.getByRole('button', { name: /Camerawissel/ }).click()
await page.waitForTimeout(400)
await stap('3-overgang')
const overgang = await page.textContent('body')
eis(overgang.includes('max 2:00'), 'tijdlijn met max 2:00 bij de overgang')

await page.locator('#sectie-achtergronden').scrollIntoViewIfNeeded()
await page.waitForTimeout(700)
await page.getByRole('button', { name: /Standaard kantoorshots/ }).click()
await stap('4-achtergronden')

await page.locator('#sectie-widget').scrollIntoViewIfNeeded()
await page.waitForTimeout(700)
await page.getByRole('button', { name: 'Ophalen' }).click()
await page.waitForTimeout(2200)
await stap('5-widget')

await page.locator('#sectie-vastleggen').scrollIntoViewIfNeeded()
await page.waitForTimeout(900)
await stap('6-demo-start')

// De demo duurt 8 s; het wachtscherm moet te verlaten zijn (CHANGES-03 E19).
await page.getByRole('button', { name: 'Maak demovideo' }).click()
await page.waitForTimeout(600)
await stap('6-demo-wacht')
const wacht = await page.textContent('body')
eis(wacht.includes('ongeveer een half uur'), 'wachtscherm noemt een half uur')
const terug = page.getByRole('link', { name: 'Terug naar het overzicht' })
eis(await terug.isEnabled(), 'knop terug naar het overzicht is direct actief')

await terug.click()
await page.waitForTimeout(600)
await stap('6-overzicht-tijdens')
const overzicht = await page.textContent('body')
eis(overzicht.includes('Demovideo wordt gemaakt'), 'overzicht meldt dat de demo loopt')

// Wachten tot de demo klaar is en terugkomen via het overzicht.
await page.waitForTimeout(8500)
const na = await page.textContent('body')
eis(na.includes('Demo klaar'), 'overzicht meldt dat de demo klaar is')
await stap('6-overzicht-klaar')

await page.getByRole('link', { name: 'Naar de demo' }).click()
await page.waitForTimeout(1200)
await page.locator('#sectie-vastleggen').scrollIntoViewIfNeeded()
await page.waitForTimeout(900)
await stap('6-demo-klaar')
const klaar = await page.textContent('body')
eis(klaar.includes('Je keuzes'), 'de demo is klaar en de keuzes staan er')
eis(klaar.includes('Overgang'), 'de samenvatting noemt de overgang')

await page.mouse.wheel(0, 1400)
await page.waitForTimeout(800)
await stap('6-vastleggen')

console.log('consolefouten:', errors.length ? [...new Set(errors)] : 'geen')
await browser.close()
process.exit(errors.length || fouten.length ? 1 : 0)
