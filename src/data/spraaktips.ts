/**
 * De inhoud van "Zo maak je de tekst beter voor spraak", het zijpaneel bij
 * elke controlestap. Vervangt de HelpTray, die zijn uitleg leende uit het
 * configurator-vocabulaire en daardoor bij een scherm over ondertitels de
 * uitleg over de widget toonde.
 */
export const SPRAAKTIPS = [
  'Houd zinnen kort en zeg één ding per zin. Een stem kan geen komma’s laten horen.',
  'Schrijf getallen voluit als ze belangrijk zijn: “zesentwintig euro” klinkt rustiger dan “26 euro”.',
  'Schrijf afkortingen uit. “Bijvoorbeeld” in plaats van “bijv.”, en de eerste keer “Wet maatschappelijke ondersteuning” voluit.',
  'Klinkt een naam verkeerd? Schrijf hem op zoals hij klinkt, bijvoorbeeld “Berch-rode”.',
  'Maak van een opsomming een lopende zin. Streepjes hoor je niet.',
  'Zet het belangrijkste vooraan in de zin. De kijker kan niet terugspoelen.',
  'Lees je aanpassing hardop. Struikel jij erover, dan doet de stem dat ook.',
]

export const SPRAAK_FAQ = [
  {
    q: 'Kan ik de stem aanpassen?',
    a: 'Nee. De stem is in de configuratie gekozen en geldt voor al je video’s. Zo klinken ze allemaal hetzelfde, net als een vaste nieuwslezer.',
  },
  {
    q: 'De inhoud klopt niet.',
    a: 'De samenvatting volgt de pagina. Klopt er iets niet, overleg dan met de webredactie van die pagina en pas eerst de pagina aan.',
  },
  {
    q: 'Geldt mijn wijziging ook voor de andere talen?',
    a: 'Nee. De vertalingen staan al vast op de goedgekeurde basissamenvatting. Wat je hier verandert geldt alleen voor deze taal.',
  },
]

/** Ondertitels zijn geen spraak; die stap krijgt zijn eigen tips. */
export const ONDERTITEL_TIPS = [
  'Lees mee terwijl de video speelt. Een regel die te vroeg of te laat komt, valt meteen op.',
  'Houd een regel kort genoeg om in één blik te lezen — ongeveer tien woorden.',
  'Controleer de spelling van namen, straten en plaatsen; die haalt de automaat er nog wel eens naast.',
  'Twijfel je over de timing? Klik op de tijdcode, dan springt de video naar dat moment.',
]

export const ONDERTITEL_FAQ = [
  {
    q: 'De avatar ziet er vreemd uit.',
    a: 'Dat los je niet op in de ondertiteling. Gebruik “Video is niet oké?” onder de preview; dan maken we hem opnieuw.',
  },
  {
    q: 'Mag ik de tekst hier nog veranderen?',
    a: 'Je past alleen de ondertiteling aan, niet wat er gezegd wordt. De gesproken tekst is in de vorige stap goedgekeurd.',
  },
  {
    q: 'Wat zien bezoekers standaard?',
    a: 'De ondertiteling staat standaard aan. Bezoekers kunnen hem uitzetten in de speler.',
  },
]
