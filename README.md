# Avatar-configurator

Klikbaar prototype voor een gebruikerstest. Geen backend; alle wachttijden zijn
gemockt.

```bash
npm install
npm run dev          # http://localhost:5174
npm test             # smoke-test alle routes + timer-logica
npm run typecheck
npm run build        # dist/index.html — één bestand, opent zonder server
```

## Controlescripts

Draaien tegen de dev-server of tegen de single-file build vanaf `file://`.

```bash
node scripts/verify.mjs      "file://$PWD/dist/index.html"   # alle routes + consolefouten
node scripts/productie-flow.mjs "file://$PWD/dist/index.html" # testtaken b en c
node scripts/publiceer-flow.mjs "file://$PWD/dist/index.html" # testtaak d
node scripts/config-flow.mjs "file://$PWD/dist/index.html"   # testtaak a
node scripts/polish-check.mjs "file://$PWD/dist/index.html"  # RTL, 1280 en 1440, lege staat
node scripts/dod-check.mjs   "file://$PWD/dist/index.html" "$PWD/dist"  # eisen uit het bouwplan
```

Voeg `--shots` toe aan `verify.mjs` voor screenshots van elke route in `shots/`.

## Handig tijdens de test

| | |
|---|---|
| `#/kit` | alle componenten, tokens, content en state op één pagina |
| `?fast=1` | alle mock-timers naar 1 seconde |
| `?reset=1` | terug naar de seed-staat |
| `?reset=empty` | terug naar de lege staat (eerste keer) |

Vlaggen werken zowel vóór als achter de hash: `index.html?fast=1#/` en
`index.html#/?fast=1`.

## Assets

Portretten staan in `src/assets/avatars/` en heten naar het **gezicht**, niet
naar de avatar: `vrouw-turks.png`, `man-grijs.png`. Meerdere avatars kunnen
hetzelfde gezicht gebruiken — welke, staat in het `face`-veld in
`src/data/avatars.ts`. Zo hoef je een gezicht dat in meer talen terugkomt maar
één keer aan te leveren.

Eisen aan een portret: PNG met **transparante** achtergrond, figuur staand,
tot ongeveer het middel. Lever hem gerust ruim aan; `scripts/trim-avatars.mjs`
snijdt de lege rand eromheen weg zodat elk kader hem goed kan schalen:

```bash
node scripts/trim-avatars.mjs src/assets/avatars/nieuw-gezicht.png
```

`silhouet.png` is de grijze placeholder die verschijnt zolang er voor een taal
nog niets gekozen is. Achtergronden heten `kantoor-1.jpg` tot en met
`kantoor-4.jpg`; stemfragmenten `src/assets/voices/{avatar-id}.mp3`, dus
`tr-zeynep.mp3`.

Houd portretten onder de 45 KB en achtergronden onder de 150 KB: de single-file
build bakt elk bestand als base64 in `dist/index.html` en maakt ze daarbij ruim
een derde zwaarder. Op `#/kit`, tabblad Tokens, staat geteld wat er ligt.
