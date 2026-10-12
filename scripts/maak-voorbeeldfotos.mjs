/**
 * Maakt de zes voorbeeldfoto's voor "Personaliseer met eigen foto's"
 * (CHANGES-06 D8). Het zijn illustraties, geen foto's: zo hoeft er geen
 * beeldmateriaal van derden in de repo en klopt het rechtenverhaal.
 *
 * Elke scène is een stapel gekleurde vlakken in de browser, staand uitgesneden
 * en zwaar geblurd — precies hoe een achtergrond achter de avatar oogt.
 *
 *   node scripts/maak-voorbeeldfotos.mjs
 */
import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const uit = 'public/media/examples'
const BREED = 720
const HOOG = 1280

/** Per scène: een lucht/plafondkleur, een vloerkleur en wat vormen ertussen. */
const SCENES = {
  gemeentehuis: {
    boven: 'linear-gradient(#cfe0ee, #eaf1f6)',
    onder: '#d9d3c7',
    vormen: `
      <div style="position:absolute;left:6%;right:6%;top:18%;height:46%;background:#c8b9a4"></div>
      ${rij(10, 22, 58, '#8fa7b8')}
      <div style="position:absolute;left:18%;right:18%;top:64%;height:14%;background:#e3ded3"></div>
      <div style="position:absolute;left:46%;top:8%;width:3%;height:12%;background:#9a9a9a"></div>
      <div style="position:absolute;left:49%;top:9%;width:10%;height:5%;background:#d9643c"></div>`,
  },
  park: {
    boven: 'linear-gradient(#cfe4f2, #e8f3e4)',
    onder: '#a9c08a',
    vormen: `
      ${bol(18, 34, 26, '#6f9d63')}${bol(62, 28, 30, '#5d8f55')}${bol(38, 44, 22, '#80ad6e')}
      <div style="position:absolute;left:20%;top:52%;width:5%;height:20%;background:#8a7152"></div>
      <div style="position:absolute;left:64%;top:48%;width:5%;height:24%;background:#8a7152"></div>
      <div style="position:absolute;left:30%;right:14%;top:74%;height:26%;background:#cfc3a6;transform:skewX(-12deg)"></div>`,
  },
  winkelstraat: {
    boven: 'linear-gradient(#dce7f0, #f0ead9)',
    onder: '#c9c3bb',
    vormen: `
      <div style="position:absolute;left:0;top:14%;width:46%;height:52%;background:#d8c4a8"></div>
      <div style="position:absolute;right:0;top:10%;width:44%;height:56%;background:#c6b7a6"></div>
      ${rij(6, 20, 34, '#8aa0ae')}
      <div style="position:absolute;left:2%;top:46%;width:40%;height:7%;background:#cf6f4e"></div>
      <div style="position:absolute;right:2%;top:42%;width:38%;height:7%;background:#4e7f84"></div>`,
  },
  bibliotheek: {
    boven: 'linear-gradient(#efe6d8, #e6dccb)',
    onder: '#b9a98f',
    vormen: `
      ${plank(16)}${plank(34)}${plank(52)}
      <div style="position:absolute;left:0;right:0;top:70%;height:4%;background:#9c8straat"></div>`,
  },
  sporthal: {
    boven: 'linear-gradient(#e7ecef, #dfe6ea)',
    onder: '#d7a86a',
    vormen: `
      <div style="position:absolute;left:0;right:0;top:0;height:22%;background:#cfd8dd"></div>
      ${rij(8, 6, 12, '#f2f6f8')}
      <div style="position:absolute;left:0;right:0;top:58%;height:2%;background:#f3f1ec"></div>
      <div style="position:absolute;left:18%;right:18%;top:66%;height:30%;border:10px solid #f3f1ec;border-bottom:0"></div>`,
  },
  plein: {
    boven: 'linear-gradient(#cfe2f2, #edf2f4)',
    onder: '#cac4ba',
    vormen: `
      <div style="position:absolute;left:0;right:0;top:26%;height:22%;background:#b9bfc4"></div>
      ${rij(8, 30, 14, '#8fa3b2')}
      <div style="position:absolute;left:40%;top:52%;width:20%;height:16%;border-radius:50%;background:#aebfc9"></div>
      <div style="position:absolute;left:47%;top:40%;width:6%;height:16%;background:#9fb0ba"></div>`,
  },
}

function rij(aantal, top, hoogte, kleur) {
  return Array.from({ length: aantal }, (_, i) => {
    const breedte = 100 / (aantal * 1.9)
    const links = 4 + i * ((100 - 8) / aantal)
    return `<div style="position:absolute;left:${links}%;top:${top}%;width:${breedte}%;height:${hoogte / 4}%;background:${kleur}"></div>`
  }).join('')
}

function bol(links, top, maat, kleur) {
  return `<div style="position:absolute;left:${links}%;top:${top}%;width:${maat}%;height:${maat * 0.9}%;border-radius:50%;background:${kleur}"></div>`
}

function plank(top) {
  const boeken = Array.from({ length: 14 }, (_, i) => {
    const kleuren = ['#8f5b4a', '#4a6b8f', '#6b8f5b', '#8f7f4a', '#7a4a8f', '#4a8f86']
    return `<div style="width:${4 + (i % 3)}%;height:100%;background:${kleuren[i % kleuren.length]}"></div>`
  }).join('')
  return `<div style="position:absolute;left:4%;right:4%;top:${top}%;height:14%;display:flex;gap:1%;align-items:flex-end">${boeken}</div>
          <div style="position:absolute;left:2%;right:2%;top:${top + 14}%;height:2%;background:#7d6a4f"></div>`
}

const html = (scene) => `<!doctype html><html><body style="margin:0">
  <div style="position:relative;width:${BREED}px;height:${HOOG}px;overflow:hidden;background:${scene.boven}">
    <div style="position:absolute;left:0;right:0;bottom:0;height:34%;background:${scene.onder}"></div>
    ${scene.vormen}
  </div></body></html>`

const exec = promisify(execFile)
await mkdir(uit, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: BREED, height: HOOG } })

for (const [naam, scene] of Object.entries(SCENES)) {
  await page.setContent(html(scene))
  const png = `${uit}/${naam}.png`
  await page.screenshot({ path: png })
  // Blurren en als jpeg wegschrijven; de app blurt in CSS nog een beetje mee.
  await exec('ffmpeg', ['-v', 'error', '-y', '-i', png, '-vf', 'gblur=sigma=14', '-q:v', '6', `${uit}/${naam}.jpg`])
  await exec('rm', [png])
  console.log('  ok ', `${naam}.jpg`)
}

await browser.close()
await writeFile(`${uit}/LEESMIJ.md`, `# Voorbeeldfoto's

Illustraties, geen foto's: gemaakt door \`scripts/maak-voorbeeldfotos.mjs\`.
Ze staan achter de uploadtegels bij "Personaliseer met eigen foto's" en laten
zien wat voor beeld daar kan staan. Rechtenvrij, want zelfgemaakt.
`)
process.exit(0)
