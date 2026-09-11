/**
 * Loopt de vier testtaken uit het bouwplan door in een echte browser.
 * Met ?fast=1 duren alle mock-timers een seconde.
 */
import { chromium } from 'playwright'

const base = process.argv[2]
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
page.on('console', (m) => m.type() === 'error' && errors.push(`console: ${m.text()}`))

const stap = async (naam, tekst) => {
  await page.waitForTimeout(500)
  const body = await page.textContent('body')
  const ok = !tekst || body.includes(tekst)
  console.log(`${ok ? '  ok' : 'FAIL'}  ${naam}${tekst ? `  ("${tekst}")` : ''}`)
  await page.screenshot({ path: `shots/flow-${naam}.png` })
  return ok
}

let fouten = 0
const check = async (n, t) => { if (!(await stap(n, t))) fouten++ }

// Seed-staat, snelle timers.
await page.goto(`${base}?fast=1&scenario=tweede#/`, { waitUntil: 'load' })
await page.waitForTimeout(600)

// (b) Pagina toevoegen, samenvatting goedkeuren, script finetunen.
await page.getByRole('link', { name: /Pagina toevoegen/ }).first().click()
await check('01-toevoegen', 'Dit gaat er gebeuren')

await page.getByRole('button', { name: 'Start', exact: true }).click()
await check('02-wachten', 'We maken de samenvatting')

await page.waitForTimeout(1800)
await check('03-samenvatting', 'Basissamenvatting controleren')

await page.getByRole('button', { name: 'Akkoord', exact: true }).click()
await check('04-terug-op-overzicht', 'Basissamenvatting goedgekeurd')

await page.getByRole('link', { name: /Finetune script en audio/ }).first().click()
await check('05-script', 'Nederlands script en audio finetunen')

await page.getByRole('button', { name: 'Akkoord', exact: true }).click()
await check('06-script-akkoord', 'Script goedgekeurd')

// (c) Als Emre de Turkse tekst en video goedkeuren.
await page.waitForTimeout(1800)
await page.selectOption('select', 'emre')
await check('07-emre', 'jouw taal aan de beurt')

const trTekst = page.getByRole('link', { name: /Controleer tekst/ }).first()
if (await trTekst.count()) {
  await trTekst.click()
  await check('08-turkse-tekst', 'Turks')
  await page.getByRole('button', { name: 'Akkoord', exact: true }).click()
  await page.waitForTimeout(1800)
}

const trVideo = page.getByRole('link', { name: /Controleer video/ }).first()
if (await trVideo.count()) {
  await trVideo.click()
  await check('09-turkse-video', 'Ondertiteling en video controleren')
  await page.getByRole('button', { name: 'Akkoord', exact: true }).click()
  await check('10-video-akkoord', 'goedgekeurd')
}

console.log('')
console.log('consolefouten:', errors.length ? [...new Set(errors)] : 'geen')
await browser.close()
process.exit(fouten || errors.length ? 1 : 0)
