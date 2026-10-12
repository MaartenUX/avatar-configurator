# Media

De video's en foto's worden niet in de bundel gebakken maar als losse
bestanden geserveerd: ze maken een bundel onwerkbaar groot. Daarom is de build
een map en geen los bestand.

| Pad | Inhoud | Staat erin |
|---|---|---|
| `avatars/{avatar-id}.webm` | Bewegende avatar met lipsync en stem, vrijstaand (VP9 met alfakanaal), ± 3 s | 7 van de 8 |
| `demo/demo.mp4` | De demovideo: staand, 1080×1920, 52 s, alle vier de avatars achter elkaar | ja |
| `backgrounds/kantoor-{1,2}.jpg` | De twee standaard kantoorshots: staand uitgesneden, leeg, licht geblurd | ja |

Een clip heet naar de avatar waar hij bij hoort, want hij is met dat gezicht
opgenomen. `ar-nour.webm` ontbreekt nog — dat is de Arabische vrouw; zonder dat
bestand pulseert haar tegel zoals voorheen. Welke avatars een clip hebben staat
in `src/lib/assets.ts`.

De acht avatars delen vier gezichten: Heygen levert er niet meer. Het portret
in de tegel volgt daarom altijd de clip, zodat je ziet wie je hoort. Nederlands
en Engels tonen dezelfde twee mensen, en de Turkse en Arabische man zijn
dezelfde — dat is ook hoe het echte product werkt: één avatar spreekt meer
talen.

De demovideo is één bestand voor alle talen: hij laat de avatars zelf na elkaar
zien. De voorbeeldtekst die bij de nagebootste weergave hoort staat in
`src/data/demo.ts` en noemt de gemeente niet.

De kantoorshots wisselen elkaar af over de zes scènes (1-2-1-2-1-2) en komen
ook in de demovideo terug, zodat de preview en de demo hetzelfde laten zien.

Let op: een vrijstaande VP9-clip speelt in Chrome en Firefox. Safari toont hem
met een zwarte achtergrond; voer de test in Chrome uit.
