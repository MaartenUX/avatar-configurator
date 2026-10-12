# CHANGES-04 — content erin en polish configurator

XS2Content × ReadSpeaker · 8 okt 2026 · voor Claude Code

> Geldt bovenop `PLAN.md` en `CHANGES-01` t/m `CHANGES-03`. Bij tegenspraak wint dit bestand. Werk af in volgorde, vink af in `DECISIONS.md`. Drie soorten punten: de echte assets erin (A), visuele reparaties in de configurator (B–C) en een nieuwe volgorde van de configurator-secties (D). Bij elke reparatie: kijk eerst in de git-historie wat er eerder stond — meerdere punten zijn regressies.

**Terminologie vanaf nu:** de **widget** is de knop op de website (in de `SiteMock`); de **player** is het venster dat opent als je erop klikt. "Thumbnail" uit CHANGES-02 = widget.

---

## A. Assets — staan in de assetsmap

1. **Demovideo en avatarclips** staan in `public/media/` (CHANGES-03 §H). Koppel ze: de `AvatarTile`s spelen de clips (CHANGES-03 D16), de demo in de laatste sectie speelt de demovideo (CHANGES-03 E20). Controleer dat de fallbacks niet meer getoond worden waar een bestand bestaat.
2. **Twee nieuwe achtergrondfoto's** in de assetsmap worden de **standaard kantoorshots**. Ze komen terug in de demovideo, dus de preview en de demo moeten hetzelfde laten zien. Vervang de huidige placeholder-kantoorshots: wissel de twee foto's af over de 6 scènes (1-2-1-2-1-2), staand uitgesneden, licht geblurd (CHANGES-01 F23). Zet ze in `public/media/backgrounds/`.

## B. Configurator — preview links

3. **Widget herstellen.** De widget in de `SiteMock` is sinds CHANGES-03 A2 kaal: geen achtergrond, geen rand, geen schaduw, geen balk eronder. Zet de versie van vóór CHANGES-03 terug (zoek hem in de git-historie) en bouw hem zo op, van boven naar beneden, alles in één kader (dunne rand gray-5, radius 8, `shadow-card`):
   - **staand videoframe**: avatar op het kantoorshot (licht geblurd), play-knop in het midden (CHANGES-02 B8);
   - **balk over de volle breedte** in de primaire kleur van de gemeente (gray-5 zolang die niet is opgehaald, CHANGES-02 B9), met de tekst **"Videovertaling"** in wit.
   Het eerste deel van CHANGES-03 A2 ("liggend, geen achtergrond, avatars vrijstaand") vervalt.
4. **Player.** Klik op de widget opent de player: portrait-video, met **direct daaronder de rij gekozen avatars** als taalkeuze (actieve taal = blue ring). Alleen tonen, hoeft niet te werken. Dit is CHANGES-03 A2, tweede helft — controleer dat de avatarrij direct onder de video staat en niet ergens anders.
5. **Scèneachtergronden-preview** — het staande paneel staat over de website heen en wordt aan de onderkant afgesneden. Het mag er overheen staan, maar moet volledig zichtbaar zijn: `overflow: visible` op de container en het paneel verticaal zo plaatsen dat het binnen de linker helft past (desnoods de `SiteMock` iets kleiner).

## C. Configurator — rechter paneel en header

6. **Sticky balk overlapt de sectietitel** bij scrollen naar een volgende sectie (bijv. "Avatar en stem per taal"). Geef elke sectie `scroll-margin-top` = hoogte van de sticky balk + 24 px, en check alle "Verder"-scrolls en de "wijzig"-links uit de samenvattingskaart.
7. **"± 10 min te gaan" weg** uit de `ProgressBar`. Alleen "Stap 2 van 5" (zie D).
8. **URL-veld en ophaalknop uitlijnen** (widget-sectie): knop even hoog als het invoerveld, op dezelfde baseline, 8 px ertussen.
9. **Testscenario-kader**: de pill **"PROTOTYPE"** blijft, het label "Testscenario" vervalt. Over: pill + dropdown in het zwarte kader.

## D. Configurator — nieuwe volgorde, vijf secties

10. **Reden:** de overgang *Logo tussen de scènes* heeft het logo en de huisstijlkleur nodig, en die worden pas in de widget-sectie opgehaald. Dus de widget komt vóór de scènes. Overgangen en achtergronden worden één sectie — net als taalniveau + talen, avatar + stem en kleur + positie al twee dingen in één sectie zijn.
11. **Nieuwe volgorde:**

    | # | Sectie | Preview links |
    |---|---|---|
    | 1 | **Taalniveau en talen** | ongewijzigd |
    | 2 | **Avatar en stem per taal** | ongewijzigd |
    | 3 | **Widget: kleur en positie** (was 5) | ongewijzigd; de widget (B3) krijgt hier de huisstijlkleur en het logo |
    | 4 | **Scènes: overgangen en scèneachtergronden** (was 3 + 4) | zie 12 |
    | 5 | **Maak een demovideo** (was 6) | ongewijzigd |

12. **Sectie 4 opbouw**, van boven naar beneden: h1 "Scènes" · ondertitel "Een uitlegvideo duurt maximaal 2 minuten en bestaat uit 4 tot 6 korte scènes." · "Goed om te weten"-blok met de tekst uit CHANGES-03 C10 · subkop (h3) **"Overgang"** met de twee `ChoiceTile`s uit CHANGES-03 C11 en de `AdviceBox` · subkop (h3) **"Scèneachtergronden"** met *Standaard kantoorshots* / *Personaliseer met eigen foto's* en daarna de uploadtegels (CHANGES-03 C13–C14). Sectie is "gedaan" als beide keuzes staan.
    **Preview links**: het portrait-frame met tijdlijn uit CHANGES-03 C12; de overgang *Logo tussen de scènes* gebruikt nu het echte opgehaalde logo en de primaire kleur. Bij de achtergrondkeuze toont het frame de gekozen shots (het staande paneel uit B5 verhuist hiernaartoe).
13. **Overal bijwerken:** `ProgressBar` "Stap x van 5", `doneSections` 1..5, de "wijzig"-links in de samenvattingskaart, de "Ga verder bij stap …"-copy, `learnmore.ts` (per sectie één set; de sets van oud 3 en 4 samenvoegen), en elke verwijzing naar "sectie 5" of "sectie 6" in copy, seed en DoD.

---

## Bewust geïnterpreteerd — Maarten checkt

- **A2:** "ook toevoegen, net als de standaardkantoorfoto's" gelezen als: de twee foto's *zijn* de nieuwe standaardshots en vervangen de placeholders. Als ze ernaast moeten (bijv. als voorbeeld bij *Personaliseer met eigen foto's*), is dat een andere plek.
- **B3:** de balktekst "Videovertaling" is letterlijk overgenomen. Als dat niet de echte widgettekst van ReadSpeaker is, pas aan.
- **D11:** je zei "stap 5 komt naar stap 2" én "eerst avatars, dan widget". Ik heb het tweede aangehouden: widget op 3, na de avatars. Wil je de widget vóór de avatars, dan wisselen 2 en 3.
- **D12:** de twee keuzes staan onder elkaar in één scrollsectie; het alternatief (sub-tabs) zou de Remarkable-flow breken.
