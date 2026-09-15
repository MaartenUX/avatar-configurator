/** Gedeelde teksten. Eén plek, zodat de toon overal gelijk blijft. */

export const PRODUCTIE_STAPPEN = [
  { label: 'Samenvatting maken', meta: '1 min · automatisch' },
  { label: 'Basissamenvatting controleren', meta: '3 min · jij' },
  { label: 'Nederlands script en audio finetunen', meta: '5 min · jij' },
  { label: 'Vertalingen controleren', meta: '5 min per taal · collega’s' },
  { label: 'Video’s maken', meta: '20 min · automatisch' },
  { label: 'Ondertiteling controleren en publiceren', meta: '5 min · jij' },
]

/**
 * De drie fases op het eerste-keer-scherm. Fase 1 is waar je nu staat en
 * krijgt daarom de helft van de breedte; de andere twee vertellen alleen wat
 * er daarna komt.
 */
export const FASES = [
  {
    title: 'Configuratie',
    body: 'Dit stel je eenmalig in, voor al je video’s:',
    punten: [
      'Welke talen je gebruikt, en op welk taalniveau',
      'Welke avatar en stem bij elke taal horen',
      'Hoe de widget eruitziet op je website',
    ],
  },
  {
    title: 'Productie',
    body: 'Pagina voor pagina maak je een video. Jij controleert de samenvatting; per taal controleert een collega het script dat de avatar uitspreekt.',
  },
  {
    title: 'Beheer',
    body: 'Je zet de video live op je pagina en houdt bij hoe vaak hij per taal bekeken wordt.',
  },
]

export const WACHT_TIPS = {
  // Op dit moment is er nog geen audio; die komt pas bij het script.
  samenvatting: [
    'Straks kijk je of de essentie erin staat.',
    'Mist er iets wat een inwoner echt moet weten? Vul het aan.',
    'Details van de pagina laten we bewust weg.',
  ],
  video: [
    'Je hoeft niet te wachten; we laten het weten zodra hij klaar is.',
    'Straks controleer je de ondertiteling.',
    'Namen worden soms anders uitgesproken dan je verwacht.',
  ],
}

export const HOE = {
  samenvatting: [
    'Staat de essentie erin?',
    'Klopt het B1-niveau?',
    'Mist er iets wat een inwoner echt moet weten?',
  ],
  script: [
    'Luister eerst naar de audio.',
    'Klinkt een zin stroef? Pas hem aan.',
    'Wordt een naam verkeerd uitgesproken? Schrijf hem fonetisch.',
  ],
  vertaling: [
    'Luister eerst naar de audio.',
    'Klopt de betekenis met het Nederlands?',
    'Klinkt het als spreektaal, niet als een vertaling?',
  ],
  // Alleen over ondertitels: voor hoe de avatar eruitziet is er
  // "Video is niet oké?" onder de preview.
  video: [
    'Lopen de ondertitels gelijk met de spraak?',
    'Klopt de spelling van namen en plaatsen?',
    'Is geen regel te lang om in één blik te lezen?',
  ],
}

export const FAQ_KORT = [
  {
    q: 'De inhoud klopt niet.',
    a: 'De samenvatting volgt de pagina. Klopt er iets niet, overleg dan met de webredactie van die pagina en pas eerst de pagina aan.',
  },
  {
    q: 'Kan ik dit later nog wijzigen?',
    a: 'De tekst wel, zolang je nog niet akkoord bent. Na akkoord gaat de video in productie; opnieuw laten maken gaat dan van je gezamenlijke pot.',
  },
  {
    q: 'Hoeveel video’s mag ik maken?',
    a: 'Rechtsboven zie je hoeveel uitlegvideo’s je nog kunt maken. Daarnaast staat hoe vaak je nog een video opnieuw kunt laten maken; dat is één pot voor al je video’s samen.',
  },
]
