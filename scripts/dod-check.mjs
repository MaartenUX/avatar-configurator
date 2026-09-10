/**
 * Definition of done uit §11 van het bouwplan, gecontroleerd in een echte
 * browser tegen het gebouwde bestand.
 */
import { chromium } from 'playwright'
import { readFileSync, readdirSync } from 'node:fs'

const base = process.argv[2]
const dist = process.argv[3]
const browser = await chromium.launch()
const uitslag = []
const eis = (naam, ok, detail = '') =>
  uitslag.push({ naam, ok, detail })

// 1. Eén bestand, geen losse assets ernaast.
const bestanden = readdirSync(dist)
eis('dist bevat alleen index.html', bestanden.length === 1 && bestanden[0] === 'index.html',
  bestanden.join(', '))

const html = readFileSync(`${dist}/index.html`, 'utf8')
eis('bestand blijft onder 8 MB', html.length < 8 * 1024 * 1024,
  `${(html.length / 1024 / 1024).toFixed(2)} MB`)

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const fouten = []
page.on('pageerror', (e) => fouten.push(e.message))
page.on('console', (m) => m.type() === 'error' && fouten.push(m.text()))

// 2. Opent vanaf file:// zonder server.
await page.goto(`${base}#/`, { waitUntil: 'load' })
await page.waitForTimeout(600)
eis('opent vanaf file:// zonder server', (await page.$eval('#root', (e) => e.children.length)) > 0)

// 3. Wat laadt de pagina echt van buiten? In de DOM kijken, niet in de tekst:
// het embed-veld bevat een scripttag als tekst die de gebruiker kopieert.
const extern = await page.evaluate(() =>
  [...document.querySelectorAll('script[src], link[href], img[src], iframe[src]')]
    .map((el) => el.getAttribute('src') || el.getAttribute('href') || '')
    .filter((u) => /^https?:/.test(u)),
)
const nietFonts = extern.filter((u) => !u.includes('fonts.g'))
eis('laadt niets van buiten behalve fonts', nietFonts.length === 0, nietFonts.join(', '))

// 3. Geen Engelse UI-termen of lorem op de schermen.
const verboden = ['lorem', 'summary', 'translate', 'pipeline', 'credit']
const gevonden = new Set()
for (const route of ['/', '/configuratie', '/configuratie/demo', '/paginas/nieuw', '/team', '/hulp',
                     '/paginas/p-bijstand', '/paginas/p-bijstand/tr', '/paginas/p-bijstand/video/tr']) {
  await page.goto(`${base}?fast=1#${route}`, { waitUntil: 'load' })
  await page.waitForTimeout(350)
  const tekst = (await page.textContent('body')).toLowerCase()
  for (const w of verboden) if (tekst.includes(w.toLowerCase())) gevonden.add(`${w} op ${route}`)
}
eis('geen Engelse UI-termen of lorem', gevonden.size === 0, [...gevonden].join(', '))

// 4. ?fast=1 versnelt de timers naar een seconde.
await page.goto(`${base}?fast=1&scenario=tweede#/`, { waitUntil: 'load' })
await page.waitForTimeout(500)
await page.goto(`${base}?fast=1#/paginas/nieuw`, { waitUntil: 'load' })
await page.waitForTimeout(400)
await page.getByRole('button', { name: 'Start', exact: true }).click()
const begin = Date.now()
await page.getByText('Basissamenvatting controleren').waitFor({ timeout: 6000 })
const duur = Date.now() - begin
eis('?fast=1 zet de timers op een seconde', duur < 3000, `${duur} ms`)

// 5. Na akkoord land je op het overzicht met een toast.
await page.getByRole('button', { name: 'Akkoord', exact: true }).click()
await page.waitForTimeout(600)
const url = page.url()
const body = await page.textContent('body')
eis('na akkoord terug op het overzicht met een toast',
  url.endsWith('#/') && body.includes('Basissamenvatting goedgekeurd'), url)

// 6. Elke wachtstap noemt de tijd; elke akkoordstap noemt de consequentie.
await page.goto(`${base}?scenario=tweede#/`, { waitUntil: 'load' })
await page.waitForTimeout(500)
await page.goto(`${base}#/paginas/p-bijstand/video/ar`, { waitUntil: 'load' })
await page.waitForTimeout(500)
const wacht = await page.textContent('body')
eis('wachtstap noemt wat er gebeurt', wacht.includes('wordt gemaakt'))

await page.goto(`${base}?fast=1#/paginas/p-bijstand/tr`, { waitUntil: 'load' })
await page.waitForTimeout(500)
const akkoord = await page.textContent('body')
eis('akkoordstap noemt de consequentie', akkoord.includes('Na akkoord'))

// 7. Elk shell-scherm is bereikbaar zonder zijbalk.
await page.goto(`${base}#/`, { waitUntil: 'load' })
await page.waitForTimeout(400)
const teamLink = await page.getByRole('link', { name: 'Team', exact: true }).count()
const hulpLink = await page.getByRole('link', { name: /Veelgestelde vragen/ }).count()
eis('Team en Hulp bereikbaar vanaf het overzicht', teamLink > 0 && hulpLink > 0,
  `team=${teamLink} hulp=${hulpLink}`)

await page.goto(`${base}#/paginas`, { waitUntil: 'load' })
await page.waitForTimeout(500)
eis('/paginas redirect naar het overzicht', page.url().endsWith('#/'), page.url().split('#')[1])

eis('geen consolefouten tijdens de controle', fouten.length === 0, [...new Set(fouten)].join(' | '))

await browser.close()

let mis = 0
for (const r of uitslag) {
  if (!r.ok) mis++
  console.log(`${r.ok ? '  ok' : 'FAIL'}  ${r.naam}${r.detail ? `  (${r.detail})` : ''}`)
}
console.log(mis ? `\n${mis} eis(en) niet gehaald` : '\nalle eisen gehaald')
process.exit(mis ? 1 : 0)
