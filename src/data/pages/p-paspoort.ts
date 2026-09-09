import type { PageContent } from '../types'

/** Dun: zie de toelichting in p-wmo.ts. */
const page: PageContent = {
  id: 'p-paspoort',
  url: 'https://www.bergrode.nl/paspoort-of-id-kaart-aanvragen',
  title: 'Paspoort of ID-kaart aanvragen',
  sourceText: '',
  thin: true,

  scenes: [
    {
      title: 'Wat heeft u nodig?',
      text: 'Een paspoort of identiteitskaart vraagt u persoonlijk aan bij het gemeentehuis. Maak eerst een afspraak. Neem uw oude document mee en een pasfoto die niet ouder is dan zes maanden.',
    },
    {
      title: 'Paspoort of ID-kaart?',
      text: 'Met een identiteitskaart reist u binnen Europa. Buiten Europa heeft u meestal een paspoort nodig. Twijfelt u? Kijk waar u naartoe gaat en welk document dat land vraagt.',
    },
    {
      title: 'Voor kinderen',
      text: 'Kinderen hebben een eigen document nodig, ook baby’s. Beide ouders geven daarvoor toestemming. Is één ouder er niet bij? Neem dan een ondertekende verklaring en een kopie van het identiteitsbewijs mee.',
    },
    {
      title: 'Kosten en ophalen',
      text: 'Een paspoort kost 83 euro, een identiteitskaart 75 euro. U betaalt bij de aanvraag. Na vijf werkdagen haalt u het document zelf op; spoed kan tegen een toeslag.',
    },
  ],

  translations: {},

  subtitles: {
    nl: [
      { t: '0:00', text: 'Een paspoort vraagt u persoonlijk aan.' },
      { t: '0:11', text: 'Maak eerst een afspraak bij het gemeentehuis.' },
      { t: '0:22', text: 'Neem uw oude document en een pasfoto mee.' },
      { t: '0:33', text: 'Met een ID-kaart reist u binnen Europa.' },
      { t: '0:44', text: 'Daarbuiten heeft u meestal een paspoort nodig.' },
      { t: '0:55', text: 'Kinderen hebben een eigen document nodig.' },
      { t: '1:06', text: 'Beide ouders geven daarvoor toestemming.' },
      { t: '1:17', text: 'Een paspoort kost 83 euro, een ID-kaart 75.' },
      { t: '1:28', text: 'U betaalt bij de aanvraag.' },
      { t: '1:39', text: 'Na vijf werkdagen haalt u het zelf op.' },
    ],
  },
}
export default page
