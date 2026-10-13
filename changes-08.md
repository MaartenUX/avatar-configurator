# CHANGES-08 — uitleg bij de teller en team zonder rollen

XS2Content × ReadSpeaker · 13 okt 2026 · voor Claude Code

> Geldt bovenop `PLAN.md` en `CHANGES-01` t/m `CHANGES-07`. Bij tegenspraak wint dit bestand. Vink af in `DECISIONS.md` na een check in de browser.

---

## A. Teller — uitleg in een popover

1. **Teller rechtsboven is klikbaar.** Hover: cursor pointer en lichte underline op beide regels. Klik opent een `Popover` (nieuw component, op `/kit`) direct onder de teller: 320 px breed, witte kaart met `shadow-card`, radius 12, pijltje naar de teller, sluit bij klik buiten of Esc.
2. **Inhoud van de popover**, van boven naar beneden:
   - label-pill **"JE ABONNEMENT"**
   - regel 1: **"6 van 10 uitlegvideo's over"** met daaronder body-sm: "Elke pagina die je toevoegt is één uitlegvideo, in alle talen samen."
   - regel 2: **"5× opnieuw maken over"** met daaronder body-sm: "Vind je een video niet goed? Meld het bij XS2Content, dat kost niets. Zelf opnieuw maken kan 5 keer per abonnement."
   - dunne lijn, daaronder drie FAQ-regels als accordeon:
     - "Wat als mijn video's op zijn?" — "Neem contact op met XS2Content; uitbreiden kan altijd."
     - "Telt tekst opnieuw genereren mee?" — "Nee. Alleen een video opnieuw maken kost er één van de vijf."
     - "Telt een pagina opnieuw maken na een wijziging mee?" — "Ja, dat is een nieuwe uitlegvideo."
   Teksten in `src/data/learnmore.ts` onder `subscription`.
3. **Tooltip op hover** (zonder klik): alleen de eerste zin per teller, na 500 ms.
4. **Zelfde popover op twee andere plekken**, via een klein ⓘ-icoon (lucide `Info`, 14 px, gray-3) achter de tekst: "Dit wordt video 1 van 10" in S0 (`/paginas/nieuw`) en in de lege staat van het overzicht (CHANGES-07 B5).

## B. Team

5. **Geen rollen per persoon.** Op `/team` vervalt de regel "Controleert Duits" (en elke andere taalrol) bij alle teamleden. Alleen Esmee houdt het label **"Beheerder"**. Bij de anderen staat onder de naam alleen het e-mailadres. De seed (`team[]`) verliest het veld `language`; `role` blijft `'owner' | 'member'`.

---

## Bewust geïnterpreteerd — Maarten checkt

- **A1:** popover op klik, tooltip op hover — twee niveaus, zodat wie niet klikt toch de kern ziet. Wil je er één, dan schrap ik de tooltip.
- **A2:** FAQ-teksten zijn nieuw; pas aan naar smaak.
- **B5:** Emre en Layla worden in de collega-view en op de paginakaarten nog wel per taal genoemd ("Goedgekeurd door Emre Yilmaz"); dat is geen rol maar een logboek, dus dat blijft.
