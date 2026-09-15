# Avatar-configurator prototype

Klikbaar prototype voor XS2Content × ReadSpeaker: AI-uitlegvideo's met avatar
bij gemeentepagina's. Voor een gebruikerstest met 5 webredacteuren.
Persona: Esmee, webredacteur bij Gemeente Bergrode.

Lees `PLAN.md` voor het uitvoeringsplan en `DECISIONS.md` voor gemaakte keuzes.

## Taal

Alle UI-tekst, comments en commitberichten zijn Nederlands. Terminologie ligt
vast: *samenvatting*, *script*, *ondertiteling*, *pagina*, *video*, *credits*.
Nooit *summary*, *translate*, *run*, *pipeline*. Nergens lorem ipsum.

## Werkwijze

- Werk direct op `main`. Commit per checkpoint, geen branches, geen PR's.
- Push naar `origin` na elke commit: Vercel deployt vanaf `main`.
- Maak nooit zelf een branch aan zonder dat erom gevraagd is.
- Na elke wijziging: `npm run typecheck && npm test`.
- Visuele controle: `node scripts/verify.mjs <url> --shots`. Werkt zowel tegen
  de dev-server als tegen de single-file build vanaf `file://`.

## Regels die uit het bouwplan komen

- Statuskleuren komen altijd uit `src/tokens/status.ts`. Tailwind v4 scant
  broncode als tekst, dus classnamen nooit samenstellen uit variabelen.
- Timers slaan hun starttijd op, niet hun deadline. Nooit `setTimeout` voor
  state-overgangen; dat overleeft geen reload.
- Na élk akkoord terug naar het overzicht met een toast, behalve na publiceren.
  Die beslissing staat in `src/state/flow.ts`, niet in de schermen.
- De enige doorlopende keten is pagina toevoegen → wachten → samenvatting.
