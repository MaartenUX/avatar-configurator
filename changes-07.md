# CHANGES-07 — achtergronden, lege staten en URL-veld

XS2Content × ReadSpeaker · 12 okt 2026 · voor Claude Code

> Geldt bovenop `PLAN.md` en `CHANGES-01` t/m `CHANGES-06`. Bij tegenspraak wint dit bestand; A vervangt CHANGES-06 D9. Werk af in volgorde, vink af in `DECISIONS.md` na een check in de browser.

---

## A. Configurator — scèneachtergronden (vervangt CHANGES-06 D9)

1. **Volgorde van de keuze:** *Standaard kantoorshots* (aanbevolen) staat links, *Personaliseer met eigen foto's* rechts. De personaliseer-tegel krijgt een label-pill **"TIP"** (blue-tint/blue-shade) in plaats van niets, en de tekst uit CHANGES-02 C17 ("Een leuke manier om de video's persoonlijker te maken …").
2. **Uploadtegels per scène (bij Personaliseer):** scène 1 en 2 tonen de **twee echte achtergrondfoto's** uit `public/media/backgrounds/` (CHANGES-04 A2); scène 3 t/m 6 tonen de **voorbeeldfoto's** uit CHANGES-06 D8 (park, winkelstraat, bibliotheek, plein). Allemaal staand, licht geblurd, avatar als silhouet ervoor.

## B. Overzicht — lege staat na vastleggen

3. Scenario *Esmee — eerste keer* na "Instellingen vastleggen" toont nu een leeg overzicht zonder uitleg. Daar komt een lege-staat-kaart onder de `LockedBanner`, gecentreerd, zelfde stijl als "Start de configuratie":
   - h2 **"Maak je eerste uitlegvideo"**
   - body: "Voeg een pagina van je website toe. Wij maken de samenvatting; jij controleert hem en je collega's doen hun taal."
   - primaire knop **"+ Pagina toevoegen"** → `/paginas/nieuw`
   - eronder body-sm gray-3: "Dit wordt video 1 van 10."
   De koppen "In productie" en "Live" blijven weg zolang er geen pagina's zijn.

## C. S0 Pagina toevoegen — URL-veld

4. Het URL-veld is bij openen **leeg**, met placeholder "https://www.bergrode.nl/…". Bij **focus** (klik of tab) vult het veld zich met `https://www.bergrode.nl/parkeervergunning-bewoners` — de pagina uit de testtaak — zodat de tester niet hoeft te typen. Daarna gewoon bewerkbaar; bij wissen komt de placeholder terug, niet opnieuw de voorinvulling.

---

## Bewust geïnterpreteerd — Maarten checkt

- **A1:** "als tweede optie en als tip" gelezen als: personaliseer rechts, met een TIP-label. Aanbevolen blijft bij standaard.
- **A2:** "die foto's op 1 en 2, daarna de mock-ups" toegepast op de zes scène-tegels onder *Personaliseer*. Als je de twee echte foto's bedoelde als visual op de keuzetegel *Standaard kantoorshots* zelf, zeg het.
- **C4:** voorinvullen bij focus, niet bij laden, zodat het veld een echte lege staat heeft. De URL is die van testtaak (b).
