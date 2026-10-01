import { describe, expect, it } from 'vitest'
import { PAGE_CONTENT, RESERVED_IDS } from '../data'
import { AVATARS, advisedFor, avatarsFor } from '../data/avatars'
import { LANGS } from '../data/langs'
import { LEARN_MORE } from '../data/learnmore'
import { parseTimecode } from '../lib/format'
import { nextAction } from '../state/selectors'
import type { Page } from '../state/types'

describe('content', () => {
  it('geeft elke pagina zes scènes: intro, vier inhoud, outro', () => {
    for (const page of PAGE_CONTENT) {
      expect(page.scenes, page.id).toHaveLength(6)
      for (const [lang, scenes] of Object.entries(page.translations)) {
        expect(scenes, `${page.id} ${lang}`).toHaveLength(6)
      }
    }
  })

  it('geeft scènes geen titel', () => {
    for (const page of PAGE_CONTENT) {
      for (const scene of page.scenes) {
        expect(Object.keys(scene), page.id).toEqual(['text'])
      }
    }
  })

  it('geeft elke pagina in elk geval Nederlandse ondertiteling', () => {
    for (const page of PAGE_CONTENT) {
      expect(page.subtitles.nl, page.id).toBeDefined()
    }
  })

  it('houdt scènes binnen hun woordgrens: intro en outro korter', () => {
    for (const page of PAGE_CONTENT) {
      page.scenes.forEach((scene, i) => {
        const max = i === 0 || i === page.scenes.length - 1 ? 25 : 50
        expect(scene.text.trim().split(/\s+/).length, `${page.id} scène ${i}`).toBeLessThanOrEqual(max)
      })
    }
  })

  it('geeft ondertitels oplopende tijdcodes binnen 2:00', () => {
    for (const page of PAGE_CONTENT) {
      for (const [lang, lines] of Object.entries(page.subtitles)) {
        expect(lines!.length, `${page.id} ${lang}`).toBeGreaterThanOrEqual(28)
        expect(lines!.length, `${page.id} ${lang}`).toBeLessThanOrEqual(45)
        for (const line of lines!) {
          expect(line.text.length, `${page.id} ${lang}: "${line.text}"`).toBeLessThanOrEqual(42)
        }

        const times = lines!.map((l) => parseTimecode(l.t))
        expect(times, `${page.id} ${lang}`).toEqual([...times].sort((a, b) => a - b))
        expect(times.at(-1), `${page.id} ${lang}`).toBeLessThanOrEqual(120)
      }
    }
  })

  it('geeft de tracks die de test opent een realistisch tempo', () => {
    // Twee tot vier seconden per regel over twee minuten.
    for (const id of ['p-parkeervergunning', 'p-bijstand']) {
      const page = PAGE_CONTENT.find((p) => p.id === id)!
      for (const lang of ['nl', 'en', 'tr'] as const) {
        expect(page.subtitles[lang]!.length, `${id} ${lang}`).toBeGreaterThanOrEqual(35)
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
    expect(nextAction(page({ status: 'ready-to-publish' })).to).toBe('/paginas/p-test/publiceren')
    expect(nextAction(page({ status: 'live' })).to).toBe('/paginas/p-test')
  })

  it('stuurt naar het Nederlandse script zodra dat klaarstaat', () => {
    const p = page({
      status: 'in-production',
      langs: { nl: { status: 'review-text' }, tr: { status: 'review-text' } },
    })
    expect(nextAction(p).to).toBe('/paginas/p-test/script')
  })

  it('stuurt naar de video zodra er één te controleren valt', () => {
    const p = page({
      status: 'in-production',
      langs: { nl: { status: 'review-video' }, tr: { status: 'generating' } },
    })
    expect(nextAction(p).to).toBe('/paginas/p-test/video/nl')
  })

  it('geeft geen knop zolang een collega aan zet is', () => {
    const p = page({
      status: 'in-production',
      langs: { nl: { status: 'approved' }, tr: { status: 'review-text' } },
    })
    expect(nextAction(p).to).toBeNull()
    expect(nextAction(p).hint).toContain('collega')
  })

  it('laat Emre alleen zijn eigen taal zien', () => {
    const p = page({
      status: 'in-production',
      langs: { nl: { status: 'review-video' }, tr: { status: 'review-text' } },
    })
    expect(nextAction(p, 'emre').to).toBe('/paginas/p-test/tr')
  })
})
