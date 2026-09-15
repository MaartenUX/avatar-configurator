import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  Config,
  Lang,
  Page,
  Scene,
  SubtitleLine,
  ToastState,
  ToastTone,
  TeamMember,
} from './types'
import { nextPageStatus, startTimer, tickPages } from './timers'
import { snapshotFor, type ScenarioId } from '../data/seed'
import { fallbackContent, pageContent, RESERVED_IDS } from '../data'
import { TEAM } from '../data/team'

export interface Store {
  /** Welke stand van het prototype je bekijkt. Stuurt de seed en de gebruiker. */
  scenario: ScenarioId
  user: 'esmee' | 'emre'
  /** Aantal uitlegvideo's dat je mag maken. */
  videos: { used: number; total: number }
  /** Eén gezamenlijke pot voor opnieuw maken, over alle video's heen. */
  reruns: { used: number; total: number }
  config: Config
  pages: Page[]
  team: TeamMember[]
  fast: boolean
  /** Niet persistent: een reload mag geen oude toast opgraven. */
  toast: ToastState | null
  highlightPageId: string | null

  // configuratie
  startConfig: () => void
  patchConfig: (patch: Partial<Config>) => void
  setScrollY: (y: number) => void
  lockConfig: () => void

  // productie
  addPage: (url: string, title: string) => string
  editScenes: (id: string, scenes: Scene[]) => void
  editTranslation: (id: string, lang: Lang, scenes: Scene[]) => void
  editSubtitles: (id: string, lang: Lang, lines: SubtitleLine[]) => void
  approveSummary: (id: string) => void
  approveNl: (id: string) => void
  approveLang: (id: string, lang: Lang) => void
  approveVideo: (id: string, lang: Lang) => void
  publish: (id: string) => void
  rerun: (id: string, lang?: Lang) => void
  regenerateAudio: (id: string) => void

  // ui
  flash: (t: { text: string; tone?: ToastTone; pageId?: string | null }) => void
  dismissToast: () => void
  clearHighlight: () => void

  // sessie
  tick: (now: number) => void
  setFast: (fast: boolean) => void
  setScenario: (scenario: ScenarioId) => void
  resetScenario: () => void
}

/** Reviewer per taal, uit het team. Valt terug op Esmee. */
const reviewerFor = (lang: Lang) =>
  TEAM.find((m) => m.langs?.includes(lang) && m.role === 'member')?.name ?? 'Esmee de Vries'

const newId = (title: string) => {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 32)
  const base = `p-${slug || 'pagina'}`
  return RESERVED_IDS.has(base) ? `${base}-1` : base
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      scenario: 'tweede',
      team: TEAM,
      fast: false,
      toast: null,
      highlightPageId: null,
      ...snapshotFor('tweede'),

      // ---------------------------------------------------------------- config
      startConfig: () =>
        set((s) => ({ config: { ...s.config, status: s.config.status === 'locked' ? 'locked' : 'draft' } })),

      patchConfig: (patch) =>
        set((s) => {
          if (s.config.status === 'locked') return s
          return { config: { ...s.config, ...patch, status: 'draft' } }
        }),

      setScrollY: (y) => set((s) => ({ config: { ...s.config, scrollY: y } })),

      lockConfig: () =>
        set((s) => ({
          config: { ...s.config, status: 'locked', signedAt: new Date().toISOString() },
        })),

      // ------------------------------------------------------------ productie
      addPage: (url, title) => {
        const id = newId(title)
        const content = pageContent(id) ?? fallbackContent(id, url, title)
        const langs: Page['langs'] = {}
        for (const l of get().config.languages) {
          langs[l] = { status: 'waiting', reviewer: reviewerFor(l) }
        }
        const page: Page = {
          id,
          url,
          title,
          status: 'summarizing',
          scenes: content.scenes,
          translations: content.translations,
          subtitles: content.subtitles,
          langs,
          views: {},
          createdAt: new Date().toISOString(),
          timer: startTimer('summarize'),
        }
        set((s) => ({
          pages: [page, ...s.pages.filter((p) => p.id !== id)],
          videos: { ...s.videos, used: Math.min(s.videos.total, s.videos.used + 1) },
        }))
        return id
      },

      editScenes: (id, scenes) =>
        set((s) => ({ pages: s.pages.map((p) => (p.id === id ? { ...p, scenes } : p)) })),

      editTranslation: (id, lang, scenes) =>
        set((s) => ({
          pages: s.pages.map((p) =>
            p.id === id ? { ...p, translations: { ...p.translations, [lang]: scenes } } : p,
          ),
        })),

      editSubtitles: (id, lang, lines) =>
        set((s) => ({
          pages: s.pages.map((p) =>
            p.id === id ? { ...p, subtitles: { ...p.subtitles, [lang]: lines } } : p,
          ),
        })),

      /**
       * Basissamenvatting akkoord. De Nederlandse audio wordt gemaakt, en
       * Nederlands komt op review-text te staan: dat is de scriptstap, die
       * daarmee als eigen actie op de paginakaart verschijnt. Esmee keurt die
       * zelf goed, net als straks de Nederlandse ondertiteling.
       */
      approveSummary: (id) =>
        set((s) => ({
          pages: s.pages.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: 'review-nl',
                  langs: p.langs.nl
                    ? { ...p.langs, nl: { ...p.langs.nl, status: 'review-text' } }
                    : p.langs,
                  samenvattingDoor: TEAM.find((m) => m.role === 'owner')?.name,
                  timer: startTimer('audio'),
                }
              : p,
          ),
        })),

      // NL-script akkoord -> alle talen gaan tegelijk de generatie in.
      approveNl: (id) =>
        set((s) => ({
          pages: s.pages.map((p) => {
            if (p.id !== id) return p
            const langs: Page['langs'] = {}
            for (const code of Object.keys(p.langs) as Lang[]) {
              langs[code] = { ...p.langs[code]!, status: 'generating', etaMin: 20 }
            }
            return { ...p, langs, status: 'in-translation', timer: startTimer('generate') }
          }),
        })),

      // Collega keurt de tekst goed -> de video voor die taal wordt gemaakt.
      approveLang: (id, lang) =>
        set((s) => ({
          pages: s.pages.map((p) => {
            if (p.id !== id) return p
            const langs = { ...p.langs, [lang]: { ...p.langs[lang]!, status: 'generating' as const, etaMin: 20 } }
            return { ...p, langs, status: nextPageStatus(langs), timer: startTimer('generate', lang) }
          }),
        })),

      approveVideo: (id, lang) =>
        set((s) => ({
          pages: s.pages.map((p) => {
            if (p.id !== id) return p
            const langs = { ...p.langs, [lang]: { ...p.langs[lang]!, status: 'approved' as const } }
            return { ...p, langs, status: nextPageStatus(langs) }
          }),
        })),

      publish: (id) =>
        set((s) => ({
          pages: s.pages.map((p) => {
            if (p.id !== id) return p
            const langs: Page['langs'] = {}
            for (const code of Object.keys(p.langs) as Lang[]) {
              langs[code] = { ...p.langs[code]!, status: 'live' }
            }
            return { ...p, langs, status: 'live', views: p.views }
          }),
        })),

      rerun: (id, lang) =>
        set((s) => ({
          videos: { ...s.videos, used: Math.min(s.videos.total, s.videos.used + 1) },
          pages: s.pages.map((p) => {
            if (p.id !== id) return p
            if (!lang) {
              return { ...p, status: 'summarizing', timer: startTimer('summarize') }
            }
            const langs = { ...p.langs, [lang]: { ...p.langs[lang]!, status: 'generating' as const, etaMin: 20 } }
            return { ...p, langs, status: nextPageStatus(langs), timer: startTimer('generate', lang) }
          }),
        })),

      // Audio opnieuw maken is gratis.
      regenerateAudio: (id) =>
        set((s) => ({
          pages: s.pages.map((p) =>
            p.id === id ? { ...p, audioReady: false, timer: startTimer('audio') } : p,
          ),
        })),

      // ------------------------------------------------------------------- ui
      flash: ({ text, tone = 'success', pageId = null }) =>
        set({
          toast: { id: `${Date.now()}`, text, tone, startedAt: Date.now() },
          highlightPageId: pageId,
        }),

      dismissToast: () => set({ toast: null }),
      clearHighlight: () => set({ highlightPageId: null }),

      // -------------------------------------------------------------- sessie
      tick: (now) => {
        const s = get()
        const next = tickPages(s.pages, now, s.fast)
        if (next) set({ pages: next })
      },

      setFast: (fast) => set({ fast }),

      /** Wisselen van stand bouwt de data vers op, zodat standen niet lekken. */
      setScenario: (scenario) =>
        set({ scenario, ...snapshotFor(scenario), toast: null, highlightPageId: null }),

      resetScenario: () =>
        set((s) => ({ ...snapshotFor(s.scenario), toast: null, highlightPageId: null })),
    }),
    {
      name: 'avatar-proto-v1',
      version: 1,
      /** Alleen voortgang bewaren, nooit de statische content. Dat houdt
       *  localStorage klein en voorkomt dat oude teksten blijven hangen. */
      partialize: (s) => ({
        scenario: s.scenario,
        user: s.user,
        videos: s.videos,
        reruns: s.reruns,
        config: s.config,
        pages: s.pages.map((p) => ({
          id: p.id,
          url: p.url,
          title: p.title,
          createdAt: p.createdAt,
          status: p.status,
          langs: p.langs,
          views: p.views,
          timer: p.timer,
          audioReady: p.audioReady,
          samenvattingDoor: p.samenvattingDoor,
          // Alleen bewaren wat de gebruiker zelf heeft aangepast.
          scenes: p.scenes,
          translations: p.translations,
          subtitles: p.subtitles,
        })),
      }),
      onRehydrateStorage: () => (state) => {
        // Timers die tijdens het wegklikken zijn afgelopen meteen afhandelen.
        state?.tick(Date.now())
      },
    },
  ),
)

export const storeApi = useStore
