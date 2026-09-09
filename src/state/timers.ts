import type { Lang, Page, Timer, TimerKind } from './types'

/** Mock-duur per timersoort, in ms. Met ?fast=1 wordt alles 1 seconde. */
const BASE: Record<TimerKind, number> = {
  summarize: 6000,
  audio: 3000,
  generate: 8000,
}

/** Wat de gebruiker als "echte" duur te zien krijgt in de copy (minuten). */
export const ETA_MIN: Record<TimerKind, number> = {
  summarize: 1,
  audio: 1,
  generate: 20,
}

export const durationOf = (kind: TimerKind, fast: boolean) => (fast ? 1000 : BASE[kind])

export const startTimer = (kind: TimerKind, lang?: Lang): Timer => ({
  kind,
  startedAt: Date.now(),
  ...(lang ? { lang } : {}),
})

export const deadlineOf = (t: Timer, fast: boolean) => t.startedAt + durationOf(t.kind, fast)

export const remainingOf = (t: Timer, fast: boolean, now: number) =>
  Math.max(0, deadlineOf(t, fast) - now)

export const progressOf = (t: Timer, fast: boolean, now: number) => {
  const d = durationOf(t.kind, fast)
  return Math.min(1, Math.max(0, (now - t.startedAt) / d))
}

/** Resterende "gevoelde" minuten, voor copy als "nog 12 min". */
export const etaMinutesOf = (t: Timer, fast: boolean, now: number) => {
  const left = 1 - progressOf(t, fast, now)
  return Math.max(1, Math.ceil(ETA_MIN[t.kind] * left))
}

/**
 * Past één afgelopen timer toe op een pagina. Puur en idempotent: geeft null
 * terug als er niets te doen is, zodat de ticker elke 250 ms mag draaien
 * zonder een re-render te veroorzaken.
 */
export function advancePage(page: Page, now: number, fast: boolean): Page | null {
  const t = page.timer
  if (!t || now < deadlineOf(t, fast)) return null

  switch (t.kind) {
    // De samenvatting is klaar: de webredacteur kan hem nakijken.
    case 'summarize':
      return { ...page, status: 'review-summary', timer: undefined }

    // De mock-audio bij het NL-script staat klaar.
    case 'audio':
      return { ...page, status: 'review-nl', audioReady: true, timer: undefined }

    // Video's zijn gemaakt. NL gaat naar videocontrole; de andere talen moeten
    // eerst door een collega op tekst worden gecontroleerd.
    case 'generate': {
      const langs = { ...page.langs }
      let touched = false

      for (const code of Object.keys(langs) as Lang[]) {
        const entry = langs[code]
        if (!entry || entry.status !== 'generating') continue
        // Een timer met een taal raakt alleen die taal aan.
        if (t.lang && t.lang !== code) continue
        langs[code] = {
          ...entry,
          status: code === 'nl' || t.lang === code ? 'review-video' : 'review-text',
          etaMin: undefined,
        }
        touched = true
      }

      if (!touched) return { ...page, timer: undefined }
      return { ...page, langs, status: nextPageStatus(langs), timer: undefined }
    }
  }
}

/** Pagina-status volgt uit de talen, zodat kaart en rijen niet uiteen kunnen lopen. */
export function nextPageStatus(langs: Page['langs']): Page['status'] {
  const all = Object.values(langs).filter(Boolean) as { status: string }[]
  if (all.length === 0) return 'in-translation'
  if (all.every((l) => l.status === 'live')) return 'live'
  if (all.every((l) => l.status === 'approved' || l.status === 'live')) return 'ready-to-publish'
  return 'in-translation'
}

/** Past alle afgelopen timers toe. Geeft null terug als er niets veranderde. */
export function tickPages(pages: Page[], now: number, fast: boolean): Page[] | null {
  let changed = false
  const next = pages.map((p) => {
    const advanced = advancePage(p, now, fast)
    if (advanced) changed = true
    return advanced ?? p
  })
  return changed ? next : null
}
