/**
 * Controleert dat de aangeleverde media echt gebruikt wordt en dat de
 * terugvalweergave niet meer verschijnt waar een bestand bestaat (CHANGES-04 A1).
 */
import { chromium } from 'playwright'
import { serveer } from './serve.mjs'

const { url: base } = await serveer(process.argv[2] ?? 'dist')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const fouten = []
const eis = (goed, tekst, detail = '') => {
  console.log(`${goed ? '  ok' : 'FAIL'}  ${tekst}${detail ? `  (${detail})` : ''}`)
  if (!goed) fouten.push(tekst)
}

// De bestanden worden geserveerd.
for (const pad of ['media/avatars/nl-daan.webm', 'media/avatars/nl-sanne.webm',
                   'media/avatars/en-emma.webm', 'media/avatars/en-james.webm',
                   'media/avatars/tr-zeynep.webm', 'media/avatars/tr-mehmet.webm',
                   'media/avatars/ar-omar.webm', 'media/demo/demo.mp4',
                   'media/backgrounds/kantoor-1.jpg', 'media/backgrounds/kantoor-2.jpg']) {
  const r = await page.request.get(`${base}/${pad}`)
  eis(r.ok(), `${pad} wordt geserveerd`, `${r.status()}`)
}

// De avatartegel speelt de clip zelf af.
await page.goto(`${base}/?scenario=eerste#/`, { waitUntil: 'load' })
await page.waitForTimeout(400)
await page.goto(`${base}/#/configuratie`, { waitUntil: 'load' })
await page.waitForTimeout(600)
await page.locator('#sectie-avatars').scrollIntoViewIfNeeded()
await page.waitForTimeout(800)
await page.getByRole('button', { name: /Daan/ }).first().click()
await page.waitForTimeout(1400)
const clip = await page.evaluate(() => {
  const v = document.querySelector('video')
  return v ? { src: v.currentSrc, tijd: v.currentTime, breed: v.videoWidth } : null
})
eis(Boolean(clip?.src.includes('/media/avatars/nl-daan.webm')), 'de tegel van Daan speelt zijn eigen clip',
  clip?.src?.split('/media/').pop())
eis((clip?.tijd ?? 0) > 0, 'de clip loopt echt', `${clip?.tijd?.toFixed(2)} s`)
await page.screenshot({ path: 'shots/media-avatarclip.png' })

// De achtergrond komt uit public/media. De preview bij sectie 3 toont hem altijd.
await page.locator('#sectie-scenes').scrollIntoViewIfNeeded()
await page.waitForTimeout(900)
const achtergrond = await page.evaluate(() =>
  [...document.querySelectorAll('*')]
    .map((el) => getComputedStyle(el).backgroundImage)
    .find((b) => b && b.includes('/media/backgrounds/')),
)
eis(Boolean(achtergrond), 'de preview gebruikt de nieuwe kantoorshots', achtergrond?.slice(0, 60))

console.log(fouten.length ? `\n${fouten.length} fout(en)` : '\nalles gekoppeld')
await browser.close()
process.exit(fouten.length ? 1 : 0)
