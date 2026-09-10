# Beslissingen

Het bouwplan zegt: "kies bij twijfel de eenvoudigste variant en noteer die hier."
Dit zijn die keuzes, met de reden erbij. Alles wat hier niet staat, volgt PLAN.md.

## Afwijkingen van het bouwplan

### 1. HashRouter in plaats van BrowserRouter
§3 noemt BrowserRouter, §11 eist dat `dist/index.html` zonder server opent. Dat
gaat niet samen: onder `file://` kan BrowserRouter geen history pushen en 404't
elke deeplink. Met HashRouter (`#/paginas/p-1/script`) kloppen beide eisen.
Geverifieerd: alle elf routes laden vanaf `file://` zonder consolefouten.
Terugdraaien is één regel in `src/main.tsx`.

### 2. Zes configuratiesecties
§6 beschrijft er zes, §10 checkpoint 5 zegt "alle 8 secties". Aangehouden: zes.

### 3. React 19 en Vite 8 in plaats van React 18
§3 noemt React 18, maar `npm create vite` levert inmiddels React 19 met een
toolchain die daarop is gebouwd. Een oudere React forceren tegen Vite 8,
TypeScript 6 en react-router 7 in geeft meer risico dan het wegneemt.

### 4. Eén store.ts in plaats van een slices-map
Zustand-slices met TypeScript vragen `StateCreator`-generics die voor een
prototype meer kosten dan opleveren. Eén bestand van ~290 regels met
gegroepeerde acties is beter leesbaar.

### 5. Scene-teksten worden wél gepersisteerd
Het plan wilde alleen voortgang bewaren en content bij rehydrate opnieuw
aanhaken. Maar de redacteur bewérkt die teksten in S2 en S2b; niet bewaren
betekent dat elke reload het werk weggooit. De volledige state is ~20 KB, ver
onder de 5 MB-quota — dat risico bestond alleen bij data-URL-uploads, en die
zijn hier vervangen door presets (zie 8).

## Keuzes binnen het bouwplan

### 6. `doneSections` wordt afgeleid
Een sectie is "gedaan" zodra er een geldige keuze staat: dat is een functie van
`Config`. Opslaan zou betekenen dat een sectie afgevinkt blijft nadat de
gebruiker zijn keuze wist. Het veld blijft bestaan voor spec-compatibiliteit.

### 7. Basisgroen alleen als vlak, nooit als stip of balk
`#BDFCB0` is een tintsterkte, anders dan de zes andere families: op wit is het
vrijwel onzichtbaar en het faalt contrast. `approved` en `live` gebruiken
`green-shade` (#1F9B06) voor stip en balk.

### 8. Logo, huisstijl en screenshot zijn presets
§2.11 zegt "gemockt". De uploadknop bestaat en voelt echt, maar kiest een
preset. Voorkomt ook dat een screenshot als data-URL de localStorage volloopt.

### 9. `config.backgrounds` bevat slugs, geen URL's
`'kantoor-1'`, niet het build-hashed pad. Anders breekt persisted state bij
elke rebuild.

### 10. Route `/paginas/:id/:lang` blijft zoals gespecificeerd
React Router rangschikt statische segmenten boven dynamische, dus
`/paginas/nieuw` en `/paginas/:id/samenvatting` winnen vanzelf. Een guard
controleert `:lang` tegen de negen taalcodes en redirect anders naar
`/paginas/:id`; die vangt alleen tikfouten op.

### 11. Timers slaan hun starttijd op, niet hun deadline
`setTimeout` overleeft geen reload, persisted state wel. Eén ticker van 250 ms
in `TickProvider` is het enige interval in de app; toasts, kaart-highlights en
de mock-playhead lezen dezelfde klok af. Bijkomend voordeel: `?fast=1` verkort
ook timers die al lopen.

### 12. Ondertitels: 8–10 regels over 1:50
Zoals §9. Bij 180 woorden is dat een rustig tempo, passend bij B1.

### 13. Contentdiepte: 2 pagina's volledig, 3 alleen Nederlands
Parkeervergunning en Bijstandsuitkering hebben bronpagina, scenes, EN/TR/AR en
ondertitels. WMO, Paspoort en Afval kregen alsnog een Nederlandse samenvatting
en ondertiteling: ze staan live, en wie op "Bekijk" klikt komt op het
beheerscherm dat het script toont. Zonder die tekst was daar een leeg vlak
blijven staan. Vertalingen hebben ze niet. Afgestemd met Maarten op 9 september.

### 14. Fonts via Google Fonts
Inter plus Noto Sans Arabic (Inter heeft geen Arabisch schrift). Afgestemd met
Maarten. Let op: zonder internet valt de typografie terug op een systeemfont.

### 15. Portretten heten naar het gezicht, niet naar de avatar
Achttien avatars delen zeven gezichten — het bouwplan staat hergebruik tussen
talen expliciet toe. Een bestand per avatar zou hetzelfde beeld tot drie keer
in de bundel zetten. Nu wijst `AvatarDef.face` naar de bestandsnaam.

### 16. Aangeleverde portretten worden getrimd
De bronbeelden zijn liggend met de figuur klein in het midden; ruim 70% is
transparante leegte. Daardoor zou elke plek in de UI moeten raden hoe ver hij
inzoomt. `scripts/trim-avatars.mjs` snijdt de rand weg, waarna overal
`object-contain` volstaat en de figuur nooit halverwege wordt afgesneden.

### 17. Publiceren is de uitzondering op "terug naar het overzicht"
Na elk akkoord land je op het overzicht met een toast. Na publiceren blijf je
staan, want daar hoort de afsluiting met de social-activatie; van daaruit ga je
zelf terug. Dit staat in `flow.ts`, niet in het scherm.

---

# CHANGES-01 — 10 september

## Afgestemd met Maarten

### 18. Het overzicht wordt de hub
Zonder zijbalk hadden Pagina's en Team geen enkel toegangspunt meer. Pagina's
vervalt als scherm — het overzicht toont dezelfde kaarten, in productie én live
— en `/paginas` redirect naar `/`. Team en Hulp staan in de voettekst.

### 19. Alleen de ondertiteltracks die de test opent gaan naar 28 regels
Nederlands en Turks van Parkeervergunning en Bijstandsuitkering. De overige
zeven tracks blijven op 10 regels; die komt tijdens de test niemand tegen.
Scheelt ruim 200 regels handgeschreven tekst waarvan het meeste in het Turks en
Arabisch niemand kan proeflezen.

### 20. Beheer en de publiceerstap houden allebei hun publiceerblokken
De changelijst koos voor dubbeling boven één plek. Om te voorkomen dat de twee
uit elkaar groeien renderen ze dezelfde componenten: `EmbedBlok` en
`Distributie` in `src/components/domain/Distributie.tsx`.

## Vervallen beslissingen

- **§2.8 uit het bouwplan (opnieuw draaien kost een credit)** vervalt. Er zijn
  nu twee potten: uitlegvideo's (10, één per pagina) en opnieuw maken (5,
  gezamenlijk voor alle video's). Het woord *credit* komt nergens meer voor.
- **De mailbevestiging na het vastleggen** vervalt. Je komt op een demo-pagina
  met een deelbare link; collega's horen pas iets zodra er een pagina is
  toegevoegd.
- **Beslissing 12 (ondertitels 8–10 regels over 1:50)** is deels achterhaald.
  Elf seconden per regel was ongeveer het dubbele van comfortabel; de vier
  tracks die de test opent zitten nu op vier seconden per regel, wat precies
  uitkomt op de 180 woorden van het script.

## Nieuwe keuzes binnen CHANGES-01

### 21. De spraaktips — zeven voorstellen, schrap wat je niet wilt
Ze staan in `src/data/spraaktips.ts` en verschijnen in het zijpaneel bij elke
tekststap:

1. Houd zinnen kort en zeg één ding per zin. Een stem kan geen komma's laten horen.
2. Schrijf getallen voluit als ze belangrijk zijn: "zesentwintig euro" klinkt rustiger dan "26 euro".
3. Schrijf afkortingen uit. "Bijvoorbeeld" in plaats van "bijv.".
4. Klinkt een naam verkeerd? Schrijf hem op zoals hij klinkt, bijvoorbeeld "Berch-rode".
5. Maak van een opsomming een lopende zin. Streepjes hoor je niet.
6. Zet het belangrijkste vooraan in de zin. De kijker kan niet terugspoelen.
7. Lees je aanpassing hardop. Struikel jij erover, dan doet de stem dat ook.

De videostap heeft een eigen variant met vier tips over ondertiteling, want die
stap gaat niet over spraak.

### 22. Downloads hangen aan "goedgekeurd", niet aan "live"
Op de publiceerstap zijn de video's klaar terwijl de widget nog niet live
staat. De knop hoort daar gewoon te werken; alleen het embed-blok meldt dat de
widget pas actief wordt na publiceren.

### 23. Een afgetekende stap is terug te kijken
Bij hover op een goedgekeurde taalregel verschijnt "Bekijk", die de spaak opent
met `?bekijk=1`. De velden zijn dan dood en een balk vervangt de akkoordknop.
De `locked`-prop op `SpokeFrame` bestond al maar werd nergens doorgegeven.

## Open punten

1. De Turkse en Arabische teksten zijn zorgvuldig geschreven maar niet door een
   moedertaalspreker nagekeken. Laat vóór de test minimaal de Turkse tekst van
   Parkeervergunning controleren — dat is de enige niet-Nederlandse tekst die
   in testtaak (c) daadwerkelijk geopend wordt.

2. Er is één mannengezicht te weinig: `en-james` deelt `man-grijs` met
   `nl-daan`, dus Nederlands en Engels tonen dezelfde man. Zichtbaar in sectie
   2 van de configuratie als een deelnemer beide talen kiest.

3. Stemfragmenten ontbreken. De speler draait een mock op dezelfde klok; een
   mp3 in `src/assets/voices/{avatar-id}.mp3` neemt het zonder codewijziging
   over.

4. WMO, Paspoort en Afval hebben wel een Nederlandse samenvatting en
   ondertiteling — die toont het beheerscherm — maar geen vertalingen. Klikt
   een deelnemer bij zo'n pagina op een niet-Nederlandse taal, dan valt de
   tekst terug op het Nederlands.
