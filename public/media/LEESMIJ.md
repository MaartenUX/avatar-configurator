# Media

De video's en foto's worden niet in de bundel gebakken maar als losse
bestanden geserveerd: ze maken een bundel onwerkbaar groot. Daarom is de build
een map en geen los bestand.

| Pad | Inhoud | Staat erin |
|---|---|---|
| `avatars/{nl,en,tr,ar}.webm` | Bewegende avatar met lipsync en stem, vrijstaand (VP9 met alfakanaal), ± 3 s | ja |
| `demo/demo.mp4` | De demovideo: staand, 1080×1920, 52 s, alle vier de avatars achter elkaar | ja |
| `backgrounds/kantoor-{1,2}.jpg` | De twee standaard kantoorshots: staand uitgesneden, leeg, licht geblurd | ja |

De vier clips horen elk bij één avatar, want ze zijn met dat gezicht opgenomen:
`nl` bij Daan, `en` bij Emma, `tr` bij Zeynep en `ar` bij Omar. Die koppeling
staat in `src/lib/assets.ts`. De andere avatars hebben geen clip en vallen
terug op het portret met de pulsanimatie.

De demovideo is één bestand voor alle talen: hij laat de avatars zelf na elkaar
zien. De voorbeeldtekst die bij de nagebootste weergave hoort staat in
`src/data/demo.ts` en noemt de gemeente niet.

De kantoorshots wisselen elkaar af over de zes scènes (1-2-1-2-1-2) en komen
ook in de demovideo terug, zodat de preview en de demo hetzelfde laten zien.

Let op: een vrijstaande VP9-clip speelt in Chrome en Firefox. Safari toont hem
met een zwarte achtergrond; voer de test in Chrome uit.
