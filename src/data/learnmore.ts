import type { LearnMoreDef } from './types'

/**
 * Inhoud van de "Meer weten"-overlay per configuratiesectie, en van de
 * HelpTray in de spaken. Dezelfde vragen staan in de FAQ op /hulp, zodat een
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
    id: 'videotype',
    title: 'Type video',
    body:
      'Een vaste samenvatting duurt maximaal drie minuten en heeft vier tot zes scènes. Drie minuten is ongeveer de grens van wat iemand aandachtig uitzit. Een adaptieve samenvatting past zich aan de lengte van de pagina aan: ongeveer tien procent van de leestijd, met een maximum van zes minuten.',
    features: [
      { icon: 'Timer', label: 'Maximaal 3 of 6 minuten' },
      { icon: 'Layers', label: 'Vier tot zes scènes' },
      { icon: 'Gauge', label: 'Vast of meegroeiend' },
      { icon: 'Eye', label: 'Geldt voor alle pagina’s' },
    ],
    faq: [
      {
        q: 'Waarom kan een video niet langer dan drie minuten?',
        a: 'Bij informatieve video’s haakt het grootste deel van de kijkers na drie minuten af. Wat daarna komt, wordt zelden gezien.',
      },
      {
        q: 'Wat als onze pagina heel lang is?',
        a: 'Dan is adaptief een goede keuze: de video groeit mee met de leestijd. De samenvatting blijft wel een samenvatting; details laten we bewust weg.',
      },
      {
        q: 'Kan ik de lengte per pagina instellen?',
        a: 'Nee. De keuze geldt voor al uw video’s, zodat ze op elkaar lijken.',
      },
    ],
  },
  {
    id: 'personaliseren',
    title: 'Personaliseer de video',
    body:
      'Achter de avatar staat per scène een achtergrond. Standaard is dat een rustig kantoorinterieur, per scène een ander, zodat de video visueel afwisselt zonder af te leiden. U kunt per scène een eigen foto gebruiken, bijvoorbeeld van uw gemeentehuis of van de wijk waar de pagina over gaat.',
    features: [
      { icon: 'Image', label: 'Vier scènes' },
      { icon: 'Upload', label: 'Eigen foto per scène' },
      { icon: 'Building2', label: 'Neutrale kantoorshots' },
      { icon: 'Copy', label: 'Eén foto voor alles' },
    ],
    faq: [
      {
        q: 'Welke foto’s werken goed?',
        a: 'Rustige beelden zonder mensen op de voorgrond, liggend en minstens 1280 pixels breed. De avatar staat er half voor, dus houd het midden vrij.',
      },
      {
        q: 'Mag ik foto’s van inwoners gebruiken?',
        a: 'Alleen met hun toestemming. Kies bij twijfel een kantoorshot of een beeld zonder herkenbare personen.',
      },
      {
        q: 'Kan ik dit later wijzigen?',
        a: 'Nee, ook dit ligt na het vastleggen vast. De achtergrond zit in elk gerenderd beeld.',
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
      'Na het vastleggen kunt u de configuratie wel bekijken, maar niet meer wijzigen. Dat is geen administratieve regel: avatar, achtergronden en huisstijl zitten in elk gerenderd beeld. Iets veranderen betekent alle video’s opnieuw maken, en dat kost opnieuw credits.',
    features: [
      { icon: 'ShieldCheck', label: 'Eén keer instellen' },
      { icon: 'Mail', label: 'Bevestiging per mail' },
      { icon: 'Eye', label: 'Altijd in te zien' },
      { icon: 'CircleHelp', label: 'Hulp bij twijfel' },
    ],
    faq: [
      {
        q: 'Wat als ik me toch vergist heb?',
        a: 'Neem contact op met XS2Content. Opnieuw instellen kan, maar betekent een volledig nieuwe set-up en nieuwe video’s voor al uw pagina’s.',
      },
      {
        q: 'Wie krijgt de bevestigingsmail?',
        a: 'Alle accounts onder uw hoofdaccount, zodat uw collega’s weten dat ze aan de slag kunnen.',
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
