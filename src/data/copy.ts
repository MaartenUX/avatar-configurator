/** Gedeelde teksten. Eén plek, zodat de toon overal gelijk blijft. */

export const PRODUCTIE_STAPPEN = [
  { label: 'Samenvatting maken', meta: '1 min · automatisch' },
  { label: 'Basissamenvatting controleren', meta: '3 min · jij' },
  { label: 'Nederlands script finetunen', meta: '5 min · jij' },
  { label: 'Vertalingen controleren', meta: '5 min per taal · collega’s' },
  { label: 'Video’s maken', meta: '20 min · automatisch' },
  { label: 'Ondertiteling controleren en publiceren', meta: '5 min · jij' },
]

export const FASES = [
  {
    title: 'Inrichten',
    body: 'Je kiest eenmalig de talen, de avatars en hoe de video eruitziet. Ongeveer een kwartier.',
  },
  {
    title: 'Video’s maken',
    body: 'Per pagina controleer je de tekst, je collega’s hun taal. De video’s maken wij.',
  },
  {
    title: 'Live',
    body: 'De video staat op je pagina. Je ziet hoe vaak hij per taal bekeken wordt.',
  },
]

export const WACHT_TIPS = {
  samenvatting: [
    'Luister straks eerst naar de audio.',
    'Pas zinnen aan als de essentie mist.',
    'Controleer of het B1-niveau klopt.',
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
