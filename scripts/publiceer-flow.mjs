/** Testtaak (d): alle talen goedkeuren, publiceren en de social-versies maken. */
import { chromium } from 'playwright'

const base = process.argv[2]
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const fouten = []
page.on('pageerror', (e) => fouten.push(e.message))
page.on('console', (m) => m.type() === 'error' && fouten.push(m.text()))

let mis = 0
const check = async (naam, tekst) => {
  await page.waitForTimeout(400)
  const body = await page.textContent('body')
  const ok = body.includes(tekst)
  if (!ok) mis++
  console.log(`${ok ? '  ok' : 'FAIL'}  ${naam}  ("${tekst}")`)
}

await page.goto(`${base}?fast=1&scenario=tweede#/`, { waitUntil: 'load' })
await page.waitForTimeout(500)

const P = 'p-bijstand'
// Elke taal door tekst- en videocontrole heen werken.
for (const lang of ['en', 'tr', 'ar']) {
  for (const stap of ['tekst', 'video']) {
    const url = stap === 'tekst' ? `#/paginas/${P}/${lang}` : `#/paginas/${P}/video/${lang}`
    await page.goto(`${base}?fast=1${url}`, { waitUntil: 'load' })
    await page.waitForTimeout(1600)
    const knop = page.getByRole('button', { name: 'Akkoord', exact: true })
    if (await knop.count()) {
      await knop.click()
      await page.waitForTimeout(1500)
    }
  }
}
// Nederlands heeft alleen nog videocontrole nodig.
await page.goto(`${base}?fast=1#/paginas/${P}/video/nl`, { waitUntil: 'load' })
await page.waitForTimeout(1600)
const nl = page.getByRole('button', { name: 'Akkoord', exact: true })
if (await nl.count()) { await nl.click(); await page.waitForTimeout(1200) }

await check('alle talen goedgekeurd', 'Publiceer')

await page.goto(`${base}?fast=1#/paginas/${P}/publiceren`, { waitUntil: 'load' })
await check('publiceerscherm', 'Toevoegen aan je website')
await page.screenshot({ path: 'shots/pub-1-publiceren.png', fullPage: true })

await page.getByRole('button', { name: /Maak downloadversies/ }).click()
await page.waitForTimeout(1200)
await check('downloadversies gemaakt', 'Zo deed Gemeente Eindhoven het')

await page.getByRole('button', { name: 'Publiceer', exact: true }).click()
await page.waitForTimeout(900)
await check('celebration', 'Je bent klaar!')
await page.screenshot({ path: 'shots/pub-2-klaar.png', fullPage: true })

console.log('')
console.log('consolefouten:', fouten.length ? [...new Set(fouten)] : 'geen')
await browser.close()
process.exit(mis || fouten.length ? 1 : 0)
