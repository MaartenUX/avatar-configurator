import type { LangStatus, PageStatus } from '../state/types'

export type StatusKey =
  | 'todo'
  | 'waiting'
  | 'review'
  | 'generating'
  | 'approved'
  | 'live'
  | 'error'

export interface StatusStyle {
  label: string
  /** Stip in de Indicator. */
  dot: string
  /** Achtergrond + tekst van de Badge. */
  chip: string
  text: string
  ring: string
  bar: string
}

/**
 * De enige plek waar een status naar classes vertaalt.
 *
 * Let op: de Tailwind v4-scanner leest broncode als tekst. `bg-${x}-tint`
 * levert dus géén CSS op. Alles hieronder staat daarom voluit.
 *
 * De basisgroen (#BDFCB0) is een tintsterkte, anders dan de zes andere
 * families: als stip of balk op wit is hij vrijwel onzichtbaar. Daarom
 * gebruiken approved en live green-shade voor stip en balk, en green
 * alleen als vlak.
 */
export const STATUS: Record<StatusKey, StatusStyle> = {
  todo: {
    label: 'Nog te doen',
    dot: 'bg-gray-4',
    chip: 'bg-gray-6 text-gray-2',
    text: 'text-gray-3',
    ring: 'ring-gray-5',
    bar: 'bg-gray-4',
  },
  waiting: {
    label: 'Wachten',
    dot: 'bg-orange',
    chip: 'bg-orange-tint text-orange-shade',
    text: 'text-orange-shade',
    ring: 'ring-orange',
    bar: 'bg-orange',
  },
  review: {
    label: 'Controleren',
    dot: 'bg-blue',
    chip: 'bg-blue-tint text-blue-shade',
    text: 'text-blue-shade',
    ring: 'ring-blue',
    bar: 'bg-blue',
  },
  generating: {
    label: 'Wordt gemaakt',
    dot: 'bg-turq',
    chip: 'bg-turq-tint text-turq-shade',
    text: 'text-turq-shade',
    ring: 'ring-turq',
    bar: 'bg-turq',
  },
  approved: {
    label: 'Goedgekeurd',
    dot: 'bg-green-shade',
    chip: 'bg-green-tint text-green-shade',
    text: 'text-green-shade',
    ring: 'ring-green-shade',
    bar: 'bg-green-shade',
  },
  live: {
    label: 'Live',
    dot: 'bg-green-shade',
    chip: 'bg-green text-green-shade',
    text: 'text-green-shade',
    ring: 'ring-green-shade',
    bar: 'bg-green-shade',
  },
  error: {
    label: 'Er ging iets mis',
    dot: 'bg-red',
    chip: 'bg-red-tint text-red-shade',
    text: 'text-red-shade',
    ring: 'ring-red',
    bar: 'bg-red',
  },
}

export const STATUS_KEYS = Object.keys(STATUS) as StatusKey[]

export const LANG_STATUS: Record<LangStatus, StatusKey> = {
  waiting: 'waiting',
  'review-text': 'review',
  generating: 'generating',
  'review-video': 'review',
  approved: 'approved',
  live: 'live',
}

export const PAGE_STATUS: Record<PageStatus, StatusKey> = {
  summarizing: 'generating',
  'review-summary': 'review',
  'review-nl': 'review',
  'in-translation': 'generating',
  'ready-to-publish': 'approved',
  live: 'live',
}

export const langStatusStyle = (s: LangStatus) => STATUS[LANG_STATUS[s]]
export const pageStatusStyle = (s: PageStatus) => STATUS[PAGE_STATUS[s]]

/** Nederlandse labels per taalstatus, specifieker dan het generieke statuslabel. */
export const LANG_STATUS_LABEL: Record<LangStatus, string> = {
  waiting: 'Wacht op het script',
  'review-text': 'Script controleren',
  generating: 'Video wordt gemaakt',
  'review-video': 'Video controleren',
  approved: 'Goedgekeurd',
  live: 'Live',
}
