/**
 * Snijdt de transparante rand rond een avatarportret weg.
 *
 * De aangeleverde beelden zijn liggend met de figuur klein in het midden; ruim
 * 70% is leegte. Daardoor moet elke plek in de UI raden hoe ver hij moet
 * inzoomen. Na het trimmen omsluit het bestand de figuur precies, en kan
 * overal object-contain gebruikt worden zonder bij te snijden.
 *
 *   node scripts/trim-avatars.mjs src/assets/avatars/*.png
 */
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'
import { basename } from 'node:path'

const browser = await chromium.launch()
const page = await browser.newPage()

for (const file of process.argv.slice(2)) {
  const b64 = readFileSync(file).toString('base64')
  const out = await page.evaluate(async (dataUrl) => {
    const img = new Image()
    img.src = dataUrl
    await img.decode()

    const c = document.createElement('canvas')
    c.width = img.width
    c.height = img.height
    const ctx = c.getContext('2d', { willReadFrequently: true })
    ctx.drawImage(img, 0, 0)
    const px = ctx.getImageData(0, 0, c.width, c.height).data

    let top = c.height, left = c.width, right = -1, bottom = -1
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        // Drempel iets boven nul: JPEG-achtige ruis in de alfarand negeren.
        if (px[(y * c.width + x) * 4 + 3] < 8) continue
        if (x < left) left = x
        if (x > right) right = x
        if (y < top) top = y
        if (y > bottom) bottom = y
      }
    }
    if (right < 0) return null

    const w = right - left + 1
    const h = bottom - top + 1
    const t = document.createElement('canvas')
    t.width = w
    t.height = h
    t.getContext('2d').drawImage(c, left, top, w, h, 0, 0, w, h)
    return { url: t.toDataURL('image/png'), was: `${c.width}x${c.height}`, now: `${w}x${h}` }
  }, `data:image/png;base64,${b64}`)

  if (!out) {
    console.log(`  ${basename(file)}: leeg, overgeslagen`)
    continue
  }
  writeFileSync(file, Buffer.from(out.url.split(',')[1], 'base64'))
  console.log(`  ${basename(file).padEnd(24)} ${out.was} → ${out.now}`)
}

await browser.close()
