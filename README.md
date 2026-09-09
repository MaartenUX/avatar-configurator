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

Portretten, stemfragmenten en kantoorshots worden aangeleverd. Droppen in
`src/assets/avatars/{id}.png`, `src/assets/voices/{id}.mp3` en
`src/assets/backgrounds/kantoor-{1..4}.jpg`. Er is geen codewijziging nodig:
`src/lib/assets.ts` pakt ze automatisch op en `#/kit` laat zien wat er ligt.
