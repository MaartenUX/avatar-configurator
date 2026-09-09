import type { Lang } from '../state/types'

export interface LangDef {
  code: Lang
  /** Nederlandse naam, zoals de webredacteur hem ziet. */
  label: string
  /** Naam in de taal zelf, voor de collega-view. */
  native: string
  dir: 'ltr' | 'rtl'
}

export const LANGS: LangDef[] = [
  { code: 'nl', label: 'Nederlands', native: 'Nederlands', dir: 'ltr' },
  { code: 'en', label: 'Engels', native: 'English', dir: 'ltr' },
  { code: 'de', label: 'Duits', native: 'Deutsch', dir: 'ltr' },
  { code: 'fr', label: 'Frans', native: 'Français', dir: 'ltr' },
  { code: 'tr', label: 'Turks', native: 'Türkçe', dir: 'ltr' },
  { code: 'ar', label: 'Arabisch', native: 'العربية', dir: 'rtl' },
  { code: 'pl', label: 'Pools', native: 'Polski', dir: 'ltr' },
  { code: 'el', label: 'Grieks', native: 'Ελληνικά', dir: 'ltr' },
  { code: 'es', label: 'Spaans', native: 'Español', dir: 'ltr' },
]

export const LANG_CODES = LANGS.map((l) => l.code)

const BY_CODE = Object.fromEntries(LANGS.map((l) => [l.code, l])) as Record<Lang, LangDef>

export const langDef = (code: Lang) => BY_CODE[code]
export const langLabel = (code: Lang) => BY_CODE[code]?.label ?? code
export const langDir = (code: Lang) => BY_CODE[code]?.dir ?? 'ltr'
export const isLang = (v: unknown): v is Lang =>
  typeof v === 'string' && Object.hasOwn(BY_CODE, v)

/** Nederlands staat vast; dit zijn de talen waar de redacteur uit kiest (max 4). */
export const OPTIONAL_LANGS: Lang[] = ['en', 'de', 'fr', 'tr', 'ar', 'pl', 'el', 'es']
export const MAX_EXTRA_LANGS = 4
