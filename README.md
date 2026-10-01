# Avatar-configurator

Klikbaar prototype voor een gebruikerstest. Geen backend; alle wachttijden zijn
gemockt.

```bash
npm install
npm run dev          # http://localhost:5174
npm test             # smoke-test alle routes + timer-logica
npm run typecheck
npm run build        # dist/ — een mapje; serveer het, bijvoorbeeld met scripts/serve.mjs
```

De build is een map en geen los bestand: de video's in `public/media/` worden
als losse bestanden geserveerd, want ingebakken maken ze de bundel onwerkbaar
groot.

## Controlescripts

Elk script start zelf een kleine webserver op de map die je meegeeft; zonder
argument is dat `dist`. Bouw dus eerst.

```bash
node scripts/verify.mjs dist          # alle routes + consolefouten
node scripts/productie-flow.mjs dist  # testtaken b en c
node scripts/publiceer-flow.mjs dist  # testtaak d
node scripts/config-flow.mjs dist     # testtaak a
node scripts/polish-check.mjs dist    # RTL, 1280 en 1440, lege staat
node scripts/dod-check.mjs dist       # eisen uit het bouwplan
node scripts/scenario-check.mjs dist  # de vier scenario's
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

Vlaggen werken zowel vóór als achter de hash: `?fast=1#/` en `#/?fast=1`.

## Hosting

De repo staat op https://github.com/MaartenUX/avatar-configurator en is
gekoppeld aan Vercel: elke push naar `main` deployt vanzelf. `vercel.json`
regelt de build, de output en een catch-all rewrite naar `/`.

## Media

`public/media/` is de map waar de video's van Sebastiaan in gaan: de
avatarclips, de demovideo's per taal en de echte widget-knop. `LEESMIJ.md` in
die map noemt elk bestand. Zolang er een ontbreekt valt de app terug op de
bestaande mock, dus een bestand erin zetten is genoeg — er hoeft geen code mee.

Let op: een host die om de pagina heen een reset zet (`body { font: …; background: … }`)
wint van alles in `@layer base`, want ongelaagde CSS gaat vóór gelaagde. Daarom
staan lettertype, achtergrond en tekstkleur op `body` bewust buiten de laag in
`src/tokens/theme.css`.

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
`kantoor-3.jpg`; stemfragmenten `src/assets/voices/{avatar-id}.mp3`, dus
`tr-zeynep.mp3`.

Houd portretten onder de 45 KB en achtergronden onder de 150 KB: alles onder
de 4 KB wordt als base64 in de bundel gebakken en de rest wordt bij het laden
van de pagina opgehaald. Op `#/kit`, tabblad Tokens, staat geteld wat er ligt.
