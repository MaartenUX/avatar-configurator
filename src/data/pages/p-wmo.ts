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
    {
      title: 'Wat is WMO-ondersteuning?',
      text: 'Lukt het niet meer om zelfstandig thuis te wonen? Dan kan de gemeente helpen. Denk aan hulp bij het huishouden, een aanpassing in huis, vervoer of dagbesteding. Dat heet ondersteuning vanuit de Wmo.',
    },
    {
      title: 'Hoe vraagt u het aan?',
      text: 'U meldt zich bij de gemeente, online of telefonisch. Dat kan ook iemand anders voor u doen. Na uw melding neemt een consulent binnen twee weken contact met u op voor een afspraak.',
    },
    {
      title: 'Het gesprek',
      text: 'De consulent komt bij u thuis. U bespreekt wat u zelf nog kunt, wat lastig gaat en wat uw familie of buren kunnen doen. Vraag gerust iemand om bij dit gesprek te zijn.',
    },
    {
      title: 'Wat kost het?',
      text: 'U betaalt een eigen bijdrage van maximaal 21 euro per maand. Het CAK stuurt die rekening. Binnen acht weken na uw melding hoort u welke ondersteuning u krijgt.',
    },
  ],

  translations: {},

  subtitles: {
    nl: [
      { t: '0:00', text: 'Lukt het niet meer om zelfstandig thuis te wonen?' },
      { t: '0:11', text: 'Dan kan de gemeente u helpen vanuit de Wmo.' },
      { t: '0:22', text: 'Denk aan hulp in het huishouden of vervoer.' },
      { t: '0:33', text: 'U meldt zich online of telefonisch bij de gemeente.' },
      { t: '0:44', text: 'Iemand anders mag dat ook voor u doen.' },
      { t: '0:55', text: 'Binnen twee weken belt een consulent u.' },
      { t: '1:06', text: 'Die komt bij u thuis voor een gesprek.' },
      { t: '1:17', text: 'Vraag gerust iemand om erbij te zijn.' },
      { t: '1:28', text: 'U betaalt maximaal 21 euro per maand.' },
      { t: '1:39', text: 'Binnen acht weken hoort u wat u krijgt.' },
    ],
  },
}
export default page
