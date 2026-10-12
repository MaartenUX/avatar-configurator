# CHANGES-06 — overzicht, beheer en spaken

XS2Content × ReadSpeaker · 12 okt 2026 · voor Claude Code

> Geldt bovenop `PLAN.md` en `CHANGES-01` t/m `CHANGES-05`. Bij tegenspraak wint dit bestand. Werk af in volgorde, vink af in `DECISIONS.md` en check in de browser voordat je afvinkt.

---

## A. Overzicht

1. **Live-kaarten: play-icoon groen.** Het pagina-met-play-icoon links van de titel krijgt op live kaarten de green-tint als achtergrond en green-shade als icoonkleur, plus een zachte gloed (`box-shadow: 0 0 0 4px #E6FEE1, 0 0 12px rgba(31,155,6,.35)`). Op in-productie-kaarten blijft het grijs.
2. **Taaltegels op live kaarten compacter:** oog-icoon (lucide `Eye`, 14 px, gray-3) · taalcode in label-stijl · aantal. De taalnaam ("Nederlands") vervalt. Dus `👁 NL 2.104`, niet `NL Nederlands 2.104`.
3. **Configuratiekaart (`LockedBanner`): avatarrij links.** Vóór de tekst "Configuratie vastgelegd op …" komt de rij gekozen avatars, klein (portretten 28 px, overlappend met −6 px, witte ring 2 px), in de volgorde van de talen. Daarmee is zichtbaar dat dit het niveau boven alle pagina's is. Het slotje blijft, links van de avatars.

## B. Beheerpagina (`/paginas/:id`)

4. **Terugknop**: linksboven, boven de titel, een ghost-knop **"← Overzicht"** (zelfde als in de spaken).
5. **LIVE-badge naar boven**: de groene badge staat naast de titel (rechts ervan, verticaal gecentreerd op de h1), niet lager op de pagina. De regel "Toegevoegd op 26 augustus · staat live" wordt "Toegevoegd op 26 augustus".

## C. Spaken

6. **S2 Basissamenvatting controleren — zijpaneel gaat over B1, niet over spraak.** Het paneel (CHANGES-01 C16) heet hier **"Zo maak je een goede B1-samenvatting"** met eigen inhoud in `src/data/learnmore.ts`: korte zinnen (max 15 woorden), één boodschap per zin, bekende woorden, geen vaktermen of afkortingen, actieve vorm, concreet ("binnen 2 weken" in plaats van "op korte termijn"), alleen wat een inwoner moet weten. FAQ: "Mag ik informatie toevoegen? — Ja, maar houd het bij de essentie; details staan op de pagina." · "De inhoud klopt niet — overleg met de webredactie van de pagina." Het spraak-paneel ("Zo maak je de tekst beter voor spraak") blijft alleen in S2b en S3.
7. **S5 "Video is niet oké?" — melden is primair, opnieuw maken kost er één van de vijf.** In de `Dialog` na het kiezen van een reden:
   - primaire knop: **"Melden bij XS2Content"** — "Beschrijf wat er niet klopt, dan kijken wij ernaar. Dit kost je niets."
   - secundaire knop: **"Zelf opnieuw maken"** met eronder in body-sm: "Dit gebruikt 1 van je 5 keer opnieuw maken (nog 5 over)." Bij 0 over: knop disabled, tekst "Je kunt niet meer zelf opnieuw maken. Meld het bij XS2Content."
   De teller rechtsboven loopt mee.

## D. Configurator — scèneachtergronden

8. **Uploadtegels bij "Personaliseer met eigen foto's" tonen elk een andere voorbeeldfoto** (nu allemaal dezelfde): gemeentehuis, park, winkelstraat, bibliotheek, sporthal, plein — staand, licht geblurd, met de avatar als silhouet ervoor (CHANGES-03 C14). Voorbeeldfoto's in `public/media/examples/`, als illustraties of vrij beeld.
9. **Deze tegel staat vooraan**: in de keuze staat *Personaliseer met eigen foto's* links en *Standaard kantoorshots* rechts. Het label "Aanbevolen" blijft bij standaard.

---

## Bewust geïnterpreteerd — Maarten checkt

- **A1:** "een beetje laten shinen" is een zachte gloed, geen animatie. Wil je een puls, zeg het.
- **D9:** "deze als eerste tonen" gelezen als: de personaliseer-tegel links. Als je bedoelde dat de voorbeeldfoto's standaard al zichtbaar zijn (zonder eerst te kiezen), is dat een andere wijziging.
- **C7:** het "credit"-woord gebruik ik niet in de UI (PLAN §2.12); het heet "keer opnieuw maken".
