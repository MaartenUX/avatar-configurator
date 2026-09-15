/**
 * Verpakt de single-file build tot een artifact-pagina.
 *
 * De Artifact-publicatie zet er zelf <!doctype>, <html>, <head> en <body>
 * omheen, terwijl dist/index.html al een compleet document is. Dat zou
 * genest raken. Dit script haalt de inhoud eruit en zet hem in de volgorde
 * die de host verwacht: eerst de titel (die wordt in de eerste 8 KB gezocht),
 * dan de fonts, dan de stijlen, dan de pagina, en het script als laatste.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const bron = readFileSync('dist/index.html', 'utf8')

const pak = (re) => [...bron.matchAll(re)].map((m) => m[0])

const titel = bron.match(/<title>[\s\S]*?<\/title>/)?.[0] ?? '<title>Uitlegvideo’s</title>'
const links = pak(/<link\b[^>]*>/g).filter((l) => l.includes('fonts.g'))
const stijlen = pak(/<style\b[^>]*>[\s\S]*?<\/style>/g)
const scripts = pak(/<script\b[^>]*>[\s\S]*?<\/script>/g)

const body = bron.slice(bron.indexOf('<body>') + 6, bron.indexOf('</body>'))
const bodyZonderScript = body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').trim()

const uit = [
  titel,
  ...links,
  ...stijlen,
  bodyZonderScript,
  // De wrapper levert zijn eigen <html>, dus de taal zetten we hier.
  '<script>document.documentElement.lang = "nl"</script>',
  ...scripts,
].join('\n')

// Niet in dist/: daar hoort alleen index.html te staan.
mkdirSync('artifact', { recursive: true })
writeFileSync('artifact/index.html', uit)

const kb = (n) => `${Math.round(n / 1024)} KB`
console.log(`artifact/index.html  ${kb(uit.length)}`)
console.log(`  titel op positie ${uit.indexOf('<title>')} (moet < 8192)`)
console.log(`  ${links.length} fontlinks · ${stijlen.length} stijlblok(ken) · ${scripts.length} script(s)`)
