/** Controleert dat elk scenario zijn eigen stand laadt en de teller klopt. */
import { chromium } from 'playwright'
const base = process.argv[2]
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const verwacht = {
  eerste: { teller: '10 van 10', bevat: 'Begin met de configuratie' },
  tweede: { teller: '7 van 10', bevat: 'In productie' },
  derde:  { teller: '6 van 10', bevat: 'Live' },
  emre:   { teller: '7 van 10', bevat: 'jouw taal aan de beurt' },
}
let mis = 0
for (const [id, v] of Object.entries(verwacht)) {
  await page.goto(`${base}?scenario=${id}#/`, { waitUntil: 'load' })
  await page.waitForTimeout(500)
  const body = await page.textContent('body')
  const ok = body.includes(v.teller) && body.includes(v.bevat)
  if (!ok) mis++
  console.log(`${ok ? '  ok' : 'FAIL'}  ${id.padEnd(7)} ${v.teller}  "${v.bevat}"`)
  await page.screenshot({ path: `shots/scen-${id}.png`, fullPage: true })
}
// Lekken tussen standen: in derde staat alles live, dus geen open taken meer.
await page.goto(`${base}?scenario=derde#/`, { waitUntil: 'load' })
await page.waitForTimeout(400)
const derde = await page.textContent('body')
const schoon = !derde.includes('Controleer script') && !derde.includes('Controleer video')
if (!schoon) mis++
console.log(`${schoon ? '  ok' : 'FAIL'}  standen lekken niet in elkaar`)
await browser.close()
process.exit(mis ? 1 : 0)
