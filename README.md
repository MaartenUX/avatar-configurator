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
node scripts/scenario-check.mjs "file://$PWD/dist/index.html"            # de vier scenario's
```

Voeg `--shots` toe aan `verify.mjs` voor screenshots van elke route in `shots/`.

## Handig tijdens de test

| | |
|---|---|
| `#/kit` | alle componenten, tokens, content en state op één pagina |
| `?fast=1` | alle mock-timers naar 1 seconde |
| `?scenario=eerste` | eerste keer: nog geen configuratie |
| `?scenario=tweede` | één pagina in productie, twee live |
| `?scenario=derde` | alles live |
| `?scenario=emre` | zelfde data als tweede, gezien door de Turkse collega |
| `?reset=1` | het huidige scenario terugzetten naar zijn beginstand |

Je kunt het scenario ook rechtsboven in de header kiezen. Elke stand wordt vers
opgebouwd, dus wat je in de ene doet lekt niet door naar de andere.

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
