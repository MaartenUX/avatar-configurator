export type Lang = 'nl' | 'en' | 'de' | 'fr' | 'tr' | 'ar' | 'pl' | 'el' | 'es'

/** Statusverloop per taal: waiting -> review-text -> generating -> review-video -> approved -> live */
export type LangStatus =
  | 'waiting'
  | 'review-text'
  | 'generating'
  | 'review-video'
  | 'approved'
  | 'live'

export type PageStatus =
  | 'summarizing'
  | 'review-summary'
  | 'review-nl'
  | 'in-translation'
  | 'ready-to-publish'
  | 'live'

export type TimerKind = 'summarize' | 'audio' | 'generate'

/** We slaan op wanneer een timer begon, niet wanneer hij afloopt. Zo overleeft
 *  hij een reload en verandert ?fast=1 ook timers die al lopen. */
export interface Timer {
  kind: TimerKind
  startedAt: number
  /** Alleen gezet als de timer één taal betreft (na approveLang). */
  lang?: Lang
}

export interface Scene {
  title: string
  text: string
}

export interface SubtitleLine {
  t: string
  text: string
}

export interface LangState {
  status: LangStatus
  reviewer?: string
  etaMin?: number
}

export interface Page {
  id: string
  url: string
  title: string
  status: PageStatus
  scenes: Scene[]
  translations: Partial<Record<Lang, Scene[]>>
  subtitles: Partial<Record<Lang, SubtitleLine[]>>
  langs: Partial<Record<Lang, LangState>>
  views: Partial<Record<Lang, number>>
  createdAt: string
  timer?: Timer
  /** Zet zodra de mock-audio voor het NL-script klaar is. */
  audioReady?: boolean
}

export type WidgetCorner = 'lb' | 'rb' | 'lt' | 'rt'

export interface Config {
  status: 'empty' | 'draft' | 'locked'
  /** Afgeleid uit de secties, niet de bron van waarheid. Zie sections.ts. */
  doneSections: number[]
  scrollY: number
  siteUrl: string
  logo?: string
  primary?: string
  secondary?: string
  widgetCorner: WidgetCorner
  /** Marge vanaf de rand van de pagina, in pixels. */
  widgetMargin: { x: number; y: number }
  /** Tweede URL: een contentpagina ziet er anders uit dan een homepage. */
  contentUrl?: string
  /** Standaard kantoorshots of eigen foto's per scène. */
  achtergrondModus?: 'standaard' | 'eigen'
  level: 'B1' | 'B2'
  languages: Lang[]
  avatars: Partial<Record<Lang, string>>
  /** Pas gezet zodra de gebruiker kiest; leeg = nog geen keuze. */
  videoType?: 'vast' | 'adaptief'
  /** Vier shots; null = standaard kantoorshot. Leeg = nog geen keuze. */
  backgrounds: (string | null)[]
  signedAt?: string
}

export interface TeamMember {
  name: string
  email: string
  role: 'owner' | 'member'
  /** Talen die deze collega controleert. */
  langs?: Lang[]
}

export type ToastTone = 'success' | 'info' | 'error'

export interface ToastState {
  id: string
  text: string
  tone: ToastTone
  startedAt: number
}
