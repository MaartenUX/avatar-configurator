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

---

# CHANGES-02 — 11 september

Alle 22 punten verwerkt. Wat daarbij een keuze vroeg:

### 24. De container is 1040 px, behalve waar het niet past
Het overzicht en de configuratie-intro staan op 1040. De beheerpagina en `/kit`
krijgen `breed` (1440): vier statistiekkaarten, vier videotegels en een
codeveld naast de social-tips passen niet in 1040 zonder te verschralen.

### 25. Het advieslabel staat inline naast de titel, het vinkje in de hoek
Zo raken ze elkaar nooit, ongeacht de lengte van de titel. Bij een lange titel
wikkelt het label naar de volgende regel in plaats van over het vinkje te
schuiven.

### 26. "Goed om te weten" staat in de sectie-registry, niet in de secties
`SectionShell` rendert het blok altijd direct onder de intro. De tekst staat
per sectie in `sections.ts`, zodat een sectie hem niet kan vergeten of op een
andere plek kan zetten.

### 27. Het advies verschijnt pas na een keuze
Vooraf bij alle opties is het ruis: je leest dan drie adviezen tegelijk. Geldt
voor avatars en voor het videotype.

### 28. De contentpagina is een echte tweede layout
De alternatieve suggestie (alleen een andere paginatitel) was goedkoper, maar
het verschil tussen een homepage en een informatiepagina is juist waar de
widget anders valt. `SiteMock` heeft nu een `soort`-prop met broodkruimel,
tekstkolom en zijbalk.

### 29. De widgetmarge schaalt mee met de mock
De marge is in echte pixels (default 24), maar de preview is kleiner dan een
echte pagina. Die wordt met een factor geschaald, anders duwt 24 px de widget
in de mini-previews half uit beeld.

### 30. De demo zit vóór het vastleggen, in dezelfde scrollpagina
Zoals in CHANGES-02 D20 aangegeven. De route `/configuratie/demo` is vervallen;
na vastleggen land je op het overzicht met een toast.

## Vervallen door CHANGES-02

- De screenshot-upload in sectie 5. We hebben de URL al; een tweede URL voor
  een contentpagina zegt meer dan een geüpload plaatje.
- Het blok met de drie fases op het eerste-keer-overzicht.
- De losse demo-pagina uit CHANGES-01 punt 24.

---

# CHANGES-03 — 15 september

Alle twaalf punten verwerkt. Wat daarbij een keuze vroeg:

### 31. De voettekst op een paginakaart verschijnt alleen als hij de enige ingang is
Punt 11 letterlijk toepassen op elke niet-live kaart zou testtaak (b) breken:
bij de basissamenvatting en het script hebben de taalregels geen knoppen, dus
de voettekst is daar de enige weg naar binnen. De regel is nu: tonen als er
een actie is (`action.to`) én geen enkele taalregel al een eigen knop heeft.
Bij een gemengde kaart verdwijnt hij dus, bij "alles goedgekeurd" komt hij
terug met Publiceer.

### 32. Het advies noemde de verkeerde avatar
Het "meest gekozen"-kader verscheen zodra je íets koos, maar noemde altijd de
aanbevolen avatar — koos je Daan, dan stond er "Sanne. In Nederland wordt een
vrouwenstem als betrouwbaar ervaren." Nu verschijnt het alleen als je de
aanbevolen avatar ook echt kiest.

### 33. Het introblok in de configurator is vervallen
De alinea "Dit zijn de eenmalige basisinstellingen…" staat nu op het
eerste-keer-scherm, waar hij de beslissing om te beginnen ondersteunt. Hem ook
in de configurator laten staan betekende dezelfde tekst twee schermen achter
elkaar. De configurator opent nu direct met stap 1. Afgestemd met Maarten.

### 34. De scriptsectie is uit beheer weg, ook bij een pagina in productie
Punt 12 noemde alleen de live-versie, maar het script is op de beheerpagina in
beide standen niet te bewerken en staat al in de publiceerstap. Daar blijft hij
dus staan.

### 35. Twee blauwe blokken werden er één
De tint-kaart met "Dit is de basis voor alle talen" stond direct boven de
blauwe "Waar let je op"-box en verschilde daar alleen in dekking van. De zin
staat nu als gewone tekst onder de kop.

### 36. De widget-thumbnail toont de achtergrond zodra die gekozen is
Bij stap 5 en 6 stonden de avatars op een wit vlak, terwijl stap 3 en 4 een
volledig videoframe lieten zien. Naast de grijze wireframe-tekst las dat als
"alles is grijs geworden", ook al waren de sitekop en accentbalk wel gekleurd.
De thumbnail toont nu het eerste frame van de video — de geblurde kantoorshot
achter de avatars — maar pas als `achtergrondModus` gezet is. In de lege staat
blijft hij wit met silhouetten, zoals de Figma-referentie, zodat de preview
blijft meegroeien met je keuzes.

### 37. De basissamenvatting is een eigen rij op de paginakaart
Hij stond alleen in de voettekst, waardoor hij als doorgeefluik voelde in
plaats van als een stap die Esmee zelf aftekent. Nu staat hij als eerste rij
(B1 · Samenvatting) boven de talen, met eigen status en eigen knop — zoals
paragraaf 7.1 van het bouwplan hem ook beschreef.

Daarmee wordt Nederlands na dat akkoord `review-text`, zodat het script
evengoed een eigen rijactie krijgt. Voor Nederlands wijst die naar het
scriptscherm met audio, voor de andere talen naar het vertaalscherm. Esmee
tekent zo achtereenvolgens de samenvatting, het Nederlandse script en de
Nederlandse ondertiteling af; de collega's doen hun eigen taal.

Gevolg voor beslissing 31: bij `review-summary` en `review-nl` is er nu wél
een rijactie, dus de voettekst verdwijnt daar ook. Dat klopt met de regel —
hij verschijnt alleen als hij de enige ingang is — en maakt de kaart rustiger.

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
