import { describe, expect, it } from 'vitest'
import { PAGE_CONTENT, RESERVED_IDS } from '../data'
import { AVATARS, advisedFor, avatarsFor } from '../data/avatars'
import { LANGS } from '../data/langs'
import { LEARN_MORE } from '../data/learnmore'
import { parseTimecode } from '../lib/format'
import { nextAction } from '../state/selectors'
import type { Page } from '../state/types'

describe('content', () => {
  it('geeft elke volledige pagina vier scènes, ook in vertaling', () => {
    for (const page of PAGE_CONTENT.filter((p) => !p.thin)) {
      expect(page.scenes, page.id).toHaveLength(4)
      for (const [lang, scenes] of Object.entries(page.translations)) {
        expect(scenes, `${page.id} ${lang}`).toHaveLength(4)
      }
    }
  })

  it('houdt scènes binnen de 50 woorden', () => {
    for (const page of PAGE_CONTENT.filter((p) => !p.thin)) {
      for (const scene of page.scenes) {
        expect(scene.text.trim().split(/\s+/).length, `${page.id}: ${scene.title}`).toBeLessThanOrEqual(50)
      }
    }
  })

  it('geeft ondertitels 8 tot 10 regels met oplopende tijdcodes binnen 1:50', () => {
    for (const page of PAGE_CONTENT.filter((p) => !p.thin)) {
      for (const [lang, lines] of Object.entries(page.subtitles)) {
        expect(lines!.length, `${page.id} ${lang}`).toBeGreaterThanOrEqual(8)
        expect(lines!.length, `${page.id} ${lang}`).toBeLessThanOrEqual(10)

        const times = lines!.map((l) => parseTimecode(l.t))
        expect(times, `${page.id} ${lang}`).toEqual([...times].sort((a, b) => a - b))
        expect(times.at(-1), `${page.id} ${lang}`).toBeLessThanOrEqual(110)
      }
    }
  })

  it('gebruikt geen id dat met een route botst', () => {
    for (const page of PAGE_CONTENT) expect(RESERVED_IDS.has(page.id)).toBe(false)
  })
})

describe('avatars', () => {
  it('geeft elke taal een vrouw, een man en precies één advies', () => {
    for (const lang of LANGS) {
      const set = avatarsFor(lang.code)
      expect(set, lang.code).toHaveLength(2)
      expect(set.map((a) => a.gender).sort()).toEqual(['m', 'v'])
      expect(set.filter((a) => a.advised), lang.code).toHaveLength(1)
      expect(advisedFor(lang.code)).toBeDefined()
    }
  })

  it('geeft elke avatar drie of vier steekwoorden en een voorbeeldzin', () => {
    for (const a of AVATARS) {
      expect(a.keywords.length, a.id).toBeGreaterThanOrEqual(3)
      expect(a.keywords.length, a.id).toBeLessThanOrEqual(4)
      expect(a.sampleSentence.length, a.id).toBeGreaterThan(10)
    }
  })
})

describe('learnmore', () => {
  it('geeft elke sectie vier features en drie vragen', () => {
    expect(LEARN_MORE).toHaveLength(6)
    for (const l of LEARN_MORE) {
      expect(l.features, l.id).toHaveLength(4)
      expect(l.faq, l.id).toHaveLength(3)
    }
  })
})

const page = (over: Partial<Page>): Page => ({
  id: 'p-test', url: '', title: 'Test', status: 'summarizing',
  scenes: [], translations: {}, subtitles: {}, langs: {}, views: {},
  createdAt: '', ...over,
})

describe('nextAction', () => {
  it('wijst elke paginastatus naar de juiste spaak', () => {
    expect(nextAction(page({ status: 'review-summary' })).to).toBe('/paginas/p-test/samenvatting')
    expect(nextAction(page({ status: 'review-nl' })).to).toBe('/paginas/p-test/script')
    expect(nextAction(page({ status: 'ready-to-publish' })).to).toBe('/paginas/p-test/publiceren')
    expect(nextAction(page({ status: 'live' })).to).toBe('/paginas/p-test')
  })

  it('stuurt naar de video zodra er één te controleren valt', () => {
    const p = page({
      status: 'in-translation',
      langs: { nl: { status: 'review-video' }, tr: { status: 'generating' } },
    })
    expect(nextAction(p).to).toBe('/paginas/p-test/video/nl')
  })

  it('geeft geen knop zolang een collega aan zet is', () => {
    const p = page({
      status: 'in-translation',
      langs: { nl: { status: 'approved' }, tr: { status: 'review-text' } },
    })
    expect(nextAction(p).to).toBeNull()
    expect(nextAction(p).hint).toContain('collega')
  })

  it('laat Emre alleen zijn eigen taal zien', () => {
    const p = page({
      status: 'in-translation',
      langs: { nl: { status: 'review-video' }, tr: { status: 'review-text' } },
    })
    expect(nextAction(p, 'emre').to).toBe('/paginas/p-test/tr')
  })
})
