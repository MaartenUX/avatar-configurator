# Avatar-configurator prototype

Klikbaar prototype voor XS2Content × ReadSpeaker: AI-uitlegvideo's met avatar
bij gemeentepagina's. Voor een gebruikerstest met 5 webredacteuren.
Persona: Esmee, webredacteur bij Gemeente Bergrode.

## Bron van waarheid

`PLAN.md` en de `changes-*.md`-bestanden zijn samen het ontwerp. Ze stapelen:
een later bestand wint van een eerder bestand waar ze elkaar tegenspreken, dus
**het hoogste nummer wint**. Lees ze op volgorde en begin bij het laatste.

`DECISIONS.md` legt vast wat er gebouwd is en waarom; het is een logboek, geen
opdracht. Controleer een punt dus altijd tegen de code, niet tegen DECISIONS.

CHANGES-01 en CHANGES-02 staan niet in de repo — die kwamen als losse prompts
binnen. Wat eruit gebouwd is, staat in DECISIONS.md.

## Taal

Alle UI-tekst, comments en commitberichten zijn Nederlands. Terminologie ligt
vast: *samenvatting*, *script*, *ondertiteling*, *pagina*, *video*, *credits*.
Nooit *summary*, *translate*, *run*, *pipeline*. Nergens lorem ipsum.

## Werkwijze

- Werk direct op `main`. Commit per checkpoint, geen branches, geen PR's.
- Push naar `origin` na elke commit: Vercel deployt vanaf `main`.
- Maak nooit zelf een branch aan zonder dat erom gevraagd is.
- Na elke wijziging: `npm run typecheck && npm test`.
- Visuele controle: de dev-server op `http://localhost:5174`, en
  `node scripts/verify.mjs dist` tegen de gebouwde map. Vink een punt pas af
  als het in de browser klopt.

## Regels die uit het bouwplan komen

- Statuskleuren komen altijd uit `src/tokens/status.ts`. Tailwind v4 scant
  broncode als tekst, dus classnamen nooit samenstellen uit variabelen.
- Timers slaan hun starttijd op, niet hun deadline. Nooit `setTimeout` voor
  state-overgangen; dat overleeft geen reload.
- Na élk akkoord terug naar het overzicht met een toast, behalve na publiceren.
  Die beslissing staat in `src/state/flow.ts`, niet in de schermen.
- De enige doorlopende keten is pagina toevoegen → wachten → samenvatting.
