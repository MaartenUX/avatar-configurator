import type { LearnMoreDef } from './types'

/**
 * Inhoud van de "Meer weten"-overlay per configuratiesectie, en van de
 * de FAQ op /hulp. Dezelfde vragen staan op beide plekken, zodat een
 * antwoord altijd op twee plekken vindbaar is.
 */
export const LEARN_MORE: LearnMoreDef[] = [
  {
    id: 'talen',
    title: 'Taalniveau en talen',
    body:
      'Het taalniveau bepaalt hoe de samenvatting geschreven wordt. B1 is de norm voor overheidsteksten: korte zinnen, gewone woorden, één boodschap per zin. Ongeveer zeven op de tien Nederlanders leest comfortabel op dit niveau. Nederlands staat altijd aan en is de basis voor elke vertaling.',
    features: [
      { icon: 'Languages', label: 'Nederlands plus vier talen' },
      { icon: 'BookOpen', label: 'B1 of B2' },
      { icon: 'Users', label: 'Een collega per taal' },
      { icon: 'RefreshCw', label: 'Eén bron voor alle talen' },
    ],
    faq: [
      {
        q: 'Waarom B1 en niet gewoon onze eigen tekst?',
        a: 'Een uitlegvideo wordt één keer bekeken, zonder terugbladeren. Op B1 blijft de kern hangen bij de meeste inwoners. Kiest u B2, dan mogen de zinnen langer zijn en blijft meer vakjargon staan.',
      },
      {
        q: 'We hebben meer dan vier talen nodig.',
        a: 'Dat kan, neem daarvoor contact op met XS2Content. Houd er rekening mee dat elke taal een collega nodig heeft die de tekst controleert voordat de video gemaakt wordt.',
      },
      {
        q: 'Kunnen we later een taal toevoegen?',
        a: 'Nee. De configuratie ligt na het vastleggen vast. Een taal toevoegen betekent een nieuwe set-up en nieuwe video’s voor al uw pagina’s.',
      },
    ],
  },
  {
    id: 'avatars',
    title: 'Avatar en stem',
    body:
      'Per taal kiest u één avatar. Die persoon spreekt straks al uw video’s in die taal in, op elke pagina. Dat is bewust: een vaste presentator maakt uw video’s herkenbaar, zoals een vaste nieuwslezer dat doet. Klik op een avatar om hem te zien en te horen met een voorbeeldzin in die taal.',
    features: [
      { icon: 'UserRound', label: 'Twee keuzes per taal' },
      { icon: 'Volume2', label: 'Horen voor u kiest' },
      { icon: 'Sparkles', label: 'Advies per taal' },
      { icon: 'Lock', label: 'Daarna vast' },
    ],
    faq: [
      {
        q: 'Kan ik later een andere avatar kiezen?',
        a: 'Nee. Alle video’s zouden dan opnieuw gemaakt moeten worden, want de avatar zit in elk beeld. Neem de tijd voor deze keuze en beluister beide stemmen.',
      },
      {
        q: 'Waarom staan er per taal andere namen?',
        a: 'Een Turkse video met een Nederlandse presentatricenaam voelt vreemd. Daarom heeft elke taal eigen namen en stemmen die bij die taal passen.',
      },
      {
        q: 'Wat betekent "meest gekozen"?',
        a: 'Dat is wat andere organisaties voor die taal kozen, met de reden erbij. Het is een advies, geen voorschrift.',
      },
    ],
  },
  {
    id: 'scenes',
    title: 'Scènes, overgangen en achtergronden',
    body:
      'Een uitlegvideo duurt maximaal twee minuten en bestaat uit vier tot zes korte scènes. Elke video begint met een korte intro en eindigt met een outro; daartussen zit de inhoud. Tussen twee scènes zit een overgang, en die kiest u hier. Achter de avatar staat per scène een achtergrond: standaard een rustig kantoorinterieur, per scène een ander, zodat de video visueel afwisselt zonder af te leiden. U kunt er ook eigen foto’s voor gebruiken, bijvoorbeeld van uw gemeentehuis of van de wijk waar de pagina over gaat.',
    features: [
      { icon: 'Timer', label: 'Maximaal 2 minuten' },
      { icon: 'Layers', label: 'Vier tot zes scènes' },
      { icon: 'Sparkles', label: 'Eén overgang' },
      { icon: 'Image', label: 'Eigen foto per scène' },
    ],
    faq: [
      {
        q: 'Waarom kan een video niet langer dan twee minuten?',
        a: 'Bij informatieve video’s haakt het grootste deel van de kijkers snel af. Wat daarna komt, wordt zelden gezien. Twee minuten is genoeg voor de kern.',
      },
      {
        q: 'Kan ik de overgang later wijzigen?',
        a: 'Nee, die zit in elke video gebakken. Veranderen betekent alle video’s opnieuw maken.',
      },
      {
        q: 'Kan ik de lengte per pagina instellen?',
        a: 'Nee. Elke video is maximaal twee minuten, zodat ze op elkaar lijken.',
      },
      {
        q: 'Welke foto’s werken goed als achtergrond?',
        a: 'Rustige beelden zonder mensen, staand en minstens 1080 pixels breed. Liggend mag ook: we snijden er een staand stuk uit. De avatar staat er half voor, dus houd het midden vrij.',
      },
      {
        q: 'Mag ik foto’s van inwoners gebruiken?',
        a: 'Alleen met hun toestemming. Kies bij twijfel een kantoorshot of een beeld zonder herkenbare personen.',
      },
    ],
  },
  {
    id: 'widget',
    title: 'De widget op uw site',
    body:
      'De video verschijnt als een klein blok in een hoek van uw pagina. Bezoekers klikken erop, kiezen een taal en zien de video. We halen uw logo en kleuren op uit uw website, zodat de widget bij uw huisstijl past. Uw webbeheerder plaatst er één regel code voor op de pagina.',
    features: [
      { icon: 'MousePointerClick', label: 'Eén regel code' },
      { icon: 'Palette', label: 'Uw eigen kleuren' },
      { icon: 'LayoutGrid', label: 'Vier hoeken' },
      { icon: 'Smartphone', label: 'Werkt op mobiel' },
    ],
    faq: [
      {
        q: 'Wat gebeurt er met ons logo?',
        a: 'We gebruiken het in de widget en in de hoek van de video. Het wordt niet gedeeld met derden en niet voor iets anders gebruikt.',
      },
      {
        q: 'Hoe werkt de widget technisch?',
        a: 'Uw webbeheerder plakt één scriptregel in de pagina. De widget laadt daarna vanzelf en vertraagt uw pagina niet, omdat de video pas laadt bij een klik.',
      },
      {
        q: 'Wat zien bezoekers precies?',
        a: 'Een klein blok met een afbeelding en de tekst "Bekijk uitleg". Na een klik verschijnt de taalkeuze en daarna de video, met ondertiteling.',
      },
    ],
  },
  {
    id: 'vastleggen',
    title: 'Vastleggen',
    body:
      'Na het vastleggen kunt u de configuratie wel bekijken, maar niet meer wijzigen. Dat is geen administratieve regel: avatar, achtergronden en huisstijl zitten in elk gerenderd beeld. Iets veranderen betekent alle video’s opnieuw maken.',
    features: [
      { icon: 'ShieldCheck', label: 'Eén keer instellen' },
      { icon: 'Eye', label: 'Demo om te delen' },
      { icon: 'Eye', label: 'Altijd in te zien' },
      { icon: 'CircleHelp', label: 'Hulp bij twijfel' },
    ],
    faq: [
      {
        q: 'Wat als ik me toch vergist heb?',
        a: 'Neem contact op met XS2Content. Opnieuw instellen kan, maar betekent een volledig nieuwe set-up en nieuwe video’s voor al uw pagina’s.',
      },
      {
        q: 'Wanneer horen mijn collega’s hiervan?',
        a: 'Pas als u de eerste pagina heeft toegevoegd en de basissamenvatting heeft goedgekeurd. Dan krijgen ze één bericht met wat er van hen wordt verwacht.',
      },
      {
        q: 'Kan ik nu al stoppen en later verder?',
        a: 'Ja. Alles wat u heeft ingevuld blijft staan; u komt terug op de plek waar u gebleven was.',
      },
    ],
  },
]

const BY_ID = Object.fromEntries(LEARN_MORE.map((l) => [l.id, l]))
export const learnMore = (id: string): LearnMoreDef | undefined => BY_ID[id]

/**
 * Het zijpaneel bij de basissamenvatting gaat over B1, niet over spraak: daar
 * schrijf je de tekst die de basis wordt voor alle talen (CHANGES-06 C6). De
 * spraaktips blijven bij het script en de vertalingen staan.
 */
export const B1_TIPS = [
  'Houd zinnen kort: maximaal vijftien woorden.',
  'Eén boodschap per zin. Twee dingen in één zin leest niemand goed.',
  'Gebruik woorden die mensen kennen. Geen vaktermen, geen afkortingen.',
  'Schrijf actief: “u vraagt de vergunning aan”, niet “de vergunning wordt aangevraagd”.',
  'Wees concreet: “binnen 2 weken” zegt meer dan “op korte termijn”.',
  'Zet er alleen in wat een inwoner echt moet weten. De rest staat op de pagina.',
]

export const B1_FAQ = [
  {
    q: 'Mag ik informatie toevoegen?',
    a: 'Ja, maar houd het bij de essentie. Details horen op de pagina zelf, niet in de video.',
  },
  {
    q: 'De inhoud klopt niet.',
    a: 'De samenvatting volgt de pagina. Klopt er iets niet, overleg dan met de webredactie van die pagina en pas eerst de pagina aan.',
  },
]

/**
 * Wat er achter de teller rechtsboven zit. Hij staat op drie plekken: in de
 * header, bij "Dit wordt video x van y" en in de lege staat van het overzicht
 * (CHANGES-08 A). Eén tekst, zodat die drie niet uit elkaar lopen.
 */
export const ABONNEMENT = {
  label: 'Je abonnement',
  videos: 'Elke pagina die je toevoegt is één uitlegvideo, in alle talen samen.',
  reruns:
    'Vind je een video niet goed? Meld het bij XS2Content, dat kost niets. Zelf opnieuw maken kan vijf keer per abonnement.',
  faq: [
    {
      q: 'Wat als mijn video’s op zijn?',
      a: 'Neem contact op met XS2Content; uitbreiden kan altijd.',
    },
    {
      q: 'Telt tekst opnieuw genereren mee?',
      a: 'Nee. Alleen een video opnieuw maken kost er één van de vijf.',
    },
    {
      q: 'Telt een pagina opnieuw maken na een wijziging mee?',
      a: 'Ja, dat is een nieuwe uitlegvideo.',
    },
  ],
}
