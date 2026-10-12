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

### 38. De ondertitellijst scrollt niet meer in zijn eigen vak
In CHANGES-02 kreeg de lijst `max-h` met een eigen scrollgebied, zodat het
akkoordvak niet uit beeld zou schuiven bij dertig regels. Precies dat maakte
het akkoordvak "soort van fixed": de lijst schoof eronder door terwijl het vak
bleef staan. De lijst loopt nu gewoon door en het akkoordvak staat onder de
laatste regel, net als op de andere controleschermen.

### 39. Esmee tekent Nederlands en Engels zelf af
Vincent Bakker is vervallen. `reviewerFor` pakte bovendien alleen leden en
nooit de beheerder, waardoor Esmee nooit als controleur kon worden toegewezen;
de beheerder gaat nu voor. Marloes blijft als tweede Nederlandse collega in het
team staan, Emre doet Turks en Layla Arabisch.

---

# CHANGES-03.md — 1 oktober, na review met Sebastiaan

Niet te verwarren met de losse lijst van 15 september hierboven. Dit bestand
wint van PLAN.md, CHANGES-01 en CHANGES-02 waar het afwijkt. Alle punten A t/m
H zijn verwerkt:

- **A** productwaarheid: 1 t/m 5 ✓
- **B** header: 6, 7 ✓
- **C** scènes en overgangen: 8 t/m 15 ✓
- **D** avatar en stem: 16, 17 ✓
- **E** demo: 18, 19, 20 ✓
- **F** productieflow: 21 t/m 27 ✓
- **G** seed, testtaken, definition of done: 28, 29, 30 ✓
- **H** assets met fallbacks ✓

Omdat de typewijzigingen doorwerkten, zijn C8–C11, C13–C15 en F21, F22, F26 en
F27 meegegaan in de commit van A; het commitbericht zegt dat.

### 40. De build is een map geworden
Video's zijn te zwaar om in te bakken, dus `public/media/` wordt als losse
bestanden geserveerd en `vite-plugin-singlefile` is eruit. De controlescripts
starten daarom zelf een kleine statische server (`scripts/serve.mjs`) in plaats
van `file://` te openen. PLAN §3 en §11 en de README zijn hierop bijgewerkt.

### 41. Elke taal heeft een eigen timer
Na akkoord op de basissamenvatting komen de scripts van álle talen tegelijk
klaar (F21). Dat kan niet met één paginatimer: zodra een taal akkoord is, loopt
de video van die taal op zijn eigen klok door terwijl een andere taal nog op
controle wacht. `LangState` heeft daarom een eigen `timer`; de paginatimer doet
alleen nog de samenvatting en het aanmaken van de scripts.

### 42. De demotimer staat in de config, niet in het scherm
Je mag het wachtscherm verlaten en later terugkomen (E19). Een timer in de
component zou dat niet overleven. `config.demoTimer` en `config.demoKlaar`
worden bewaard, de ticker rondt hem af en laat de toast zien — ook als je de
app tussendoor hebt afgesloten.

### 43. De preview bij sectie 3 doet de overgang voor
C12 vraagt een frame dat elke 2,5 s wisselt. Dat is geen afspeelbare video maar
een demonstratie, dus `OvergangPreview` loopt vanzelf rond op de gedeelde klok,
zonder knop. Sectie 4 houdt de website-preview met het uitgeklapte videoframe,
zodat de twee stappen allebei iets anders laten zien (C13).

### 44. De voorbeeldzin blijft als ondertitel ín de avatartegel staan
D16 noemt "ondertitel met de zin eronder". Onder de tegel zou de ruimte
gereserveerd moeten worden voor drie regels tekst die je maar drie seconden
ziet; in de halve tegels van sectie 2 kost dat meer dan het oplevert. De zin
staat daarom onderin het kader, precies waar een ondertitel in de video ook
staat.

### 45. De demovideo duurt veertig seconden
E18 noemt het zelf een korte video met een voorbeeldtekst. Twee minuten
voorbeeldtekst in vier talen schrijven levert niets op voor de test. De demo
heeft zes scènes, twaalf ondertitelregels en duurt veertig seconden; de echte
video's blijven maximaal twee minuten. De tekst staat in `src/data/demo.ts` en
noemt de gemeente niet.

### 46. Een taalrij heeft een eigen tint
D16 vraagt om "de tint-achtergrond van de taalrij", maar die bestond nog niet.
`langTint()` geeft per taal een letterlijke classnaam — geen samengestelde,
want de Tailwind-scanner leest broncode als tekst.

### 47. PipelineStep heet ProductieStap
"Pipeline" hoort volgens de projectafspraken niet in deze app en stond
zichtbaar als componentnaam in de kit.

### 48. Twee bugs die bij de controle boven kwamen
Het staande videoframe werd op zijn hoogte gemeten (`h-full`), en klapte in een
kolom zonder eigen hoogte tot niets in: op het videocontrolescherm was de
preview 0 bij 0 pixels. Het meet nu de breedte. Daarnaast wees het Meer
weten-blok van sectie 4 naar het verdwenen id `personaliseren`.

---

# CHANGES-04 — 8 oktober, de media erin

Terminologie vanaf nu: de **widget** is de knop op de website, de **player** is
het venster dat opent als je erop klikt. "Thumbnail" uit CHANGES-02 betekent
widget.

### 49. Een clip hoort bij een avatar, niet bij een taal
Er zijn vier clips, één per taal, maar elke clip is opgenomen met het gezicht
van één bepaalde avatar. Spelen we de Nederlandse clip onder elke Nederlandse
avatar, dan klik je op Sanne en verschijnt Daan. De koppeling in
`src/lib/assets.ts` gaat daarom per avatar: nl-daan, en-emma, tr-zeynep en
ar-omar. De andere avatars houden het portret met de pulsanimatie.

### 50. Zeynep en Nour hebben hun gezicht geruild
De Turkse clip is opgenomen met het gezicht dat bij ons Nour was. Zeynep heeft
dat gezicht nu, Nour het gezicht met hoofddoek dat eerst van Zeynep was. Zo
toont de tegel dezelfde persoon als de clip en blijven beide portretten in
gebruik. De namen en de talen zijn niet veranderd. Wil Maarten het andersom,
dan is het twee regels in `src/data/avatars.ts`.

### 51. Eén demovideo voor alle talen
CHANGES-03 E20 ging uit van vier bestanden. Er is er één, en dat klopt met wat
hij laat zien: de vier avatars komen er na elkaar in langs. De taalkeuze onder
de speler wisselt dus niet van film. Alleen de demo krijgt een echt bestand
mee; de video's bij een pagina blijven gemockt, anders zou overal dezelfde demo
spelen.

### 52. De kantoorshots staan in public/media
Ze komen terug in de demovideo, dus preview en demo moeten hetzelfde beeld
laten zien. Twee staande shots wisselen elkaar af over de zes scènes
(1-2-1-2-1-2). Daarmee vervalt de glob op `src/assets/backgrounds`; die map is
leeg.

### 53. De widget is weer een kader met een balk
De liggende, vrijstaande variant uit CHANGES-03 A2 is teruggedraaid naar de
opzet van CHANGES-02 B8 en B9: één kader met een staand videoframe en daaronder
een balk in de huisstijlkleur met "Videovertaling". Zolang de huisstijl niet is
opgehaald is die balk gray-5; de tekst is dan donker in plaats van wit, want
wit op #e0e0e0 is onleesbaar. In het 3x3-raster is de knop te klein voor tekst
en blijft alleen de gekleurde balk over.

### 54. De player mag over de pagina heen steken
De buitenkant van de `SiteMock` knipt niets meer af; alleen de nagebootste
pagina zelf heeft nog een eigen overflow. Het paneel is breder dan de video,
zodat de taalrij op één regel onder de speler past.

### 55. De sticky voettekst blijft staan als de sectie niet actief is
Hij werd eerst weggehaald zodra een andere sectie actief werd. Dat verkortte de
pagina met vijftig pixels midden in een scrollanimatie, waardoor je altijd te
ver landde — precies de klacht uit C6. Hij blijft nu staan en is alleen
onzichtbaar, en het scrollen wacht tot React de wissel heeft doorgevoerd.

### 56b. Het portret volgt de clip, ook als gezichten zich herhalen
Bij de tweede levering kwamen er drie clips bij: de andere sekse voor
Nederlands, Engels en Turks. Ze zijn opgenomen met dezelfde vier gezichten als
de eerste vier, dus acht tegels delen vier gezichten. Sanne krijgt daarom het
blonde portret en Mehmet het portret van Omar. Gevolg: Nederlands en Engels
tonen dezelfde twee mensen en de Turkse en Arabische man zijn dezelfde. Dat is
bewust gekozen boven stille tegels naast bewegende buren — en het is niet
onrealistisch, want in het echte product spreekt één avatar meerdere talen. De
portretten `vrouw-donker` en `man-turks` zijn daardoor niet meer in gebruik.

### 56c. Eén avatar tegelijk aan het woord
De clips hebben geluid. Klik je snel achter elkaar, dan spraken er eerst twee
door elkaar. Een tegel zet nu eerst de vorige stil.

### 56. Niet uitgevoerd: de commits per sectie
Git kon in deze ronde niets schrijven: de losse objecten in `.git/objects`
staan op Dropbox als online-only en elke leespoging blijft hangen. De ronde is
daarom in één commit gegaan, gemaakt vanuit een verse kloon buiten Dropbox.

---

# Check van CHANGES-04 tegen de code — 12 oktober

Punt voor punt nagelopen in de code en in de browser op
`http://localhost:5174/#/configuratie`, niet tegen dit bestand.

| Punt | Stand | Waar |
|---|---|---|
| A1 clips en demovideo gekoppeld, geen terugval waar een bestand is | gedaan | `src/lib/assets.ts`, `AvatarTile`, `WidgetVenster`; `scripts/media-check.mjs` bewaakt het |
| A2 twee nieuwe kantoorshots, afgewisseld over zes scènes | gedaan | `public/media/backgrounds/`, `kantoorshot()` |
| B3 widget als kader met videoframe en balk | gedaan, maar vervangen | `WidgetKnop`; CHANGES-05 B3 maakt hem weer liggend |
| B4 player staand met de avatarrij er direct onder | gedaan | `WidgetVenster`; `config-flow.mjs` meet de afstand |
| B5 paneel over de pagina, niet afgesneden | gedaan | `SiteMock`, buitenkant zonder overflow-hidden |
| C6 scroll-margin = sticky balken + 24 px | gedaan | `SectionShell`, gemeten op 159 px |
| C7 tijdsindicatie weg uit de ProgressBar | gedaan | `Configuratie.tsx` |
| C7 "Stap x van 5" | nu gedaan | `SectionShell` telt `SECTIONS.length` |
| C8 ophaalknop op de lijn van het invoerveld | gedaan | `secties.tsx`, sectie widget |
| C9 label "Testscenario" weg, pill blijft | gedaan | `ShellLayout` |
| D10–D13 vijf secties in de nieuwe volgorde | nu gedaan | zie 57 |

De §D-punten zijn in de vorige ronde nooit aangekomen: CHANGES-04 werd als
prompt doorgegeven en die prompt eindigde bij C9. Vandaar dat alles t/m C9 wel
in de code zit en §D niet.

### 57. Vijf secties, widget vóór de scènes
De overgang *Logo tussen de scènes* heeft het logo en de huisstijlkleur nodig,
en die worden in de widget-sectie opgehaald. Die sectie staat nu op 3. Overgang
en scèneachtergronden zijn één sectie geworden met twee subkoppen; de sectie is
af als beide keuzes staan.

De stapteller leest `SECTIONS.length` in plaats van een vast getal, en de test
op `learnmore.ts` controleert nu dat er voor elke sectie een set is in plaats
van dat het er zes zijn. De sets van de oude secties 3 en 4 zijn samengevoegd.

Eén ding kwam daarbij boven: de widget in de `SiteMock` hing sinds CHANGES-04
aan de buitenste laag in plaats van aan de nagebootste pagina, waardoor hij
niet meer aan te klikken was zodra de pagina-inhoud eroverheen lag.

### 58. De widget is liggend, zonder foto, met een wisselende balk
CHANGES-05 B vervangt CHANGES-04 B3 en CHANGES-03 A2. Het kader blijft, maar de
bovenkant is wit: de gekozen avatars staan er vrijstaand naast elkaar met de
play-knop eroverheen, en een taal zonder gekozen avatar toont een grijs
silhouet. De foto hoort bij de video, niet bij de knop — de player houdt zijn
kantoorshot.

De balk wisselt elke 2,5 seconde van taal en fadet daarbij uit en in. Hij hangt
aan de gedeelde klok, dus alle widgets op het scherm lopen gelijk en er is geen
eigen interval. De vertalingen staan in `src/data/widget.ts`; Arabisch krijgt
`dir="rtl"`.

### 59. De topbalk in de configurator stond er al
C6 gaat uit van een ontbrekende header. In de browser staat hij er wel: hij is
`sticky top-0` en blijft tijdens het scrollen staan, met de stappenbalk eronder
op `top-[72px]`. Samen 135 px; een sectie landt op 159 px, dus de offset uit
CHANGES-04 C6 klopt nog. Niets aan gedaan behalve nameten. Moet de balk in de
configurator juist wég, dan is het één regel.

### 60. De scenariokiezer is geen `select` meer
Een scheidslijn en een icoon passen niet in een `select`, en "Alles wissen"
hoort zichtbaar los te staan van de vier standen. Het is nu een eigen menu met
een vinkje bij de actieve stand. Wissen haalt de sleutel uit `localStorage` en
herlaadt naar `?scenario=eerste`; een herlaad is de enige manier om zeker te
weten dat er niets blijft hangen. De verborgen resetknop in de voettekst van
het overzicht is vervallen (PLAN §8).

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

5. Er zijn nog maar twee kantoorshots zonder mensen (`kantoor-1` en
   `kantoor-3`); CHANGES-03 A5 vraagt er zes, staand en leeg. De zes scènes
   wisselen die twee nu af. Zichtbaar in de preview en in sectie 4.

6. Zeven van de acht avatars in de testtalen hebben een clip; alleen Nour
   wacht nog op `ar-nour.webm`. De avatars in de talen buiten de test (Duits,
   Frans, Pools, Grieks, Spaans) hebben er geen en pulseren.

7. De clips zijn VP9 met een alfakanaal. Chrome en Firefox tonen ze vrijstaand,
   Safari zet er een zwarte achtergrond achter. Voer de test in Chrome uit.

8. De demovideo weegt 16 MB en staat in de repo, want Vercel serveert hem
   vanaf `public/media/`. Dat is nu te doen; komen er meer video's bij, dan
   hoort er een echte mediahost bij.
