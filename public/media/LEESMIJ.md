# Media

Hier komen de bestanden die Sebastiaan aanlevert. Ze worden niet in de bundel
gebakken maar als losse bestanden geserveerd: video's maken een bundel
onwerkbaar groot. Daarom is de build een map en geen los bestand.

| Pad | Inhoud |
|---|---|
| `avatars/{avatar-id}.webm` | Bewegende avatar met lipsync en stem, zonder achtergrond, ± 5 s. Acht stuks: nl-sanne, nl-daan, en-emma, en-james, tr-zeynep, tr-mehmet, ar-nour, ar-omar. `.mp4` mag ook. |
| `demo/{nl,en,tr,ar}.mp4` | Volledige demovideo per taal: portrait, 6 scènes, camerawissel, kantoorachtergrond, demotekst zonder gemeentenaam. |
| `widget/button.png` | De echte widget-knop, liggend, zonder achtergrond. |

De demovideo's worden gemaakt voor één vaste set: **Nederlands Sanne, Engels
Emma, Turks Mehmet, Arabisch Nour**, met kantoorshots en Camerawissel. Kiest
een tester iets anders, dan speelt de demo alsnog deze set — de tekst van de
demo staat in `src/data/demo.ts`.

Zolang een bestand ontbreekt valt de app terug op de bestaande mock: de
avatartegel pulseert, de demo speelt het nagebootste videoframe, en de
widget-knop wordt opgebouwd uit de losse avatarportretten.
