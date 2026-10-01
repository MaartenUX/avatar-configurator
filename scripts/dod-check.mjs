/**
 * Definition of done uit §11 van het bouwplan, gecontroleerd in een echte
 * browser tegen het gebouwde bestand.
 */
import { chromium } from 'playwright'
import { serveer } from './serve.mjs'
import { globSync, readFileSync, readdirSync } from 'node:fs'

const dist = process.argv[2] ?? 'dist'
const { url: base } = await serveer(dist)
const browser = await chromium.launch()
const uitslag = []
const eis = (naam, ok, detail = '') =>
  uitslag.push({ naam, ok, detail })

// 1. De build is een map met index.html, de assets en de media (PLAN par. 3
// en 11 aangepast door CHANGES-03 H).
const bestanden = readdirSync(dist).sort()
eis('build bevat index.html en assets', bestanden.includes('index.html') && bestanden.includes('assets'),
  bestanden.join(', '))

const html = readFileSync(`${dist}/index.html`, 'utf8')
eis('index.html blijft klein', html.length < 64 * 1024, `${Math.round(html.length / 1024)} KB`)

const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const fouten = []
page.on('pageerror', (e) => fouten.push(e.message))
page.on('console', (m) => m.type() === 'error' && fouten.push(m.text()))

// 2. Opent vanaf file:// zonder server.
await page.goto(`${base}#/`, { waitUntil: 'load' })
await page.waitForTimeout(600)
eis('mount zonder fouten', (await page.$eval('#root', (e) => e.children.length)) > 0)

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
const verboden = [
  'lorem', 'summary', 'translate', 'pipeline', 'credit',
  // CHANGES-03 A3 en C8: één lengte, geen keuze tussen vast en adaptief.
  'adaptief', 'adaptieve', 'vaste samenvatting', '3 minuten', 'drie minuten',
]
const gevonden = new Set()
for (const route of ['/', '/configuratie', '/paginas/nieuw', '/team', '/hulp',
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

// 7. De voettekst op een paginakaart herhaalt geen knop die er al staat,
// maar blijft wel de enige ingang waar de taalregels er geen hebben.
await page.goto(`${base}?fast=1&scenario=tweede#/`, { waitUntil: 'load' })
await page.waitForTimeout(500)
const kaarten = await page.textContent('body')
eis('geen dubbele knop op een kaart met rijacties', !kaarten.includes('Controleer video Turks'))
eis('rijacties staan er wel', kaarten.includes('Controleer video'))

// 8. De stappenbalk noemt de sectie waar je bent.
await page.goto(`${base}?fast=1&scenario=eerste#/configuratie`, { waitUntil: 'load' })
await page.waitForTimeout(600)
const cfg = await page.textContent('body')
eis('stappenbalk noemt de sectietitel', cfg.includes('Stap 1 van 6') && cfg.includes('Taalniveau en talen'))

// 9. Elk shell-scherm is bereikbaar zonder zijbalk.
await page.goto(`${base}#/`, { waitUntil: 'load' })
await page.waitForTimeout(400)
const teamLink = await page.getByRole('link', { name: 'Team', exact: true }).count()
const hulpLink = await page.getByRole('link', { name: /Veelgestelde vragen/ }).count()
eis('Team en Hulp bereikbaar vanaf het overzicht', teamLink > 0 && hulpLink > 0,
  `team=${teamLink} hulp=${hulpLink}`)

await page.goto(`${base}#/paginas`, { waitUntil: 'load' })
await page.waitForTimeout(500)
eis('/paginas redirect naar het overzicht', page.url().endsWith('#/'), page.url().split('#')[1])

// 10. CHANGES-03 G30. Geen liggend videoframe meer: aspect-video bestaat niet
// meer in de broncode, en de schermen met een video tonen een staand kader.
const bronnen = globSync('src/**/*.tsx')
const liggend = bronnen.filter((f) => /aspect-video|aspect-\[16\/9\]/.test(readFileSync(f, 'utf8')))
eis('geen liggend videoframe in de broncode', liggend.length === 0, liggend.join(', '))

const staandOp = async (route) => {
  await page.goto(`${base}?fast=1&scenario=tweede#${route}`, { waitUntil: 'load' })
  await page.waitForTimeout(500)
  return page.evaluate(() =>
    [...document.querySelectorAll('[class*="aspect-[9/16]"]')].some((el) => {
      const r = el.getBoundingClientRect()
      return r.height > r.width
    }),
  )
}
eis('de beheerpagina toont staande video’s', await staandOp('/paginas/p-bijstand'))
eis('de videocontrole toont een staand kader', await staandOp('/paginas/p-bijstand/video/tr'))

// 11. Geen scènetitels: de seed heeft per pagina één titel, die van de pagina.
const paginas = globSync('src/data/pages/*.ts')
const metTitel = paginas.filter((f) => (readFileSync(f, 'utf8').match(/\btitle:/g) ?? []).length !== 1)
eis('geen scènetitels in de seed', metTitel.length === 0, metTitel.join(', '))

await page.goto(`${base}?fast=1&scenario=tweede#/paginas/p-bijstand/samenvatting`, { waitUntil: 'load' })
await page.waitForTimeout(500)
const scenes = await page.textContent('body')
eis('intro- en outroscène staan in de samenvatting',
  scenes.includes('Intro') && scenes.includes('Outro') && scenes.includes('Scène 2'))

// 12. Na akkoord op de basissamenvatting staan álle talen op "Controleer script".
await page.goto(`${base}?fast=1&scenario=tweede#/paginas/p-bijstand/samenvatting`, { waitUntil: 'load' })
await page.waitForTimeout(500)
await page.getByRole('button', { name: 'Akkoord', exact: true }).click()
await page.waitForTimeout(1800)
const klaarVoorScript = await page.getByRole('link', { name: 'Controleer script' }).count()
eis('alle talen staan op "Controleer script"', klaarVoorScript >= 4, `${klaarVoorScript} talen`)

// 13. Het demowachtscherm is te verlaten en komt terug via het overzicht. De
// timer zetten we rechtstreeks in de bewaarde state; de rest is echte tijd.
await page.goto(`${base}?scenario=eerste#/configuratie`, { waitUntil: 'load' })
await page.waitForTimeout(600)
await page.evaluate(() => {
  const bewaard = JSON.parse(localStorage.getItem('avatar-proto-v1'))
  bewaard.state.config.demoTimer = { kind: 'demo', startedAt: Date.now() }
  bewaard.state.config.demoKlaar = false
  localStorage.setItem('avatar-proto-v1', JSON.stringify(bewaard))
})
await page.goto(`${base}#/configuratie`, { waitUntil: 'load' })
await page.waitForTimeout(700)
const terugKnop = page.getByRole('link', { name: 'Terug naar het overzicht' })
eis('het demowachtscherm is meteen te verlaten', (await terugKnop.count()) > 0 && (await terugKnop.isEnabled()))

await terugKnop.click()
await page.waitForTimeout(600)
eis('het overzicht meldt dat de demo loopt',
  (await page.textContent('body')).includes('Demovideo wordt gemaakt'))

await page.waitForTimeout(8500)
eis('het overzicht meldt dat de demo klaar is',
  (await page.textContent('body')).includes('Demo klaar'))

eis('geen consolefouten tijdens de controle', fouten.length === 0, [...new Set(fouten)].join(' | '))

await browser.close()

let mis = 0
for (const r of uitslag) {
  if (!r.ok) mis++
  console.log(`${r.ok ? '  ok' : 'FAIL'}  ${r.naam}${r.detail ? `  (${r.detail})` : ''}`)
}
console.log(mis ? `\n${mis} eis(en) niet gehaald` : '\nalle eisen gehaald')
process.exit(mis ? 1 : 0)
