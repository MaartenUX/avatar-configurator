# CHANGES-05 — restant van CHANGES-04 en widget definitief

XS2Content × ReadSpeaker · 12 okt 2026 · voor Claude Code

> Geldt bovenop `PLAN.md` en `CHANGES-01` t/m `CHANGES-04`. Bij tegenspraak wint dit bestand. CHANGES-04 is maar deels verwerkt. **Begin met een check**: loop CHANGES-04 punt voor punt na tegen de code (niet tegen `DECISIONS.md`) en zet in `DECISIONS.md` per punt *gedaan* / *niet gedaan*. Werk daarna eerst de niet-gedane punten af, dan dit bestand. Referentie: `http://localhost:5174/#/configuratie`.

---

## A. Nog niet gedaan uit CHANGES-04

1. **Volgorde van de configurator (CHANGES-04 §D) is niet doorgevoerd.** Nogmaals, dit is de volgorde en er zijn vijf secties:

   | # | Sectie |
   |---|---|
   | 1 | Taalniveau en talen |
   | 2 | Avatar en stem per taal |
   | 3 | Widget: kleur en positie |
   | 4 | Scènes: overgangen en scèneachtergronden |
   | 5 | Maak een demovideo |

   Inclusief alles uit CHANGES-04 D12–D13: sectie 4 met subkoppen "Overgang" en "Scèneachtergronden", `ProgressBar` "Stap x van 5", `doneSections` 1..5, "wijzig"-links, `learnmore.ts`, copy, seed en DoD.
2. Alle andere punten uit CHANGES-04 die bij de check op *niet gedaan* staan.

## B. Widget — definitieve spec (vervangt CHANGES-04 B3 en CHANGES-03 A2)

3. **Widget is liggend.** De verandering naar staand was fout. Opbouw, alles in één kader (rand gray-5, radius 8, `shadow-card`, witte achtergrond):
   - **bovenste deel**: **geen foto-achtergrond** (wit). Daarin de **avatars op een rij**, vrijstaand: per gekozen taal één avatar — het portret van de gekozen avatar, of een grijs silhouet zolang er voor die taal nog geen avatar is gekozen (zoals in de eerste versie, PLAN §6 sectie 1). Play-knop in het midden, over de rij heen.
   - **balk over de volle breedte** in de primaire kleur (gray-5 tot die is opgehaald), witte tekst.
4. **Balktekst wisselt per taal.** De tekst fadet uit en in (400 ms) en toont telkens "Videovertaling" in een volgende gekozen taal, 2,5 s per taal, in de volgorde van de gekozen talen (NL eerst). Vertalingen in `src/data/widget.ts`:
   NL *Videovertaling* · EN *Video translation* · DE *Videoübersetzung* · FR *Traduction vidéo* · TR *Video çevirisi* · AR *ترجمة الفيديو* (rtl) · PL *Tłumaczenie wideo* · EL *Μετάφραση βίντεο* · ES *Traducción de vídeo*.
5. **Player blijft staand** (zoals nu): portrait-video **mét** de kantoorshot-achtergrond, direct daaronder de avatarrij als taalkeuze (CHANGES-04 B4). Kort: widget zonder achtergrond, player met achtergrond.

## C. Shell

6. **Geen topbalk in de configurator.** De header (titel, teller, PROTOTYPE-kader) verdwijnt op `/configuratie`; de sticky `ProgressBar` is daar de enige balk. Twee dingen uit de header die je daar nog wel nodig hebt, verhuizen naar de `ProgressBar`, rechts naast "Sla op en ga later verder": een ghost-knop **"← Overzicht"** en het **PROTOTYPE-kader** met de dropdown (compacte variant). Check daarna opnieuw CHANGES-04 C6 (`scroll-margin-top`).
7. **Reset in de scenario-dropdown.** Onderaan de dropdown een scheidslijn en een item **"Alles wissen"** (lucide `RotateCcw`): wist `localStorage` (`avatar-proto-v1`) en laadt het scenario *Esmee — eerste keer*. De verborgen reset-knoppen in de footer (PLAN §8) vervallen.

## D. Configurator — avatar en stem

8. **Avatars uitlijnen aan de onderkant van de tegel.** In de `AvatarTile` staat het portret nu zwevend; zet het tegen de onderrand van de tegel (`align-items: flex-end`, geen padding onder het portret), zodat de avatar "staat". Naam en steekwoorden erboven of ernaast, niet eronder.

---

## Bewust geïnterpreteerd — Maarten checkt

- **C6:** het PROTOTYPE-kader en een weg terug naar het overzicht heb ik in de `ProgressBar` gezet, anders kan een tester in de configurator niet van scenario wisselen of resetten. Wil je de `ProgressBar` helemaal kaal, haal die twee dan weg.
- **B3:** het kader (rand, schaduw, balk) blijft, alleen de foto-achtergrond gaat eruit. "Geen achtergrond" gelezen als "geen foto", niet als "geen kader" — je vroeg in CHANGES-04 juist om het kader terug.
- **B4:** 2,5 s per taal en alleen de gekozen talen zijn mijn invulling.
