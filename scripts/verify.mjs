/**
 * Laadt de app in een echte browser en controleert of hij mount, of er
 * consolefouten zijn en of de opgegeven routes renderen. Draait tegen een
 * dev-server (http://...) of tegen de single-file build (file://...).
 *
 *   node scripts/verify.mjs file:///.../dist/index.html
 *   node scripts/verify.mjs http://localhost:5174 --shots
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const base = process.argv[2] ?? 'http://localhost:5174'
const wantShots = process.argv.includes('--shots')
const outDir = 'shots'

const ROUTES = [
  ['/kit', 'Componenten en tokens'],
  ['/', 'Bergrode'],
  ['/team', 'Team'],
  ['/hulp', 'Hulp'],
  ['/configuratie', 'Configuratie'],
  ['/paginas/p-bijstand', null],
  ['/paginas/nieuw', 'Pagina toevoegen'],
  ['/paginas/p-bijstand/samenvatting', 'Basissamenvatting'],
  ['/paginas/p-bijstand/tr', 'Turks'],
  ['/paginas/p-bijstand/video/tr', 'Turks'],
]

if (wantShots) mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const errors = []
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(`console: ${m.text()}`)
})
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))

let failures = 0
for (const [route, expect] of ROUTES) {
  const url = `${base}#${route}`
  await page.goto(url, { waitUntil: 'load' })
  await page.waitForTimeout(250)

  const mounted = await page.$eval('#root', (el) => el.children.length > 0).catch(() => false)
  const text = await page.textContent('body')
  const ok = mounted && (!expect || text.includes(expect))

  console.log(`${ok ? '  ok' : 'FAIL'}  ${route}${expect ? `  ("${expect}")` : ''}`)
  if (!ok) failures++

  if (wantShots) {
    const name = route === '/' ? 'overzicht' : route.replace(/^\//, '').replace(/\//g, '-')
    await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: true })
  }
}

await browser.close()

console.log('')
if (errors.length) {
  console.log(`consolefouten (${errors.length}):`)
  for (const e of [...new Set(errors)]) console.log(`  ${e}`)
} else {
  console.log('consolefouten: geen')
}
console.log(failures ? `\n${failures} route(s) mislukt` : '\nalle routes ok')
process.exit(failures || errors.length ? 1 : 0)
