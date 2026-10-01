import type { PageContent } from '../types'

/**
 * Dun: staat als live kaartje in het overzicht. Wel een volledige Nederlandse
 * samenvatting en ondertiteling, want het beheerscherm toont die. Vertalingen
 * ontbreken bewust; die opent tijdens de test niemand.
 */
const page: PageContent = {
  id: 'p-wmo',
  url: 'https://www.bergrode.nl/wmo-ondersteuning-aanvragen',
  title: 'WMO-ondersteuning aanvragen',
  sourceText: '',
  thin: true,

  scenes: [
    { text: 'Dit is een korte uitleg van de pagina WMO-ondersteuning aanvragen van gemeente Bergrode.' },
    { text: 'Lukt het niet meer om zelfstandig thuis te wonen? Dan kan de gemeente helpen. Denk aan hulp bij het huishouden, een aanpassing in huis, vervoer of dagbesteding. Dat heet ondersteuning vanuit de Wmo.' },
    { text: 'U meldt zich bij de gemeente, online of telefonisch. Dat kan ook iemand anders voor u doen. Na uw melding neemt een consulent binnen twee weken contact met u op voor een afspraak.' },
    { text: 'De consulent komt bij u thuis. U bespreekt wat u zelf nog kunt, wat lastig gaat en wat uw familie of buren kunnen doen. Vraag gerust iemand om bij dit gesprek te zijn.' },
    { text: 'U betaalt een eigen bijdrage van maximaal 21 euro per maand. Het CAK stuurt die rekening. Binnen acht weken na uw melding hoort u welke ondersteuning u krijgt.' },
    { text: 'Dank je wel voor het kijken. Meer informatie vind je op deze pagina.' },
  ],

  translations: {},

  subtitles: {
    nl: [
      { t: '0:00', text: 'Dit is een korte uitleg van de' },
      { t: '0:03', text: 'pagina WMO-ondersteuning aanvragen' },
      { t: '0:08', text: 'van gemeente Bergrode.' },
      { t: '0:11', text: 'Lukt het niet meer om zelfstandig' },
      { t: '0:15', text: 'thuis te wonen?' },
      { t: '0:18', text: 'Dan kan de gemeente helpen.' },
      { t: '0:22', text: 'Denk aan hulp bij het huishouden,' },
      { t: '0:26', text: 'een aanpassing in huis, vervoer of' },
      { t: '0:30', text: 'dagbesteding.' },
      { t: '0:33', text: 'Dat heet ondersteuning vanuit de' },
      { t: '0:37', text: 'Wmo.' },
      { t: '0:39', text: 'U meldt zich bij de gemeente,' },
      { t: '0:43', text: 'online of telefonisch.' },
      { t: '0:47', text: 'Dat kan ook iemand anders voor u' },
      { t: '0:51', text: 'doen.' },
      { t: '0:53', text: 'Na uw melding neemt een consulent' },
      { t: '0:57', text: 'binnen twee weken contact met u op' },
      { t: '1:02', text: 'voor een afspraak.' },
      { t: '1:05', text: 'De consulent komt bij u thuis.' },
      { t: '1:09', text: 'U bespreekt wat u zelf nog kunt,' },
      { t: '1:13', text: 'wat lastig gaat en wat uw familie' },
      { t: '1:17', text: 'of buren kunnen doen.' },
      { t: '1:20', text: 'Vraag gerust iemand om bij dit' },
      { t: '1:24', text: 'gesprek te zijn.' },
      { t: '1:27', text: 'U betaalt een eigen bijdrage van' },
      { t: '1:31', text: 'maximaal 21 euro per maand.' },
      { t: '1:35', text: 'Het CAK stuurt die rekening.' },
      { t: '1:39', text: 'Binnen acht weken na uw melding' },
      { t: '1:43', text: 'hoort u welke ondersteuning u' },
      { t: '1:47', text: 'krijgt.' },
      { t: '1:49', text: 'Dank je wel voor het kijken.' },
      { t: '1:53', text: 'Meer informatie vind je op deze' },
      { t: '1:57', text: 'pagina.' },
    ],
  },
}

export default page
