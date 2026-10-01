# Media

Hier komen de bestanden die Sebastiaan aanlevert. Ze worden niet in de bundel
gebakken maar als losse bestanden geserveerd, want video's maken een
single-file build onwerkbaar groot.

| Pad | Inhoud |
|---|---|
| `avatars/{avatar-id}.webm` | Bewegende avatar met lipsync en stem, zonder achtergrond, ± 5 s. Acht stuks: nl-sanne, nl-daan, en-emma, en-james, tr-zeynep, tr-mehmet, ar-nour, ar-omar. `.mp4` mag ook. |
| `demo/{nl,en,tr,ar}.mp4` | Volledige demovideo per taal: portrait, 6 scènes, camerawissel, kantoorachtergrond, demotekst zonder gemeentenaam. |
| `widget/button.png` | De echte widget-knop, liggend, zonder achtergrond. |

Zolang een bestand ontbreekt valt de app terug op de bestaande mock: de
avatartegel pulseert, de demo speelt het nagebootste videoframe, en de
widget-knop wordt opgebouwd uit de losse avatarportretten.
