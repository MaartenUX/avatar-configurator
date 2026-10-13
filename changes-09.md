# CHANGES-09 — na de review met ReadSpeaker

XS2Content × ReadSpeaker · 13 okt 2026 · voor Claude Code

> Geldt bovenop `PLAN.md` en `CHANGES-01` t/m `CHANGES-08`. Bij tegenspraak wint dit bestand. Bron: Maarten van de Koevering (ReadSpeaker) klikte hardop denkend door het prototype; Gerda en Bert keken mee. Vink af in `DECISIONS.md` na een check in de browser.

---

## A. Configurator

1. **Taalniveau: A2 en B1**, niet B1 en B2. B1 blijft aanbevolen. Copy in sectie 1, `learnmore.ts` (FAQ "waarom B1") en de samenvattingskaart aanpassen; `Config.level` wordt `'A2' | 'B1'`.
2. **Talen: maximaal vier in totaal**, Nederlands meegeteld. Nu staat NL vast en mag je er vier bij kiezen (vijf totaal); dat klopt niet met het pakket. Nederlands blijft voorgeselecteerd maar is uit te zetten. Copy: "Kies maximaal vier talen." Teller "3 van 4" bij de chips. Testtaak (NL + EN + TR + AR) past precies.
3. **"Aanpassen" na het ophalen van logo en kleur werkt niet.** Klik opent onder de opgehaalde waarden een klein formulier: twee `Input`s met hex-code (primair, secundair) met kleurvlakje ervoor, en een upload-tegel voor het logo (mock). Wijzigingen zijn direct zichtbaar in de preview.
4. **Widgetpositie: ook links-midden en rechts-midden.** In "Meer specificaties" worden het zes tegels (lb · lm · lt · rb · rm · rt); de `SiteMock` en de read-only configuratie tonen die posities. `Config.widgetCorner` wordt `widgetPosition: 'lb'|'lm'|'lt'|'rb'|'rm'|'rt'`. Gemeente Eindhoven heeft hem links-midden staan.
5. **Toggle desktop/mobiel terug** in de widget-sectie (stond in PLAN §6 sectie 5, is er niet). Twee `Chip`s boven de preview; mobiel toont de `SiteMock` als telefoonframe (375 px breed) met de widget op dezelfde positie. Ook op de read-only configuratie.
6. **Scènes: aantal is geen keuze — zeg dat.** In het "Goed om te weten"-blok van sectie 4 een zin erbij: "Hoeveel scènes een video krijgt, hangt af van de hoeveelheid informatie op de pagina. Dat bepaal je niet zelf."
7. **Demovideo: geen avatarrij onder de player.** De demo is één video die alle gekozen talen na elkaar laat zien. Haal in sectie 5 de avatarrij onder de player weg en zet erboven één regel: "In deze demo hoor je alle gekozen talen na elkaar. Echte video's zijn altijd in één taal." De avatarrij blijft wél in de gewone player (CHANGES-04 B4).
8. **Startkaart "Begin met de configuratie"**: check of CHANGES-02 A5 (het fasenblok weg) is gedaan. Als het blok er nog staat: noem bij fase 1 ook "je logo en kleuren" en "achtergrondfoto's". Nu mist dat en dat wekt de vraag "waar upload ik mijn logo?".

## B. Spaken

9. **S2 "Opnieuw genereren" wist je aanpassingen — waarschuw.** Knop opent een `Dialog`: "Opnieuw genereren maakt een nieuwe samenvatting. Je aanpassingen in de tekst gaan verloren." met *Annuleer* / *Opnieuw genereren*. Alleen tonen als er iets bewerkt is; anders direct genereren.
10. **Celebration: de vier tegels zijn inspiratie, geen publiceerknoppen.** Gerda las Website / Facebook / WhatsApp / YouTube als keuzes. Kop boven de tegels wordt "Zo deden andere gemeenten het", de tegels krijgen een "Bekijk voorbeeld"-link in plaats van een knop, en LinkedIn en Instagram komen erbij (zes tegels, 3×2).

## C. FAQ

11. In `learnmore.ts` bij de widget-sectie een FAQ erbij: "Kan de widget ook in de tekst staan in plaats van zwevend? — Ja. Je webdeveloper past de code aan; de video is dezelfde." (Regionale Belastinggroep wil hem tussen de tekst.)

---

## Bewust geïnterpreteerd — Maarten checkt

- **A2:** NL uitzetbaar gemaakt omdat Maarten (RS) Duitsland noemde; in de test blijft NL gewoon aan staan.
- **A4:** links-/rechts-midden toegevoegd omdat Eindhoven het zo heeft; Maarten (RS) noemde het "technische uitwerking", jij zweeg bewust. Wil je het niet in de configurator, laat A4 weg en zet het in de FAQ bij C11.
- **A7:** "die dingetjes eronder misschien weghalen" is jouw opmerking in het gesprek; uitgewerkt als één doorlopende demo.
- **B10:** LinkedIn en Instagram zijn mijn toevoeging na de vraag "geen TikTok?". TikTok bewust niet.
