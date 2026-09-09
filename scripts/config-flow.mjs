/** Loopt de configuratieflow door in een echte browser en let op fouten. */
import { chromium } from 'playwright'
const base = process.argv[2]
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

// Leeg beginnen, anders is de configuratie al vastgelegd.
await page.goto(`${base}#/?reset=empty`, { waitUntil: 'load' })
await page.waitForTimeout(400)
await page.goto(`${base}#/configuratie`, { waitUntil: 'load' })
await page.waitForTimeout(600)

const stap = async (naam) => {
  await page.screenshot({ path: `shots/cfg-${naam}.png`, fullPage: false })
}

await stap('1-talen')
await page.getByRole('button', { name: 'Engels', exact: true }).click()
await page.getByRole('button', { name: 'Turks', exact: true }).click()
await page.waitForTimeout(400)
await stap('1-talen-gekozen')

await page.getByRole('button', { name: 'Verder' }).first().click()
await page.waitForTimeout(900)
await stap('2-avatars')

// Voor elke taal de aanbevolen avatar kiezen.
for (const naam of ['Sanne', 'Emma', 'Zeynep']) {
  const tile = page.getByRole('button', { name: new RegExp(naam) }).first()
  if (await tile.count()) { await tile.click(); await page.waitForTimeout(250) }
}
await page.waitForTimeout(400)
await stap('2-avatars-gekozen')

await page.locator('#sectie-videotype').scrollIntoViewIfNeeded()
await page.waitForTimeout(700)
await page.getByRole('button', { name: /Vaste samenvatting/ }).click()
await stap('3-videotype')

await page.locator('#sectie-widget').scrollIntoViewIfNeeded()
await page.waitForTimeout(700)
await page.getByRole('button', { name: 'Ophalen' }).click()
await page.waitForTimeout(2000)
await stap('5-widget')

await page.locator('#sectie-vastleggen').scrollIntoViewIfNeeded()
await page.waitForTimeout(900)
await stap('6-vastleggen')
await page.mouse.wheel(0, 1200)
await page.waitForTimeout(900)
await stap('6-raster')

console.log('consolefouten:', errors.length ? [...new Set(errors)] : 'geen')
await browser.close()
process.exit(errors.length ? 1 : 0)
