import type { Lang, Page, Timer, TimerKind } from './types'

/** Mock-duur per timersoort, in ms. Met ?fast=1 wordt alles 1 seconde. */
const BASE: Record<TimerKind, number> = {
  summarize: 6000,
  audio: 3000,
  generate: 8000,
  demo: 8000,
}

/** Wat de gebruiker als "echte" duur te zien krijgt in de copy (minuten). */
export const ETA_MIN: Record<TimerKind, number> = {
  summarize: 1,
  audio: 2,
  generate: 20,
  demo: 30,
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
 * Past afgelopen timers op een pagina toe. Puur en idempotent: geeft null
 * terug als er niets te doen is, zodat de ticker elke 250 ms mag draaien
 * zonder een re-render te veroorzaken.
 *
 * Sinds CHANGES-03 F21 loopt elke taal zijn eigen keten:
 * waiting → review-text → generating → review-video → approved. De talen
 * hebben daarom een eigen timer; de paginatimer doet alleen de samenvatting
 * en het aanmaken van alle scripts tegelijk.
 */
export function advancePage(page: Page, now: number, fast: boolean): Page | null {
  let veranderd = false
  let status = page.status
  let timer = page.timer
  let langs = page.langs

  if (timer && now >= deadlineOf(timer, fast)) {
    if (timer.kind === 'summarize') {
      status = 'review-summary'
    } else if (timer.kind === 'audio') {
      // De scripts van álle talen komen tegelijk klaar, niet pas na het
      // Nederlandse akkoord.
      const volgende: Page['langs'] = { ...langs }
      for (const code of Object.keys(volgende) as Lang[]) {
        if (volgende[code]!.status === 'waiting') {
          volgende[code] = { ...volgende[code]!, status: 'review-text' }
        }
      }
      langs = volgende
    }
    timer = undefined
    veranderd = true
  }

  // Per taal: de video is klaar.
  const volgende: Page['langs'] = { ...langs }
  let taalVeranderd = false
  for (const code of Object.keys(volgende) as Lang[]) {
    const entry = volgende[code]!
    if (!entry.timer || now < deadlineOf(entry.timer, fast)) continue
    volgende[code] = { ...entry, status: 'review-video', timer: undefined, etaMin: undefined }
    taalVeranderd = true
  }
  if (taalVeranderd) {
    langs = volgende
    veranderd = true
  }

  if (!veranderd) return null
  return { ...page, status: nextPageStatus(langs, status), timer, langs }
}

/**
 * Pagina-status volgt uit de talen, zodat kaart en rijen niet uiteen kunnen
 * lopen. De twee standen vóór de talen (samenvatting maken en controleren)
 * worden meegegeven, want die zeggen niets over een taal.
 */
export function nextPageStatus(
  langs: Page['langs'],
  huidig: Page['status'] = 'in-production',
): Page['status'] {
  if (huidig === 'summarizing' || huidig === 'review-summary') return huidig

  const alle = Object.values(langs).filter(Boolean) as { status: string }[]
  if (alle.length === 0) return 'in-production'
  if (alle.every((l) => l.status === 'live')) return 'live'
  if (alle.every((l) => l.status === 'approved' || l.status === 'live')) return 'ready-to-publish'
  return 'in-production'
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
