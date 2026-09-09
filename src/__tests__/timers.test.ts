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

  it('markeert de audio als klaar', () => {
    const p = basePage({ status: 'review-nl', timer: { kind: 'audio', startedAt: 0 } })
    const next = advancePage(p, 3000, false)
    expect(next?.audioReady).toBe(true)
    expect(next?.status).toBe('review-nl')
  })

  it('stuurt NL naar videocontrole en de andere talen naar tekstcontrole', () => {
    const p = basePage({
      status: 'in-translation',
      timer: { kind: 'generate', startedAt: 0 },
      langs: {
        nl: { status: 'generating' },
        tr: { status: 'generating' },
        ar: { status: 'generating' },
      },
    })
    const next = advancePage(p, 8000, false)
    expect(next?.langs.nl?.status).toBe('review-video')
    expect(next?.langs.tr?.status).toBe('review-text')
    expect(next?.langs.ar?.status).toBe('review-text')
  })

  it('raakt bij een taalspecifieke timer alleen die taal aan', () => {
    const p = basePage({
      status: 'in-translation',
      timer: { kind: 'generate', startedAt: 0, lang: 'tr' },
      langs: {
        nl: { status: 'approved' },
        tr: { status: 'generating' },
        ar: { status: 'generating' },
      },
    })
    const next = advancePage(p, 8000, false)
    expect(next?.langs.tr?.status).toBe('review-video')
    expect(next?.langs.ar?.status).toBe('generating')
  })

  it('is idempotent: na afhandelen valt er niets meer af te handelen', () => {
    const p = basePage({ timer: { kind: 'summarize', startedAt: 0 } })
    const once = advancePage(p, 10_000, false)!
    expect(advancePage(once, 10_000, false)).toBeNull()
  })

  it('gebruikt één seconde in de snelle modus', () => {
    expect(durationOf('generate', true)).toBe(1000)
    expect(durationOf('generate', false)).toBe(8000)
    const p = basePage({ timer: { kind: 'generate', startedAt: 0 }, langs: { nl: { status: 'generating' } } })
    expect(advancePage(p, 1000, true)).not.toBeNull()
    expect(advancePage(p, 1000, false)).toBeNull()
  })
})

describe('nextPageStatus', () => {
  it('is klaar om te publiceren zodra elke taal is goedgekeurd', () => {
    expect(nextPageStatus({ nl: { status: 'approved' }, tr: { status: 'approved' } })).toBe(
      'ready-to-publish',
    )
  })

  it('blijft in vertaling zolang er één taal onderweg is', () => {
    expect(nextPageStatus({ nl: { status: 'approved' }, tr: { status: 'generating' } })).toBe(
      'in-translation',
    )
  })

  it('is live als alles live is', () => {
    expect(nextPageStatus({ nl: { status: 'live' } })).toBe('live')
  })
})
