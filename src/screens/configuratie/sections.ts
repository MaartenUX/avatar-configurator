import type { Config } from '../../state/types'

export type SectionId =
  | 'talen'
  | 'avatars'
  | 'videotype'
  | 'personaliseren'
  | 'widget'
  | 'vastleggen'

export interface SectionDef {
  id: SectionId
  index: number
  title: string
  subtitle: string
  /** Een sectie is gedaan zodra er een geldige keuze staat. */
  isDone: (c: Config) => boolean
}

export const SECTIONS: SectionDef[] = [
  {
    id: 'talen',
    index: 1,
    title: 'Taalniveau en talen',
    subtitle: 'In welke talen wil je je inwoners bereiken?',
    isDone: (c) => c.languages.length > 1,
  },
  {
    id: 'avatars',
    index: 2,
    title: 'Avatar en stem per taal',
    subtitle: 'Wie vertelt het verhaal? Klik om te zien en te horen.',
    isDone: (c) => c.languages.every((l) => Boolean(c.avatars[l])),
  },
  {
    id: 'videotype',
    index: 3,
    title: 'Type video',
    subtitle: 'Hoe lang mag een video duren?',
    isDone: (c) => Boolean(c.videoType),
  },
  {
    id: 'personaliseren',
    index: 4,
    title: 'Personaliseer de video',
    subtitle: 'Wat staat er achter de avatar?',
    isDone: (c) => c.backgrounds.length === 4,
  },
  {
    id: 'widget',
    index: 5,
    title: 'Widget: kleur en positie',
    subtitle: 'Waar komt de video op je pagina te staan?',
    isDone: (c) => Boolean(c.siteUrl && c.primary && c.widgetCorner),
  },
  {
    id: 'vastleggen',
    index: 6,
    title: 'Preview en vastleggen',
    subtitle: 'Bekijk het geheel en leg het vast.',
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
