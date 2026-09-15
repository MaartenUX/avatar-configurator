import type { Config, Lang, Page } from '../state/types'
import { pageContent } from './index'

export type ScenarioId = 'eerste' | 'tweede' | 'derde' | 'emre'

export interface Scenario {
  id: ScenarioId
  label: string
  user: 'esmee' | 'emre'
}

/** De vier standen waartussen je tijdens de test kunt schakelen. */
export const SCENARIOS: Scenario[] = [
  { id: 'eerste', label: 'Esmee — eerste keer', user: 'esmee' },
  { id: 'tweede', label: 'Esmee — tweede keer', user: 'esmee' },
  { id: 'derde', label: 'Esmee — derde keer', user: 'esmee' },
  { id: 'emre', label: 'Emre — collega Turks', user: 'emre' },
]

export const VIDEOS_TOTAL = 10
/** Opnieuw maken komt uit één gezamenlijke pot voor alle video's. */
export const RERUNS_TOTAL = 5

export const EMPTY_CONFIG: Config = {
  status: 'empty',
  doneSections: [],
  scrollY: 0,
  siteUrl: '',
  widgetCorner: 'rb',
  widgetMargin: { x: 24, y: 24 },
  level: 'B1',
  languages: ['nl'],
  avatars: {},
  backgrounds: [],
}

/** De configuratie zoals Esmee hem heeft vastgelegd: vier talen naast Nederlands. */
export const SEED_CONFIG: Config = {
  status: 'locked',
  doneSections: [1, 2, 3, 4, 5, 6],
  scrollY: 0,
  siteUrl: 'https://www.bergrode.nl',
  logo: 'bergrode',
  primary: '#1F5E58',
  secondary: '#FF996D',
  widgetCorner: 'rb',
  widgetMargin: { x: 24, y: 24 },
  achtergrondModus: 'standaard',
  level: 'B1',
  languages: ['nl', 'en', 'tr', 'ar'],
  avatars: { nl: 'nl-sanne', en: 'en-emma', tr: 'tr-zeynep', ar: 'ar-nour' },
  videoType: 'vast',
  backgrounds: ['kantoor-1', 'kantoor-2', 'kantoor-3', 'kantoor-4'],
  signedAt: '2026-09-09T09:20:00.000Z',
}

const contentOf = (id: string) => {
  const c = pageContent(id)
  return {
    url: c?.url ?? '',
    title: c?.title ?? id,
    scenes: c?.scenes ?? [],
    translations: c?.translations ?? {},
    subtitles: c?.subtitles ?? {},
  }
}

const REVIEWERS: Record<string, string> = {
  nl: 'Vincent Bakker',
  en: 'Vincent Bakker',
  tr: 'Emre Yılmaz',
  ar: 'Layla Haddad',
}

const livePage = (id: string, views: Page['views'], createdAt: string): Page => ({
  id,
  ...contentOf(id),
  status: 'live',
  langs: {
    nl: { status: 'live', reviewer: REVIEWERS.nl },
    en: { status: 'live', reviewer: REVIEWERS.en },
    tr: { status: 'live', reviewer: REVIEWERS.tr },
    ar: { status: 'live', reviewer: REVIEWERS.ar },
  },
  views,
  createdAt,
  samenvattingDoor: 'Esmee de Vries',
})

/** De pagina waar de statusmix uit het bouwplan op zit: elke taal een andere stand. */
const bijstandInProductie = (): Page => ({
  id: 'p-bijstand',
  ...contentOf('p-bijstand'),
  status: 'in-translation',
  langs: {
    nl: { status: 'approved', reviewer: REVIEWERS.nl },
    en: { status: 'review-text', reviewer: REVIEWERS.en },
    tr: { status: 'review-video', reviewer: REVIEWERS.tr },
    ar: { status: 'generating', reviewer: REVIEWERS.ar, etaMin: 12 },
  },
  views: {},
  createdAt: '2026-09-08T14:10:00.000Z',
  samenvattingDoor: 'Esmee de Vries',
})

const wmo = () => livePage('p-wmo', { nl: 1240, en: 86, tr: 152, ar: 74 }, '2026-08-19T10:00:00.000Z')
const paspoort = () => livePage('p-paspoort', { nl: 2891, en: 210, tr: 264, ar: 118 }, '2026-08-26T10:00:00.000Z')
const afval = () => livePage('p-afval', { nl: 1683, en: 64, tr: 97, ar: 41 }, '2026-09-02T10:00:00.000Z')
const bijstandLive = () => livePage('p-bijstand', { nl: 2104, en: 131, tr: 198, ar: 88 }, '2026-09-08T14:10:00.000Z')

export interface Snapshot {
  config: Config
  pages: Page[]
  videos: { used: number; total: number }
  reruns: { used: number; total: number }
  user: 'esmee' | 'emre'
}

/**
 * Elke stand wordt vers opgebouwd. Dat is bewust: een ondiepe kopie zou de
 * langs-objecten met de vorige stand delen, waardoor goedkeuringen uit het ene
 * scenario in het andere opduiken zodra je heen en weer schakelt.
 */
export function snapshotFor(id: ScenarioId): Snapshot {
  const user = SCENARIOS.find((s) => s.id === id)?.user ?? 'esmee'

  if (id === 'eerste') {
    return {
      config: {
        ...EMPTY_CONFIG,
        languages: [...EMPTY_CONFIG.languages],
        backgrounds: [],
        widgetMargin: { ...EMPTY_CONFIG.widgetMargin },
      },
      pages: [],
      videos: { used: 0, total: VIDEOS_TOTAL },
      reruns: { used: 0, total: RERUNS_TOTAL },
      user,
    }
  }

  const config: Config = {
    ...SEED_CONFIG,
    languages: [...SEED_CONFIG.languages] as Lang[],
    avatars: { ...SEED_CONFIG.avatars },
    backgrounds: [...SEED_CONFIG.backgrounds],
    widgetMargin: { ...SEED_CONFIG.widgetMargin },
  }

  if (id === 'derde') {
    return {
      config,
      pages: [bijstandLive(), wmo(), paspoort(), afval()],
      videos: { used: 4, total: VIDEOS_TOTAL },
      reruns: { used: 0, total: RERUNS_TOTAL },
      user,
    }
  }

  // tweede en emre delen dezelfde data; alleen wie er kijkt verschilt.
  return {
    config,
    pages: [bijstandInProductie(), wmo(), paspoort()],
    videos: { used: 3, total: VIDEOS_TOTAL },
    reruns: { used: 0, total: RERUNS_TOTAL },
    user,
  }
}
