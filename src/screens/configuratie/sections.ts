import type { Config } from '../../state/types'

export type SectionId =
  | 'talen'
  | 'avatars'
  | 'scenes'
  | 'achtergronden'
  | 'widget'
  | 'vastleggen'

export interface SectionDef {
  id: SectionId
  index: number
  title: string
  subtitle: string
  /** Staat altijd direct onder de intro, vóór de keuzes. */
  weten?: string[]
  /** Een sectie is gedaan zodra er een geldige keuze staat. */
  isDone: (c: Config) => boolean
}

export const SECTIONS: SectionDef[] = [
  {
    id: 'talen',
    index: 1,
    title: 'Taalniveau en talen',
    subtitle: 'In welke talen wil je je inwoners bereiken?',
    weten: [
      'B1 is de norm voor overheidsteksten: korte zinnen en gewone woorden.',
      'Nederlands staat vast en is de basis voor elke vertaling.',
      'Elke taal heeft een collega nodig die hem controleert voordat de video wordt gemaakt.',
    ],
    isDone: (c) => c.languages.length > 1,
  },
  {
    id: 'avatars',
    index: 2,
    title: 'Avatar en stem per taal',
    subtitle: 'Wie vertelt het verhaal?',
    weten: [
      'Kies per taal wie het beste past bij je inwoners.',
      'Een mix van mannen en vrouwen over de talen heen is prima — elke cultuur heeft een andere voorkeur.',
      'Klik op een avatar om hem te zien en te horen.',
    ],
    isDone: (c) => c.languages.every((l) => Boolean(c.avatars[l])),
  },
  {
    id: 'scenes',
    index: 3,
    title: 'Scènes en overgangen',
    subtitle: 'Een uitlegvideo duurt maximaal 2 minuten en bestaat uit 4 tot 6 korte scènes.',
    weten: [
      'We knippen de informatie in korte blokken. Dat houdt de aandacht vast.',
      'Elke video begint met een korte intro en eindigt met een outro.',
      'Tussen de scènes zit een overgang — die kies je hier.',
    ],
    isDone: (c) => Boolean(c.transition),
  },
  {
    id: 'achtergronden',
    index: 4,
    title: 'Achtergronden',
    subtitle: 'Wat staat er achter de avatar?',
    weten: [
      'Achtergronden worden altijd licht geblurd, zodat de avatar op de voorgrond blijft.',
      'Rustige beelden zonder mensen werken het best.',
    ],
    isDone: (c) => c.achtergrondModus === 'standaard' || c.backgrounds.length > 0,
  },
  {
    id: 'widget',
    index: 5,
    title: 'Widget: kleur en positie',
    subtitle: 'Hoe past de video bij je website?',
    weten: [
      'We halen je logo en kleuren op uit je website; je hoeft niets te uploaden.',
      'De widget staat standaard rechtsonder. Dat kun je aanpassen onder “Meer specificaties”.',
    ],
    isDone: (c) => Boolean(c.siteUrl && c.primary && c.widgetCorner),
  },
  {
    id: 'vastleggen',
    index: 6,
    title: 'Maak een demo',
    subtitle: 'Controleer alles in het echt voordat je het vastlegt.',
    isDone: (c) => c.status === 'locked',
  },
]

/** Afgeleid, niet opgeslagen: anders blijft een sectie afgevinkt nadat de
 *  gebruiker zijn keuze weer wist. */
export const doneSections = (c: Config) =>
  SECTIONS.filter((s) => s.isDone(c)).map((s) => s.index)

/** De eerste sectie die nog niet af is; daar kom je terug na onderbreken. */
export const firstOpenSection = (c: Config) =>
  SECTIONS.find((s) => !s.isDone(c))?.index ?? SECTIONS.length
