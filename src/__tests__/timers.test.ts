import { describe, expect, it } from 'vitest'
import { advancePage, durationOf, nextPageStatus } from '../state/timers'
import type { Page } from '../state/types'

const basePage = (over: Partial<Page> = {}): Page => ({
  id: 'p-test',
  url: 'https://www.bergrode.nl/test',
  title: 'Test',
  status: 'summarizing',
  scenes: [],
  translations: {},
  subtitles: {},
  langs: {},
  views: {},
  createdAt: '2026-09-09T10:00:00.000Z',
  ...over,
})

describe('advancePage', () => {
  it('doet niets zolang de timer loopt', () => {
    const p = basePage({ timer: { kind: 'summarize', startedAt: 1000 } })
    expect(advancePage(p, 1000 + 5999, false)).toBeNull()
  })

  it('zet de samenvatting klaar om te controleren', () => {
    const p = basePage({ timer: { kind: 'summarize', startedAt: 1000 } })
    const next = advancePage(p, 1000 + 6000, false)
    expect(next?.status).toBe('review-summary')
    expect(next?.timer).toBeUndefined()
  })

  it('zet de scripts van álle talen tegelijk klaar', () => {
    // Niet pas na het Nederlandse akkoord: elke taal krijgt meteen een script.
    const p = basePage({
      status: 'in-production',
      timer: { kind: 'audio', startedAt: 0 },
      langs: {
        nl: { status: 'waiting' },
        en: { status: 'waiting' },
        tr: { status: 'waiting' },
        ar: { status: 'waiting' },
      },
    })
    const next = advancePage(p, 3000, false)
    for (const code of ['nl', 'en', 'tr', 'ar'] as const) {
      expect(next?.langs[code]?.status, code).toBe('review-text')
    }
  })

  it('laat elke taal zijn eigen video-timer lopen', () => {
    const p = basePage({
      status: 'in-production',
      langs: {
        nl: { status: 'generating', timer: { kind: 'generate', startedAt: 0, lang: 'nl' } },
        tr: { status: 'review-text' },
      },
    })
    const next = advancePage(p, 8000, false)
    expect(next?.langs.nl?.status).toBe('review-video')
    expect(next?.langs.nl?.timer).toBeUndefined()
    expect(next?.langs.tr?.status).toBe('review-text')
  })

  it('is idempotent: na afhandelen valt er niets meer af te handelen', () => {
    const p = basePage({ timer: { kind: 'summarize', startedAt: 0 } })
    const once = advancePage(p, 10_000, false)!
    expect(advancePage(once, 10_000, false)).toBeNull()
  })

  it('gebruikt één seconde in de snelle modus', () => {
    expect(durationOf('generate', true)).toBe(1000)
    expect(durationOf('generate', false)).toBe(8000)
    expect(durationOf('demo', false)).toBe(8000)
  })
})

describe('nextPageStatus', () => {
  it('laat de twee standen vóór de talen met rust', () => {
    expect(nextPageStatus({ nl: { status: 'waiting' } }, 'summarizing')).toBe('summarizing')
    expect(nextPageStatus({ nl: { status: 'waiting' } }, 'review-summary')).toBe('review-summary')
  })

  it('is klaar om te publiceren zodra elke taal is goedgekeurd', () => {
    expect(nextPageStatus({ nl: { status: 'approved' }, tr: { status: 'approved' } })).toBe(
      'ready-to-publish',
    )
  })

  it('blijft in productie zolang er één taal onderweg is', () => {
    expect(nextPageStatus({ nl: { status: 'approved' }, tr: { status: 'generating' } })).toBe(
      'in-production',
    )
  })

  it('is live als alles live is', () => {
    expect(nextPageStatus({ nl: { status: 'live' } })).toBe('live')
  })
})
