import type { PageContent } from '../types'

/** Dun: zie de toelichting in p-wmo.ts. */
const page: PageContent = {
  id: 'p-afval',
  url: 'https://www.bergrode.nl/afval-en-grofvuil',
  title: 'Afval en grofvuil',
  sourceText: '',
  thin: true,

  scenes: [
    {
      title: 'Welke bak wanneer?',
      text: 'In Bergrode heeft u drie bakken: grijs voor restafval, groen voor gft en blauw voor papier. Wanneer welke bak aan de weg mag, staat in de afvalkalender op deze pagina en in de app.',
    },
    {
      title: 'Glas, textiel en plastic',
      text: 'Glas, textiel en plastic brengt u naar de containers in de wijk. Op de kaart ziet u waar die staan. Zet niets naast een volle container; meld hem via het formulier, dan legen wij hem.',
    },
    {
      title: 'Grofvuil',
      text: 'Groot afval zoals een bank of een matras kunt u gratis laten ophalen. Maak daarvoor een afspraak. U mag maximaal drie kubieke meter per keer aanbieden, op de ochtend van de afspraak.',
    },
    {
      title: 'De milieustraat',
      text: 'Zelf wegbrengen kan ook, bij de milieustraat aan de Ringweg. Neem uw afvalpas mee. De milieustraat is open van dinsdag tot en met zaterdag, tussen negen en vier uur.',
    },
  ],

  translations: {},

  subtitles: {
    nl: [
      { t: '0:00', text: 'In Bergrode heeft u drie afvalbakken.' },
      { t: '0:11', text: 'Grijs voor restafval, groen voor gft, blauw voor papier.' },
      { t: '0:22', text: 'Wanneer welke bak mag, staat in de afvalkalender.' },
      { t: '0:33', text: 'Glas en textiel brengt u naar de wijkcontainers.' },
      { t: '0:44', text: 'Zet niets naast een volle container.' },
      { t: '0:55', text: 'Meld hem, dan legen wij hem.' },
      { t: '1:06', text: 'Groot afval laten we gratis ophalen.' },
      { t: '1:17', text: 'Maak daarvoor een afspraak.' },
      { t: '1:28', text: 'Zelf wegbrengen kan bij de milieustraat.' },
      { t: '1:39', text: 'Open van dinsdag tot en met zaterdag.' },
    ],
  },
}
export default page
