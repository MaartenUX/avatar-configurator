# CHANGES-03 — aanpassingen na review met Sebastiaan

XS2Content × ReadSpeaker · 21 sep 2026, bijgewerkt 1 okt · voor Claude Code

> Geldt bovenop `PLAN.md`, `CHANGES-01.md` en `CHANGES-02.md`. Bij tegenspraak wint dit bestand. Werk af in volgorde, vink af in `DECISIONS.md`. Doel van deze ronde: het prototype laat het échte product zien (portrait, max 2 minuten, geen lengtekeuze), zodat de test geen verkeerde verwachtingen wekt.

---

## A. Productwaarheid — geldt overal

1. **Alle video's zijn portrait (9:16).** `VideoPreview`, de videotegels en lightbox op de beheerpagina, de preview in de configurator, S5 en de demo: allemaal staand. Nergens meer een liggend videoframe.
2. **De widget-knop is liggend en heeft geen achtergrond**: de gekozen avatars vrijstaand naast elkaar, play-knop in het midden, knop in de opgehaalde huisstijlkleur. Klik → venster met de **portrait-player**, en **daaronder** de rij avatars als taalkeuze (actieve taal = blue ring). De avatars blijven altijd onder de player staan, ook tijdens afspelen.
3. **Eén lengte: maximaal 2 minuten.** Vervang elke "3 minuten", "6 minuten", "vast" en "adaptief" in copy, `learnmore.ts`, FAQ en seed. Ondertitel-tijdcodes lopen tot ± 2:00.
4. **Vaste scène-opbouw: 6 scènes** — scène 1 **intro** ("Dit is de samenvatting van de pagina …"), scènes 2–5 **inhoud**, scène 6 **outro** ("Dank je wel voor je aandacht …"). In copy naar de gebruiker: "4 tot 6 scènes". Het aantal scènes is nergens een keuze.
5. **Achtergronden zonder mensen.** Alle kantoorshots en voorbeeldbeelden: leeg interieur, staand uitgesneden, licht geblurd (CHANGES-01 F23 blijft). De huidige liggende achtergrond met meerdere personen vervalt.

## B. Header

6. Titel linksboven wordt alleen **"Uitlegvideo's"** — de toevoeging "voor gemeente Bergrode" (CHANGES-02 A1) vervalt. De rest van de header blijft zoals hij is.
7. In het zwarte Testscenario-kader (CHANGES-02 A3) komt links van het label een pill **"PROTOTYPE"** (label-stijl, gray-1 fill, wit).

## C. Configurator — sectie 3 wordt "Scènes en overgangen"

8. **De keuze Vaste / Adaptieve samenvatting vervalt volledig** (tegels, `AdviceBox`, LearnMore-tekst, `Config.videoType`). Sectie 3 heet nu **"Scènes en overgangen"**.
9. Ondertitel: "Een uitlegvideo duurt maximaal 2 minuten en bestaat uit 4 tot 6 korte scènes."
10. "Goed om te weten"-blok (direct onder de intro, CHANGES-02 B11): "We knippen de informatie in korte blokken. Dat houdt de aandacht vast. Elke video begint met een korte intro en eindigt met een outro. Tussen de scènes zit een overgang — die kies je hier."
11. Keuze, twee `ChoiceTile`s:
    - **Camerawissel** (aanbevolen) — "De camera wisselt per scène tussen dichtbij en verder weg. Rustig en filmisch."
    - **Logo tussen de scènes** — "Tussen twee scènes komt je logo kort in beeld."
    `AdviceBox` na keuze (CHANGES-02 B12): "Meest gekozen — Camerawissel. De video loopt door zonder onderbreking; kijkers haken minder snel af."
12. **Preview links**: het portrait-videoframe met daaronder een tijdlijn van 6 blokjes (intro · 4× inhoud · outro) en "max 2:00". Bij *Camerawissel*: het frame wisselt elke 2,5 s tussen normaal en ingezoomd (scale 1 → 1,35, 400 ms ease). Bij *Logo tussen de scènes*: tussen de wissels flitst 600 ms een vlak in de primaire kleur met het logo. Geen hoeklogo in het frame.
13. **Sectie 4 heet "Achtergronden"**; de uitleg over intro/inhoud/outro (CHANGES-02 C17) verhuist naar sectie 3. De rest van C17 blijft: eerst *Standaard kantoorshots* / *Personaliseer met eigen foto's*, dan pas de uploadtegels (max 6).
14. **Uploadtegels zijn staand (9:16)** met de avatar als silhouet ervoor, zodat je ziet wat de avatar afdekt. Tekst: "Staande foto's werken het best. Liggend mag ook — we snijden er een staand stuk uit."
15. State: `videoType` eruit, `transition: 'zoom' | 'logo'` erin; `backgrounds` heeft lengte 6. Samenvattingskaart in sectie 6 en de read-only configuratie tonen "Overgang: Camerawissel".

## D. Configurator — avatar en stem

16. **`AvatarTile` speelt een echte clip**: `src/assets/avatars/{id}.webm` (of `.mp4`) — bewegende avatar met lipsync en stem, zonder achtergrond, algemene zin in de eigen taal. De tegel heeft de tint-achtergrond van de taalrij; de clip speelt in de tegel zelf, ondertitel met de zin eronder. Ontbreekt het bestand → de bestaande puls-animatie.
17. Er komen clips voor **NL, EN, TR, AR** (2 per taal). De andere talen blijven kiesbaar en vallen terug op de animatie; de testtaak stuurt op EN, TR en AR.

## E. Configurator — demo (sectie 6)

18. Kop wordt **"Maak een demovideo"**. Uitleg: "We maken een korte video met jouw avatars, achtergronden en overgang. De tekst is een voorbeeldtekst. Zo zie je precies hoe je video's eruit gaan zien voordat je de instellingen vastlegt."
19. **Wachttijd: "ongeveer een half uur"**. `WaitScreen`-copy: "Dit duurt ongeveer een half uur. Je hoeft niet te wachten — je krijgt een mail zodra de demo klaar is." Knop **"Terug naar het overzicht"** is direct actief. Op het overzicht toont de configuratiekaart "Demovideo wordt gemaakt · nog 28 min" (pulserend stipje, CHANGES-01 B9). Mock: na 8 s (`fast` 1 s) toast "Je demovideo is klaar" en de kaart wordt "Demo klaar — bekijk en leg vast" → terug naar sectie 6.
20. **Resultaat**: links de `SiteMock` met de echte widget-knop in huisstijl; klik → portrait-player met de vier gekozen avatars eronder; elke avatar speelt zijn eigen demovideo `src/assets/demo/{lang}.mp4`. De demotekst noemt de gemeente niet. Ontbreekt een bestand → `VideoPreview`-mock in portrait. Rechts blijft: samenvattingskaart, "Kopieer link", checkbox, "Instellingen vastleggen" (CHANGES-02 D20).

## F. Productieflow — volgorde klopt niet

21. **Na akkoord op de basissamenvatting komen de scripts van álle talen tegelijk klaar**, niet pas na het Nederlandse akkoord. Nieuwe keten per taal (NL is gewoon één van de talen):
    `waiting` ("Wacht op script & audio", mock 3 s) → `review-text` (script + audio controleren) → `generating` (8 s) → `review-video` (video + ondertiteling) → `approved`.
    Ondertiteling bestaat pas als de video klaar is.
22. State: `approveSummary` zet alle talen op `waiting` → `review-text` en verstuurt de kennisgeving naar collega's (toast: "Basissamenvatting goedgekeurd — de scripts staan klaar voor alle talen"). `approveNl` vervalt; het is `approveLang('nl')`. `Page.status`: `summarizing | review-summary | in-production | ready-to-publish | live`.
23. `ApproveBox`-teksten: S2 — "Na akkoord maken we voor elke taal een script met audio. Je collega's krijgen een bericht." · S2b — "Na akkoord wordt de Nederlandse video gemaakt (± 20 min)."
24. **S0 "Dit gaat er gebeuren"** wordt: 1 Samenvatting (1 min, automatisch) · 2 Basissamenvatting controleren (3 min, jij) · 3 Script en audio controleren (5 min per taal — jij Nederlands, collega's hun taal, tegelijk) · 4 Video's maken (20 min, automatisch) · 5 Video en ondertiteling controleren (5 min per taal) · 6 Publiceren (2 min, jij).
25. **Intro- en outro-scène toevoegen** in S2, S2b en S3: boven en onder de vier inhoudsscènes een `SceneBlock` met label-pill "INTRO" / "OUTRO" en standaardtekst (intro: "Dit is een korte uitleg van de pagina {titel} van gemeente Bergrode."; outro: "Dank je wel voor het kijken. Meer informatie vind je op deze pagina."). Bewerkbaar, max 25 woorden. Vertaal ze mee in EN, TR, AR.
26. **Scènetitels vervallen.** Ze bestaan niet in het product, dus ook niet in de editor. Boven elk blok staat alleen een label-pill "SCÈNE 2" (of "INTRO" / "OUTRO"); daaronder direct de tekst. `Page.scenes` en `translations` worden `{ text }[]`; de titels uit de seed-data verwijderen.
27. **Ondertiteling realistischer**: per taal **35–45 regels** over ± 2:00, meerdere regels per scène, max 42 tekens per regel, 2–4 s per regel. Vervangt CHANGES-01 D18.

## G. Seed, testtaken, definition of done

28. Seed en `learnmore.ts` nalopen op alles uit A3–A4 en F21 (o.a. FAQ "Waarom max 3 minuten" → "Waarom max 2 minuten"; FAQ over adaptief vervalt; nieuwe FAQ "Kan ik de overgang later wijzigen? — Nee, die zit in elke video gebakken.").
29. Testtaak (a) wordt: "Richt Bergrode in met Engels, Turks en Arabisch, maak een demovideo en leg vast." Demoset waar de assets voor gemaakt worden: **NL Sanne · EN Emma · TR Mehmet · AR Nour**, kantoorshots, Camerawissel. Kiest een tester iets anders, dan speelt de demo alsnog deze set.
30. DoD erbij: geen liggend videoframe meer in de app · geen "vast/adaptief/3 minuten" in copy · geen scènetitels in de productieflow · na akkoord op de basissamenvatting staan alle talen op "Controleer script" · demo-wachtscherm is te verlaten en komt terug via het overzicht.

## H. Assets (levert Sebastiaan) — bouw met fallbacks, bestanden vallen er later in

| Bestand | Inhoud |
|---|---|
| `src/assets/avatars/{id}.webm` × 8 | NL, EN, TR, AR × vrouw/man: bewegende avatar, lipsync + stem, zonder achtergrond, algemene zin, ± 5 s |
| `src/assets/demo/{nl,en,tr,ar}.mp4` | volledige demovideo per taal: portrait, 6 scènes, camerawissel, kantoorachtergrond, demotekst zonder gemeentenaam |
| `src/assets/widget/button.png` | de echte widget-knop (liggend, zonder achtergrond) als referentie |

Let op de single-file build: video's maken `dist/index.html` te groot. Zet ze in `public/media/` en laad ze via een relatieve URL; de build wordt dan een mapje in plaats van één bestand (past PLAN §3 en §11 aan).

---

## Bewust geïnterpreteerd — Maarten checkt

- **C11/C12 (hoeklogo):** het hoeklogo is uit beide overgangen gehaald; het logo komt in het prototype alleen voor in de overgang *Logo tussen de scènes*.
- **C11 (overgangen):** in het gesprek ging het eerst over drie templates (camerawissel, hoofdstuk-/tekstslide, logoslide). De tekstslide is eruit gelaten: Sebastiaan wil niet dat ReadSpeaker daarop aanhaakt, en jij zei "laat dat er even uit". Wil je hem toch toetsen, dan is het één extra tegel.
- **C13:** secties 3 en 4 blijven twee stappen (overgang / achtergrond) in plaats van samengevoegd — één keuze per scherm, en de preview kan per stap iets anders laten zien.
- **E19:** "half uur" komt uit het gesprek; het wegklikken-en-terugkomen is mijn invulling van "kom later terug / stuur een berichtje".
- **Niet aangepast:** de widgetpositie blijft onderdeel van wat je vastlegt, ook al mag die in het echt later nog wijzigen. Audio per scène in S2b blijft een mock.
