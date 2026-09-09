/** Controleert RTL, twee schermbreedtes, de lege staat en horizontaal scrollen. */
import { chromium } from 'playwright'

const base = process.argv[2]
const browser = await chromium.launch()
const problemen = []

for (const breedte of [1280, 1440]) {
  const page = await browser.newPage({ viewport: { width: breedte, height: 900 } })
  page.on('pageerror', (e) => problemen.push(`${breedte}px pageerror: ${e.message}`))

  await page.goto(`${base}?fast=1#/?reset=1`, { waitUntil: 'load' })
  await page.waitForTimeout(500)

  for (const [route, naam] of [
    ['/', 'overzicht'],
    ['/configuratie', 'configuratie'],
    ['/paginas', 'paginas'],
    ['/paginas/p-bijstand', 'beheer'],
    ['/paginas/p-bijstand/ar', 'arabisch'],
    ['/paginas/p-bijstand/video/ar', 'arabisch-video'],
    ['/team', 'team'],
    ['/hulp', 'hulp'],
  ]) {
    await page.goto(`${base}?fast=1#${route}`, { waitUntil: 'load' })
    await page.waitForTimeout(400)

    // Het document mag nooit horizontaal scrollen.
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    if (overflow > 1) problemen.push(`${breedte}px ${naam}: ${overflow}px horizontale overflow`)

    if (breedte === 1440) await page.screenshot({ path: `shots/p-${naam}.png`, fullPage: true })
  }

  // Arabisch moet daadwerkelijk rechts uitlijnen.
  await page.goto(`${base}?fast=1#/paginas/p-bijstand/ar`, { waitUntil: 'load' })
  await page.waitForTimeout(500)
  const rtl = await page.evaluate(() => {
    const el = document.querySelector('[dir="rtl"]')
    if (!el) return null
    return getComputedStyle(el).direction
  })
  if (rtl !== 'rtl') problemen.push(`${breedte}px: geen rtl-element op de Arabische pagina (${rtl})`)

  await page.close()
}

// Lege staat moet de configuratie-uitnodiging tonen.
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto(`${base}#/?reset=empty`, { waitUntil: 'load' })
await page.waitForTimeout(600)
const leeg = await page.textContent('body')
if (!leeg.includes('Begin met de configuratie')) problemen.push('lege staat toont de uitnodiging niet')
await page.screenshot({ path: 'shots/p-leeg.png', fullPage: true })
await page.close()

console.log(problemen.length ? problemen.join('\n') : 'geen problemen')
await browser.close()
process.exit(problemen.length ? 1 : 0)
