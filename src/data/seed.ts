import type { Config, Page } from '../state/types'
import { pageContent } from './index'

export const EMPTY_CONFIG: Config = {
  status: 'empty',
  doneSections: [],
  scrollY: 0,
  siteUrl: '',
  widgetCorner: 'rb',
  level: 'B1',
  languages: ['nl'],
  avatars: {},
  videoType: 'vast',
  backgrounds: [null, null, null, null],
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

const livePage = (id: string, views: Page['views'], createdAt: string): Page => ({
  id,
  ...contentOf(id),
  status: 'live',
  langs: {
    nl: { status: 'live', reviewer: 'Vincent Bakker' },
    en: { status: 'live', reviewer: 'Vincent Bakker' },
    tr: { status: 'live', reviewer: 'Emre Yılmaz' },
    ar: { status: 'live', reviewer: 'Layla Haddad' },
  },
  views,
  createdAt,
})

/**
 * De terugkerende staat: één pagina midden in productie met de statusmix uit
 * het bouwplan, plus drie pagina's die al live staan.
 */
export const SEED_PAGES: Page[] = [
  {
    id: 'p-bijstand',
    ...contentOf('p-bijstand'),
    status: 'in-translation',
    langs: {
      nl: { status: 'approved', reviewer: 'Vincent Bakker' },
      en: { status: 'review-text', reviewer: 'Vincent Bakker' },
      tr: { status: 'review-video', reviewer: 'Emre Yılmaz' },
      ar: { status: 'generating', reviewer: 'Layla Haddad', etaMin: 12 },
    },
    views: {},
    createdAt: '2026-09-08T14:10:00.000Z',
  },
  livePage('p-wmo', { nl: 1240, en: 86, tr: 152, ar: 74 }, '2026-08-19T10:00:00.000Z'),
  livePage('p-paspoort', { nl: 2891, en: 210, tr: 264, ar: 118 }, '2026-08-26T10:00:00.000Z'),
  livePage('p-afval', { nl: 1683, en: 64, tr: 97, ar: 41 }, '2026-09-02T10:00:00.000Z'),
]
